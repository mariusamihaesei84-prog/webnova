/**
 * Google Search Console API Service
 *
 * Provides functionality to:
 * - Query search analytics data
 * - Inspect URLs for indexing status
 * - Monitor page performance
 * - Implement feedback loops for content optimization
 *
 * Setup requirements:
 * 1. Enable Search Console API in Google Cloud Console
 * 2. Add service account email as user in Search Console
 * 3. Configure credentials (same as Indexing API)
 *
 * @see https://developers.google.com/webmaster-tools/v1/api_reference_index
 */

import * as crypto from 'crypto';
import {
  GoogleCredentials,
  GSCQueryParams,
  GSCQueryResponse,
  GSCQueryRow,
  GSCSite,
  PagePerformance,
  URLInspectionResult,
  FeedbackAnalysis,
} from './types';

const GSC_API_BASE = 'https://searchconsole.googleapis.com/v1';
const WEBMASTERS_API_BASE = 'https://www.googleapis.com/webmasters/v3';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

export class GoogleSearchConsole {
  private credentials: GoogleCredentials | null = null;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private siteUrl: string;

  constructor(siteUrl: string, credentials?: GoogleCredentials | string) {
    this.siteUrl = siteUrl;
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
   * List all sites the service account has access to
   */
  async listSites(): Promise<GSCSite[]> {
    const token = await this.getAccessToken();

    const response = await fetch(`${WEBMASTERS_API_BASE}/sites`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GSC API error: ${response.status} - ${error}`);
    }

    const data = await response.json() as { siteEntry?: GSCSite[] };
    return data.siteEntry || [];
  }

  /**
   * Query search analytics data
   */
  async queryAnalytics(params: Partial<GSCQueryParams> = {}): Promise<GSCQueryResponse> {
    const token = await this.getAccessToken();

    const queryParams: GSCQueryParams = {
      siteUrl: this.siteUrl,
      startDate: params.startDate || this.getDateDaysAgo(28),
      endDate: params.endDate || this.getDateDaysAgo(0),
      dimensions: params.dimensions || ['page'],
      rowLimit: params.rowLimit || 1000,
      ...params,
    };

    const response = await fetch(
      `${WEBMASTERS_API_BASE}/sites/${encodeURIComponent(this.siteUrl)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(queryParams),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GSC API error: ${response.status} - ${error}`);
    }

    return response.json() as Promise<GSCQueryResponse>;
  }

  /**
   * Get performance metrics for a specific page
   */
  async getPagePerformance(pageUrl: string, days: number = 28): Promise<PagePerformance> {
    const startDate = this.getDateDaysAgo(days);
    const endDate = this.getDateDaysAgo(0);

    // Get page-level metrics
    const pageMetrics = await this.queryAnalytics({
      dimensions: ['page'],
      dimensionFilterGroups: [
        {
          filters: [
            {
              dimension: 'page',
              operator: 'equals',
              expression: pageUrl,
            },
          ],
        },
      ],
      startDate,
      endDate,
    });

    // Get query-level metrics for this page
    const queryMetrics = await this.queryAnalytics({
      dimensions: ['query'],
      dimensionFilterGroups: [
        {
          filters: [
            {
              dimension: 'page',
              operator: 'equals',
              expression: pageUrl,
            },
          ],
        },
      ],
      rowLimit: 10,
      startDate,
      endDate,
    });

    const pageRow = pageMetrics.rows?.[0];

    return {
      url: pageUrl,
      clicks: pageRow?.clicks || 0,
      impressions: pageRow?.impressions || 0,
      ctr: pageRow?.ctr || 0,
      avgPosition: pageRow?.position || 0,
      topQueries: (queryMetrics.rows || []).map(row => ({
        query: row.keys[0],
        clicks: row.clicks,
        impressions: row.impressions,
        position: row.position,
      })),
      dateRange: {
        start: startDate,
        end: endDate,
      },
    };
  }

  /**
   * Inspect URL for indexing status
   */
  async inspectUrl(pageUrl: string): Promise<URLInspectionResult> {
    const token = await this.getAccessToken();

    const response = await fetch(`${GSC_API_BASE}/urlInspection/index:inspect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        inspectionUrl: pageUrl,
        siteUrl: this.siteUrl,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`URL Inspection API error: ${response.status} - ${error}`);
    }

    const data = await response.json() as { inspectionResult: URLInspectionResult['inspectionResult'] };
    return {
      url: pageUrl,
      inspectionResult: data.inspectionResult,
    };
  }

  /**
   * Get all pages under a URL prefix
   */
  async getPagesUnderPrefix(urlPrefix: string, days: number = 28): Promise<GSCQueryRow[]> {
    const response = await this.queryAnalytics({
      dimensions: ['page'],
      dimensionFilterGroups: [
        {
          filters: [
            {
              dimension: 'page',
              operator: 'contains',
              expression: urlPrefix,
            },
          ],
        },
      ],
      startDate: this.getDateDaysAgo(days),
      endDate: this.getDateDaysAgo(0),
    });

    return response.rows || [];
  }

  /**
   * Analyze page performance and generate recommendations
   */
  async analyzePage(pageUrl: string): Promise<FeedbackAnalysis> {
    const performance = await this.getPagePerformance(pageUrl);

    let status: FeedbackAnalysis['status'] = 'healthy';
    const recommendations: string[] = [];
    const suggestedActions: FeedbackAnalysis['suggestedActions'] = [];

    // Check if page has any data (indicates indexing)
    const indexed = performance.impressions > 0;

    if (!indexed) {
      status = 'not_indexed';
      recommendations.push('Pagina nu are impresii - posibil neindexată');
      recommendations.push('Verifică URL Inspection pentru status indexare');
      suggestedActions.push('reindex');
      suggestedActions.push('wait_for_indexing');
    } else {
      // Analyze CTR
      if (performance.ctr < 0.02) {
        recommendations.push(`CTR scăzut (${(performance.ctr * 100).toFixed(2)}%) - îmbunătățește titlul și meta description`);
        suggestedActions.push('improve_title');
      }

      // Analyze position
      if (performance.avgPosition > 20) {
        status = 'underperforming';
        recommendations.push(`Poziție medie slabă (${performance.avgPosition.toFixed(1)}) - adaugă conținut și linkuri interne`);
        suggestedActions.push('update_content');
        suggestedActions.push('add_internal_links');
      } else if (performance.avgPosition > 10) {
        status = 'needs_attention';
        recommendations.push(`Poziție medie ${performance.avgPosition.toFixed(1)} - potențial de îmbunătățire`);
        suggestedActions.push('update_content');
      }

      // Analyze impressions vs clicks
      if (performance.impressions > 100 && performance.clicks < 5) {
        recommendations.push('Multe impresii dar puține click-uri - optimizează snippet-ul');
        suggestedActions.push('improve_title');
      }

      // Low traffic overall
      if (performance.clicks < 10 && performance.avgPosition <= 10) {
        recommendations.push('Poziție bună dar trafic scăzut - verifică volumul de căutare pentru keyword-uri');
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('Pagina performează bine!');
    }

    return {
      url: pageUrl,
      status,
      metrics: {
        indexed,
        clicks: performance.clicks,
        impressions: performance.impressions,
        ctr: performance.ctr,
        avgPosition: performance.avgPosition,
      },
      recommendations,
      suggestedActions: [...new Set(suggestedActions)],
    };
  }

  /**
   * Bulk analyze multiple pages
   */
  async analyzePages(pageUrls: string[]): Promise<FeedbackAnalysis[]> {
    const analyses: FeedbackAnalysis[] = [];

    for (const url of pageUrls) {
      try {
        const analysis = await this.analyzePage(url);
        analyses.push(analysis);
      } catch (error) {
        analyses.push({
          url,
          status: 'not_indexed',
          metrics: {
            indexed: false,
            clicks: 0,
            impressions: 0,
            ctr: 0,
            avgPosition: 0,
          },
          recommendations: [`Eroare la analiză: ${error instanceof Error ? error.message : String(error)}`],
          suggestedActions: ['reindex'],
        });
      }

      // Rate limiting
      await this.delay(200);
    }

    return analyses;
  }

  /**
   * Get summary statistics for site
   */
  async getSiteSummary(days: number = 28): Promise<{
    totalClicks: number;
    totalImpressions: number;
    avgCtr: number;
    avgPosition: number;
    topPages: Array<{ url: string; clicks: number; impressions: number }>;
    topQueries: Array<{ query: string; clicks: number; impressions: number }>;
  }> {
    const startDate = this.getDateDaysAgo(days);
    const endDate = this.getDateDaysAgo(0);

    // Get overall metrics
    const overallMetrics = await this.queryAnalytics({
      dimensions: [],
      startDate,
      endDate,
    });

    // Get top pages
    const topPages = await this.queryAnalytics({
      dimensions: ['page'],
      rowLimit: 10,
      startDate,
      endDate,
    });

    // Get top queries
    const topQueries = await this.queryAnalytics({
      dimensions: ['query'],
      rowLimit: 10,
      startDate,
      endDate,
    });

    const overall = overallMetrics.rows?.[0];

    return {
      totalClicks: overall?.clicks || 0,
      totalImpressions: overall?.impressions || 0,
      avgCtr: overall?.ctr || 0,
      avgPosition: overall?.position || 0,
      topPages: (topPages.rows || []).map(row => ({
        url: row.keys[0],
        clicks: row.clicks,
        impressions: row.impressions,
      })),
      topQueries: (topQueries.rows || []).map(row => ({
        query: row.keys[0],
        clicks: row.clicks,
        impressions: row.impressions,
      })),
    };
  }

  /**
   * Get date string for N days ago
   */
  protected getDateDaysAgo(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }

  /**
   * Get OAuth2 access token using service account JWT
   */
  private async getAccessToken(): Promise<string> {
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
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Mock Search Console for development/testing
 */
export class MockGoogleSearchConsole extends GoogleSearchConsole {
  private mockData: Map<string, PagePerformance> = new Map();

  constructor(siteUrl: string) {
    super(siteUrl);
    this.initMockData();
  }

  private initMockData(): void {
    // Initialize with some mock data
    const mockPages = [
      'cabinet-stomatologic',
      'cabinet-veterinar',
      'salon-infrumusetare',
    ];

    for (const slug of mockPages) {
      this.mockData.set(`https://webnova.ro/${slug}`, {
        url: `https://webnova.ro/${slug}`,
        clicks: Math.floor(Math.random() * 100),
        impressions: Math.floor(Math.random() * 1000),
        ctr: Math.random() * 0.1,
        avgPosition: Math.random() * 30 + 1,
        topQueries: [
          { query: `site ${slug}`, clicks: 10, impressions: 100, position: 5 },
          { query: `${slug} seo`, clicks: 5, impressions: 50, position: 8 },
        ],
        dateRange: {
          start: this.getDateDaysAgo(28),
          end: this.getDateDaysAgo(0),
        },
      });
    }
  }

  async getPagePerformance(pageUrl: string): Promise<PagePerformance> {
    console.log(`[MOCK] Getting performance for: ${pageUrl}`);

    return this.mockData.get(pageUrl) || {
      url: pageUrl,
      clicks: 0,
      impressions: 0,
      ctr: 0,
      avgPosition: 0,
      topQueries: [],
      dateRange: {
        start: this.getDateDaysAgo(28),
        end: this.getDateDaysAgo(0),
      },
    };
  }

  async queryAnalytics(): Promise<GSCQueryResponse> {
    console.log('[MOCK] Querying analytics');
    return { rows: [] };
  }

  async inspectUrl(pageUrl: string): Promise<URLInspectionResult> {
    console.log(`[MOCK] Inspecting URL: ${pageUrl}`);

    return {
      url: pageUrl,
      inspectionResult: {
        indexStatusResult: {
          verdict: 'PASS',
          coverageState: 'Submitted and indexed',
          robotsTxtState: 'ALLOWED',
          indexingState: 'INDEXING_ALLOWED',
          pageFetchState: 'SUCCESSFUL',
        },
      },
    };
  }
}
