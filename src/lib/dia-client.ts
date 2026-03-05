/**
 * DIA ERP Web Service v3 Client
 *
 * Session-based JSON API client for DIA ERP integration.
 * Uses POST requests to /<module>/json endpoints with session_id authentication.
 *
 * Base URL: https://kismetplastik.ws.dia.com.tr/api/v3
 *
 * All configuration is read from environment variables (never hardcoded).
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DiaConfig {
  apiUrl: string;
  username: string;
  password: string;
  apiKey: string;
  firmaKodu: string;
  donemKodu: string;
}

/** Raw DIA v3 API response structure */
export interface DiaV3Response {
  code: string;
  msg: string;
  data?: unknown;
}

/** Paginated list response from DIA v3 list services */
export interface DiaListResponse<T> {
  records: T[];
  total_count?: number;
}

/** Parameters for DIA v3 list service calls */
export interface DiaListParams {
  filters?: string;
  sorts?: string;
  params?: string;
  limit?: number;
  offset?: number;
}

export class DiaApiError extends Error {
  public readonly statusCode: number;
  public readonly responseBody: string | null;
  public readonly endpoint: string;

  constructor(message: string, statusCode: number, endpoint: string, responseBody: string | null = null) {
    super(message);
    this.name = "DiaApiError";
    this.statusCode = statusCode;
    this.endpoint = endpoint;
    this.responseBody = responseBody;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getConfig(): DiaConfig {
  const apiUrl = process.env.DIA_API_URL;
  const username = process.env.DIA_USERNAME;
  const password = process.env.DIA_PASSWORD;
  const apiKey = process.env.DIA_API_KEY;
  const firmaKodu = process.env.DIA_FIRMA_KODU ?? process.env.DIA_COMPANY_CODE ?? "";
  const donemKodu = process.env.DIA_DONEM_KODU ?? process.env.DIA_PERIOD_ID ?? "";

  if (!apiUrl || !username || !password) {
    throw new DiaApiError(
      "DIA ERP yapilandirmamis. DIA_API_URL, DIA_USERNAME ve DIA_PASSWORD ortam degiskenlerini ayarlayin.",
      0,
      "config",
    );
  }

  if (!apiKey) {
    throw new DiaApiError(
      "DIA API anahtari ayarlanmamis. DIA_API_KEY ortam degiskenini ayarlayin. API anahtarini DIA'dan temin edin.",
      0,
      "config",
    );
  }

  if (!firmaKodu || !donemKodu) {
    throw new DiaApiError(
      "DIA firma veya donem kodu ayarlanmamis. DIA_FIRMA_KODU ve DIA_DONEM_KODU ortam degiskenlerini ayarlayin.",
      0,
      "config",
    );
  }

  return {
    apiUrl: apiUrl.replace(/\/+$/, ""),
    username,
    password,
    apiKey,
    firmaKodu,
    donemKodu,
  };
}

// ---------------------------------------------------------------------------
// DiaClient class — DIA Web Service v3
// ---------------------------------------------------------------------------

export class DiaClient {
  private readonly config: DiaConfig;
  private sessionId: string | null = null;
  private sessionCreatedAt: number = 0;

  /** Session timeout: re-login after 25 minutes (DIA sessions typically expire at 30 min) */
  private static readonly SESSION_TIMEOUT_MS = 25 * 60 * 1000;

  constructor(config: DiaConfig) {
    this.config = config;
  }

  // -----------------------------------------------------------------------
  // Authentication — Session-based login/logout
  // -----------------------------------------------------------------------

  /**
   * Login to DIA v3 via POST to /sis/json.
   * Returns session_id on success.
   */
  private async login(): Promise<void> {
    const url = `${this.config.apiUrl}/sis/json`;

    const payload = {
      login: {
        username: this.config.username,
        password: this.config.password,
        params: { apikey: this.config.apiKey },
        disconnect_same_user: true,
        lang: "tr",
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => null);
      throw new DiaApiError(
        `DIA login HTTP hatasi: ${response.status} ${response.statusText}`,
        response.status,
        "/sis/json (login)",
        body,
      );
    }

    const data: DiaV3Response = await response.json();

    if (data.code !== "200") {
      throw new DiaApiError(
        `DIA login basarisiz: ${data.msg}`,
        parseInt(data.code, 10) || 401,
        "/sis/json (login)",
        JSON.stringify(data),
      );
    }

    this.sessionId = data.msg;
    this.sessionCreatedAt = Date.now();
  }

  /**
   * Logout from DIA v3 (best-effort, does not throw).
   */
  async logout(): Promise<void> {
    if (!this.sessionId) return;

    try {
      const url = `${this.config.apiUrl}/sis/json`;
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logout: { session_id: this.sessionId },
        }),
      });
    } catch {
      // Logout is best-effort
    } finally {
      this.sessionId = null;
      this.sessionCreatedAt = 0;
    }
  }

  private isSessionValid(): boolean {
    if (!this.sessionId) return false;
    return Date.now() - this.sessionCreatedAt < DiaClient.SESSION_TIMEOUT_MS;
  }

  private async ensureSession(): Promise<string> {
    if (!this.isSessionValid()) {
      await this.login();
    }
    return this.sessionId!;
  }

  // -----------------------------------------------------------------------
  // Core service call method
  // -----------------------------------------------------------------------

  /**
   * Call a DIA v3 service.
   *
   * @param module - DIA module name (e.g., "sis", "scf")
   * @param serviceName - Service name (e.g., "scf_stokkart_listele")
   * @param params - Additional service-specific parameters
   * @param isRetry - Internal flag for session-expiry retry
   */
  async callService<T = unknown>(
    module: string,
    serviceName: string,
    params: Record<string, unknown> = {},
    isRetry = false,
  ): Promise<T> {
    const sessionId = await this.ensureSession();
    const url = `${this.config.apiUrl}/${module}/json`;

    const payload = {
      [serviceName]: {
        session_id: sessionId,
        firma_kodu: this.config.firmaKodu,
        donem_kodu: this.config.donemKodu,
        ...params,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => null);
      throw new DiaApiError(
        `DIA API HTTP hatasi: ${response.status} ${response.statusText} [${module}/${serviceName}]`,
        response.status,
        `/${module}/json (${serviceName})`,
        body,
      );
    }

    const data: DiaV3Response = await response.json();

    // Handle session expiry — re-login once and retry
    if ((data.code === "401" || data.code === "403") && !isRetry) {
      this.sessionId = null;
      this.sessionCreatedAt = 0;
      return this.callService<T>(module, serviceName, params, true);
    }

    if (data.code !== "200") {
      throw new DiaApiError(
        `DIA servis hatasi [${serviceName}]: ${data.msg}`,
        parseInt(data.code, 10) || 500,
        `/${module}/json (${serviceName})`,
        JSON.stringify(data),
      );
    }

    // Return the data field, or msg if no data
    return (data.data ?? data.msg) as T;
  }

  // -----------------------------------------------------------------------
  // Convenience methods for common patterns
  // -----------------------------------------------------------------------

  /**
   * Call a list service with standard pagination params.
   */
  async listService<T>(
    module: string,
    serviceName: string,
    listParams?: DiaListParams,
    extraParams?: Record<string, unknown>,
  ): Promise<DiaListResponse<T>> {
    const params: Record<string, unknown> = {
      filters: listParams?.filters ?? "",
      sorts: listParams?.sorts ?? "",
      params: listParams?.params ?? "",
      limit: listParams?.limit ?? 50,
      offset: listParams?.offset ?? 0,
      ...extraParams,
    };

    const result = await this.callService<DiaListResponse<T>>(module, serviceName, params);

    // Normalize: if result is an array, wrap it
    if (Array.isArray(result)) {
      return { records: result as T[], total_count: (result as T[]).length };
    }

    // If result has a records field, use it; otherwise treat the whole thing as records
    if (result && typeof result === "object" && "records" in result) {
      return result;
    }

    // Fallback: wrap in standard shape
    return { records: result ? [result as T] : [], total_count: result ? 1 : 0 };
  }

  /**
   * Check DIA credit/kontor balance via sis module.
   */
  async checkCredit(): Promise<unknown> {
    return this.callService("sis", "sis_kontor_sorgula");
  }

  // -----------------------------------------------------------------------
  // Getters
  // -----------------------------------------------------------------------

  get currentSessionId(): string | null {
    return this.sessionId;
  }

  get firmaKodu(): string {
    return this.config.firmaKodu;
  }

  get donemKodu(): string {
    return this.config.donemKodu;
  }
}

// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------

let _instance: DiaClient | null = null;

/**
 * Returns the singleton DiaClient instance.
 * Throws if required env vars are missing.
 */
export function getDiaClient(): DiaClient {
  if (_instance) return _instance;
  const config = getConfig();
  _instance = new DiaClient(config);
  return _instance;
}

/**
 * Resets the singleton (useful for tests or config changes).
 */
export function resetDiaClient(): void {
  if (_instance) {
    _instance.logout().catch(() => {});
  }
  _instance = null;
}

/**
 * Checks whether DIA ERP integration is configured (all required env vars set).
 */
export function isDiaConfigured(): boolean {
  return Boolean(
    process.env.DIA_API_URL &&
    process.env.DIA_USERNAME &&
    process.env.DIA_PASSWORD &&
    process.env.DIA_API_KEY &&
    (process.env.DIA_FIRMA_KODU || process.env.DIA_COMPANY_CODE) &&
    (process.env.DIA_DONEM_KODU || process.env.DIA_PERIOD_ID),
  );
}
