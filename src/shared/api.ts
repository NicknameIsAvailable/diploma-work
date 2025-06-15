const API_URL = process.env.API_URL || "http://localhost:8000/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiResponse<T> {
  data: T;
}

interface RequestOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  cookieHeader?: string;
  params?: Record<string, string | number | boolean | undefined>;
}

// Функция для сериализации params в query string
function buildQuery(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return "";
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(
      ([k, v]) =>
        encodeURIComponent(k) + "=" + encodeURIComponent(String(v))
    )
    .join("&");
  return query ? `?${query}` : "";
}

async function request<T>(
  method: HttpMethod,
  url: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const { body, cookieHeader, params } = options;

  // Добавляем query string к url, если есть params
  const fullUrl = API_URL + url + buildQuery(params);

  const res = await fetch(fullUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP error ${res.status}: ${text}`);
  }

  const data = (await res.json()) as T;
  return { data };
}

const api = {
  get: <T>(url: string, params?: Record<string, string | number | boolean | undefined>, cookieHeader?: string) =>
    request<T>("GET", url, { params, cookieHeader }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: <T>(url: string, body?: any, params?: Record<string, string | number | boolean | undefined>, cookieHeader?: string) =>
    request<T>("POST", url, { body, params, cookieHeader }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put: <T>(url: string, body?: any, params?: Record<string, string | number | boolean | undefined>, cookieHeader?: string) =>
    request<T>("PUT", url, { body, params, cookieHeader }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patch: <T>(url: string, body?: any, params?: Record<string, string | number | boolean | undefined>, cookieHeader?: string) =>
    request<T>("PATCH", url, { body, params, cookieHeader }),
  delete: <T>(url: string, params?: Record<string, string | number | boolean | undefined>, cookieHeader?: string) =>
    request<T>("DELETE", url, { params, cookieHeader }),
};

export default api;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createApiHandler<T, Args extends any[]>(
  apiCall: (...args: Args) => Promise<T>,
): (...args: Args) => Promise<T> {
  return async (...args: Args) => {
    return await apiCall(...args);
  };
}
