export const AUTH_TOKEN_STORAGE_KEY = "luckyreads.authToken";

export type ApiError = Error & {
  status?: number;
  fieldErrors?: Record<string, string[]>;
};

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

function getHeaders(headers?: HeadersInit) {
  const nextHeaders = new Headers(headers);

  if (!nextHeaders.has("Content-Type")) {
    nextHeaders.set("Content-Type", "application/json");
  }

  const token = getAuthToken();
  if (token && !nextHeaders.has("Authorization")) {
    nextHeaders.set("Authorization", `Token ${token}`);
  }

  return nextHeaders;
}

function normalizeFieldErrors(
  payload: unknown,
): Record<string, string[]> | undefined {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return undefined;
  }

  const entries = Object.entries(payload as Record<string, unknown>)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return [key, value.map((item) => String(item))] as const;
      }

      if (typeof value === "string") {
        return [key, [value]] as const;
      }

      return null;
    })
    .filter((entry): entry is readonly [string, string[]] => entry !== null);

  return entries.length ? Object.fromEntries(entries) : undefined;
}

function getErrorMessage(payload: unknown): string {
  if (!payload) {
    return "Something went wrong. Please try again.";
  }

  if (typeof payload === "string") {
    return payload;
  }

  if (typeof payload === "object") {
    const maybePayload = payload as Record<string, unknown>;

    if (typeof maybePayload.detail === "string") {
      return maybePayload.detail;
    }

    const fieldErrors = normalizeFieldErrors(payload);
    if (fieldErrors) {
      return Object.values(fieldErrors)
        .flat()
        .join(" ");
    }
  }

  return "Something went wrong. Please try again.";
}

export async function apiRequest<T>(
  path: string,
  { body, headers, ...options }: RequestOptions = {},
): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: getHeaders(headers),
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const error = new Error(getErrorMessage(payload)) as ApiError;
    error.status = response.status;
    error.fieldErrors = normalizeFieldErrors(payload);
    throw error;
  }

  return payload as T;
}

export function getAuthToken() {
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function storeAuthToken(token: string) {
  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

export function clearAuthToken() {
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}
