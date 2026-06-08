const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
const runningOnLocalhost =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);
const shouldUseLocalDevApi =
  import.meta.env.DEV &&
  runningOnLocalhost &&
  configuredApiBaseUrl &&
  !configuredApiBaseUrl.includes("localhost") &&
  !configuredApiBaseUrl.includes("127.0.0.1");

const API_BASE_URL =
  (shouldUseLocalDevApi ? "http://localhost:5000" : configuredApiBaseUrl) || "http://localhost:5000";

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function buildApiUrl(pathname: string) {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: RequestMethod;
  body?: unknown;
  token?: string | null;
  headers?: Record<string, string>;
  isFormData?: boolean;
  timeoutMs?: number;
}

export class HttpError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details: unknown = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

function getPayloadErrorMessage(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const message = "message" in payload && typeof payload.message === "string" ? payload.message : null;
  const details = "errors" in payload ? payload.errors : null;

  if (Array.isArray(details)) {
    const firstDetailedMessage = details.find(
      (detail) => detail && typeof detail === "object" && "msg" in detail && typeof detail.msg === "string",
    );

    if (firstDetailedMessage && typeof firstDetailedMessage.msg === "string") {
      return firstDetailedMessage.msg;
    }
  }

  return message;
}

export async function request<T>(pathname: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, headers = {}, isFormData = false, timeoutMs = 8000 } = options;

  const requestHeaders: Record<string, string> = {
    ...headers,
  };

  if (!isFormData) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetch(buildApiUrl(pathname), {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      throw new HttpError("Request timed out", 408, null);
    }
    throw error;
  } finally {
    globalThis.clearTimeout(timeoutId);
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new HttpError(
      getPayloadErrorMessage(payload) || "Request failed",
      response.status,
      typeof payload === "object" && payload !== null && "errors" in payload ? payload.errors : null,
    );
  }

  return payload as T;
}
