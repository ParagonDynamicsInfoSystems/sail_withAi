// app/hooks/authApi.ts
import { getClerkInstance, useAuth } from "@clerk/clerk-expo";
import { AxiosError, AxiosHeaders, Method } from "axios";
import { useCallback } from "react";
import { api } from "../hooks/apiClient"; // adjust if apiClient.ts lives elsewhere

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "";

/** Build a curl command from method, url, headers and optional body (no token masking) */
function buildCurl(method: Method, fullUrl: string, headers: Record<string, string>, data?: any) {
  let curl = `curl -X ${String(method).toUpperCase()} "${fullUrl}"`;
  for (const [k, v] of Object.entries(headers)) {
    const safeVal = String(v).replace(/"/g, '\\"');
    curl += ` \\\n  -H "${k}: ${safeVal}"`;
  }
  if (typeof data !== "undefined") {
    try {
      const body = JSON.stringify(data).replace(/'/g, "'\"'\"'");
      curl += ` \\\n  -d '${body}'`;
    } catch {}
  }
  return curl;
}

/** Normalize headers from Axios error.config (handles AxiosHeaders and plain objects). */
async function headersFromErrorConfig(e: any): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  try {
    const raw = e?.config?.headers;
    if (!raw) return out;
    const plain = typeof raw?.toJSON === "function" ? raw.toJSON() : raw;
    for (const key of Object.keys(plain)) {
      const val = plain[key];
      if (Array.isArray(val)) out[key] = val.join(", ");
      else if (val != null) out[key] = String(val);
    }
    return out;
  } catch {
    try {
      for (const key of Object.keys(e?.config?.headers || {})) {
        const v = (e.config.headers as any)[key];
        if (v != null) out[key] = String(v);
      }
    } catch {}
    return out;
  }
}

/** Centralized error logger. Prefers e.config.headers (actual outgoing request). */
async function logAxiosError(e: any, method: Method, path: string, data?: any, params?: any) {
  console.error("----- API CALL FAILED -----");
  console.error("method:", method, "path:", path);

  if (e instanceof AxiosError) {
    console.error("axios error message:", e.message);
    if (e.response) {
      try { console.error("status:", e.response.status); } catch {}
      try { console.error("response.data:", JSON.stringify(e.response.data, null, 2)); } catch {}
    } else {
      console.error("no response received (network/timeout?)");
    }
  } else {
    console.error("non-axios error:", e);
  }

  const base = e?.config?.baseURL ?? api.defaults.baseURL ?? API_BASE_URL ?? "";
  const query = params ? `?${new URLSearchParams(params as Record<string,string>).toString()}` : "";
  const fullUrl = `${base}${path}${query}`;

  let hdrs = await headersFromErrorConfig(e);

  // If no Authorization in headers, best-effort fetch token for logging (raw token)
  if (!hdrs.Authorization) {
    try {
      const clerk = getClerkInstance();
      const token = await clerk?.session?.getToken();
      if (token) hdrs.Authorization = `Bearer ${token}`; // RAW token logged
    } catch {}
  }

  if (!hdrs.Authorization) {
    hdrs.Authorization = "MISSING";
  }

  console.error("cURL (auth UNMASKED):\n", buildCurl(method, fullUrl, hdrs, data));
  console.error("---------------------------");
}

/**
 * Wrapper that attempts a single retry with forced token refresh if response indicates a session problem.
 */
async function tryRequestWithRetry(fn: () => Promise<any>, method: Method, path: string, data?: any, params?: any) {
  try {
    return await fn();
  } catch (e: any) {
    const isServer500 = e?.response?.status === 500;
    const indicatesSessionProblem =
      e?.response?.data?.session_id === null ||
      (typeof e?.response?.data?.error_message === "string" &&
        e.response.data.error_message.toLowerCase().includes("session"));

    if (isServer500 && indicatesSessionProblem) {
      console.warn("[authApi] Server 500 with session issue — attempting one retry with forced token refresh.");
      try {
        const clerk = getClerkInstance();
        const freshToken = await clerk?.session?.getToken({ skipCache: true });
        if (freshToken) {
          // Temporarily add interceptor that injects freshToken, run request, then remove interceptor
          const interceptor = api.interceptors.request.use((c) => {
            c.headers = AxiosHeaders.from(c.headers ?? {});
            c.headers.set("Authorization", `Bearer ${freshToken}`);
            return c;
          });
          try {
            const result = await fn();
            return result;
          } finally {
            api.interceptors.request.eject(interceptor);
          }
        }
      } catch (retryErr) {
        console.warn("[authApi] retry with forced token failed:", retryErr);
      }
    }

    // no retry or retry failed — log and rethrow
    await logAxiosError(e, method, path, data, params);
    throw e;
  }
}

export function useAuthApi() {
  const { isLoaded, isSignedIn } = useAuth();

  const get = useCallback(async (npath: string, params?: Record<string, any>) => {
    if (!isLoaded) throw new Error("Auth not loaded. Wait until Clerk finishes initializing.");
    return tryRequestWithRetry(() => api.get(npath, { params }), "GET", npath, undefined, params).then((r) => r.data);
  }, [isLoaded, isSignedIn]);

  const post = useCallback(async (npath: string, body?: any) => {
    if (!isLoaded) throw new Error("Auth not loaded. Wait until Clerk finishes initializing.");
    return tryRequestWithRetry(() => api.post(npath, body), "POST", npath, body).then((r) => r.data);
  }, [isLoaded, isSignedIn]);

  const put = useCallback(async (npath: string, body?: any) => {
    if (!isLoaded) throw new Error("Auth not loaded. Wait until Clerk finishes initializing.");
    return tryRequestWithRetry(() => api.put(npath, body), "PUT", npath, body).then((r) => r.data);
  }, [isLoaded, isSignedIn]);

  const del = useCallback(async (npath: string) => {
    if (!isLoaded) throw new Error("Auth not loaded. Wait until Clerk finishes initializing.");
    return tryRequestWithRetry(() => api.delete(npath), "DELETE", npath).then((r) => r.data);
  }, [isLoaded, isSignedIn]);

  return { get, post, put, del, api, isLoaded, isSignedIn };
}
