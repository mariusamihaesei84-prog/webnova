/**
 * Google Services Types
 *
 * Types for Google Indexing API and Search Console integration
 */

/**
 * Google API credentials configuration
 */
export interface GoogleCredentials {
  type: 'service_account';
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

/**
 * Indexing API request type
 */
export type IndexingRequestType = 'URL_UPDATED' | 'URL_DELETED';

/**
 * Indexing API request
 */
export interface IndexingRequest {
  url: string;
  type: IndexingRequestType;
}

/**
 * Indexing API response
 */
export interface IndexingResponse {
  urlNotificationMetadata: {
    url: string;
    latestUpdate?: {
      url: string;
      type: IndexingRequestType;
      notifyTime: string;
    };
    latestRemove?: {
      url: string;
      type: IndexingRequestType;
      notifyTime: string;
    };
  };
}

/**
 * Batch indexing result
 */
export interface BatchIndexingResult {
  successful: string[];
  failed: Array<{
    url: string;
    error: string;
  }>;
  totalRequests: number;
  successRate: number;
}

/**
 * Search Console site info
 */
export interface GSCSite {
  siteUrl: string;
  permissionLevel: 'siteOwner' | 'siteFullUser' | 'siteRestrictedUser' | 'siteUnverifiedUser';
}

/**
 * Search Console query parameters
 */
export interface GSCQueryParams {
  siteUrl: string;
  startDate: string;  // YYYY-MM-DD format
  endDate: string;    // YYYY-MM-DD format
  dimensions?: ('date' | 'query' | 'page' | 'country' | 'device' | 'searchAppearance')[];
  searchType?: 'web' | 'image' | 'video' | 'news';
  rowLimit?: number;
  startRow?: number;
  dimensionFilterGroups?: DimensionFilterGroup[];
}

/**
 * Dimension filter for GSC queries
 */
export interface DimensionFilterGroup {
  groupType?: 'and';
  filters: DimensionFilter[];
}

/**
 * Individual dimension filter
 */
export interface DimensionFilter {
  dimension: 'query' | 'page' | 'country' | 'device' | 'searchAppearance';
  operator: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'includingRegex' | 'excludingRegex';
  expression: string;
}

/**
 * Search Console query response row
 */
export interface GSCQueryRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

/**
 * Search Console query response
 */
export interface GSCQueryResponse {
  rows?: GSCQueryRow[];
  responseAggregationType?: 'auto' | 'byPage' | 'byProperty';
}

/**
 * Page performance metrics from GSC
 */
export interface PagePerformance {
  url: string;
  clicks: number;
  impressions: number;
  ctr: number;
  avgPosition: number;
  topQueries: Array<{
    query: string;
    clicks: number;
    impressions: number;
    position: number;
  }>;
  dateRange: {
    start: string;
    end: string;
  };
}

/**
 * URL inspection result
 */
export interface URLInspectionResult {
  url: string;
  inspectionResult: {
    indexStatusResult?: {
      verdict: 'PASS' | 'NEUTRAL' | 'FAIL' | 'VERDICT_UNSPECIFIED';
      coverageState: string;
      robotsTxtState?: string;
      indexingState?: string;
      lastCrawlTime?: string;
      pageFetchState?: string;
      googleCanonical?: string;
      userCanonical?: string;
    };
    mobileUsabilityResult?: {
      verdict: 'PASS' | 'NEUTRAL' | 'FAIL' | 'VERDICT_UNSPECIFIED';
      issues?: Array<{
        issueType: string;
        severity: 'WARNING' | 'ERROR';
        message: string;
      }>;
    };
    richResultsResult?: {
      verdict: 'PASS' | 'NEUTRAL' | 'FAIL' | 'VERDICT_UNSPECIFIED';
      detectedItems?: Array<{
        richResultType: string;
        items: any[];
      }>;
    };
  };
}

/**
 * Feedback loop analysis result
 */
export interface FeedbackAnalysis {
  url: string;
  status: 'healthy' | 'needs_attention' | 'underperforming' | 'not_indexed';
  metrics: {
    indexed: boolean;
    clicks: number;
    impressions: number;
    ctr: number;
    avgPosition: number;
  };
  recommendations: string[];
  suggestedActions: ('reindex' | 'update_content' | 'improve_title' | 'add_internal_links' | 'wait_for_indexing')[];
}
