/**
 * Google Indexing API Service
 *
 * Provides functionality to request Google indexing for new/updated URLs
 * Uses service account authentication with JWT tokens
 *
 * Setup requirements:
 * 1. Create a Google Cloud project
 * 2. Enable the Indexing API
 * 3. Create a service account with Indexing API permissions
 * 4. Add the service account email to Google Search Console as site owner
 * 5. Download the JSON credentials file
 *
 * @see https://developers.google.com/search/apis/indexing-api/v3/quickstart
 */

import * as crypto from 'crypto';
import {
  GoogleCredentials,
  IndexingRequest,
  IndexingResponse,
  IndexingRequestType,
  BatchIndexingResult,
} from './types';

const INDEXING_API_BASE = 'https://indexing.googleapis.com/v3/urlNotifications';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/indexing';

export class GoogleIndexingAPI {
  private credentials: GoogleCredentials | null = null;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  /**
   * Initialize with credentials from JSON file content or object
   */
  constructor(credentials?: GoogleCredentials | string) {
    if (credentials) {
      this.setCredentials(credentials);
    }
  }

  /**
   * Set credentials from JSON object or string
   */
  setCredentials(credentials: GoogleCredentials | string): void {
    if (typeof credentials === 'string') {
      this.credentials = JSON.parse(credentials);
    } else {
      this.credentials = credentials;
    }
  }

  /**
   * Load credentials from environment variable
   */
  loadFromEnv(envVar: string = 'GOOGLE_APPLICATION_CREDENTIALS_JSON'): void {
    const credentialsJson = process.env[envVar];
    if (!credentialsJson) {
      throw new Error(`Environment variable ${envVar} not set`);
    }
    this.setCredentials(credentialsJson);
  }

  /**
   * Request indexing for a URL (URL_UPDATED)
   */
  async indexUrl(url: string): Promise<IndexingResponse> {
    return this.notifyUrl(url, 'URL_UPDATED');
  }

  /**
   * Request removal of a URL from index (URL_DELETED)
   */
  async removeUrl(url: string): Promise<IndexingResponse> {
    return this.notifyUrl(url, 'URL_DELETED');
  }

  /**
   * Send notification to Indexing API
   */
  async notifyUrl(url: string, type: IndexingRequestType): Promise<IndexingResponse> {
    const token = await this.getAccessToken();

    const response = await fetch(`${INDEXING_API_BASE}:publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        url,
        type,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Indexing API error: ${response.status} - ${error}`);
    }

    return response.json() as Promise<IndexingResponse>;
  }

  /**
   * Get notification metadata for a URL
   */
  async getUrlStatus(url: string): Promise<IndexingResponse> {
    const token = await this.getAccessToken();

    const response = await fetch(
      `${INDEXING_API_BASE}/metadata?url=${encodeURIComponent(url)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Indexing API error: ${response.status} - ${error}`);
    }

    return response.json() as Promise<IndexingResponse>;
  }

  /**
   * Batch index multiple URLs with rate limiting
   *
   * Note: Google Indexing API has quotas:
   * - 200 requests per day per site
   * - Burst limit: 600 requests per minute
   */
  async batchIndex(
    urls: string[],
    options: {
      delayMs?: number;
      onProgress?: (completed: number, total: number) => void;
    } = {}
  ): Promise<BatchIndexingResult> {
    const { delayMs = 100, onProgress } = options;

    const result: BatchIndexingResult = {
      successful: [],
      failed: [],
      totalRequests: urls.length,
      successRate: 0,
    };

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];

      try {
        await this.indexUrl(url);
        result.successful.push(url);
      } catch (error) {
        result.failed.push({
          url,
          error: error instanceof Error ? error.message : String(error),
        });
      }

      if (onProgress) {
        onProgress(i + 1, urls.length);
      }

      // Rate limiting delay between requests
      if (i < urls.length - 1 && delayMs > 0) {
        await this.delay(delayMs);
      }
    }

    result.successRate = urls.length > 0
      ? (result.successful.length / urls.length) * 100
      : 0;

    return result;
  }

  /**
   * Get OAuth2 access token using service account JWT
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiry - 60000) {
      return this.accessToken;
    }

    if (!this.credentials) {
      throw new Error('Google credentials not configured');
    }

    const jwt = this.createJWT();

    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token request failed: ${response.status} - ${error}`);
    }

    const data = await response.json() as { access_token: string; expires_in: number };
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in * 1000);

    return this.accessToken!;
  }

  /**
   * Create JWT for service account authentication
   */
  private createJWT(): string {
    if (!this.credentials) {
      throw new Error('Credentials not set');
    }

    const now = Math.floor(Date.now() / 1000);

    const header = {
      alg: 'RS256',
      typ: 'JWT',
      kid: this.credentials.private_key_id,
    };

    const payload = {
      iss: this.credentials.client_email,
      sub: this.credentials.client_email,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
      scope: SCOPE,
    };

    const headerBase64 = this.base64UrlEncode(JSON.stringify(header));
    const payloadBase64 = this.base64UrlEncode(JSON.stringify(payload));
    const signatureInput = `${headerBase64}.${payloadBase64}`;

    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signatureInput);
    const signature = sign.sign(this.credentials.private_key, 'base64');
    const signatureBase64 = this.base64UrlEncode(Buffer.from(signature, 'base64'));

    return `${signatureInput}.${signatureBase64}`;
  }

  /**
   * Base64 URL-safe encoding
   */
  private base64UrlEncode(data: string | Buffer): string {
    const base64 = Buffer.isBuffer(data)
      ? data.toString('base64')
      : Buffer.from(data).toString('base64');

    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /**
   * Delay helper for rate limiting
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Create a mock Indexing API for development/testing
 */
export class MockGoogleIndexingAPI extends GoogleIndexingAPI {
  private mockResponses: Map<string, IndexingResponse> = new Map();

  async indexUrl(url: string): Promise<IndexingResponse> {
    console.log(`[MOCK] Indexing URL: ${url}`);

    const response: IndexingResponse = {
      urlNotificationMetadata: {
        url,
        latestUpdate: {
          url,
          type: 'URL_UPDATED',
          notifyTime: new Date().toISOString(),
        },
      },
    };

    this.mockResponses.set(url, response);
    return response;
  }

  async removeUrl(url: string): Promise<IndexingResponse> {
    console.log(`[MOCK] Removing URL: ${url}`);

    const response: IndexingResponse = {
      urlNotificationMetadata: {
        url,
        latestRemove: {
          url,
          type: 'URL_DELETED',
          notifyTime: new Date().toISOString(),
        },
      },
    };

    this.mockResponses.set(url, response);
    return response;
  }

  async getUrlStatus(url: string): Promise<IndexingResponse> {
    console.log(`[MOCK] Getting status for: ${url}`);

    return this.mockResponses.get(url) || {
      urlNotificationMetadata: { url },
    };
  }
}
