// apiClient.ts
import { getClerkInstance } from "@clerk/clerk-expo";
import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { Platform } from "react-native";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "";

if (!API_BASE_URL) {
  console.warn("⚠️ WARNING: EXPO_PUBLIC_API_URL is not set. Please define it in your .env file.");
}
// dev-only: paste near top of apiClient.ts
function base64UrlDecode(s: string) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  try {
    // @ts-ignore - atob may exist in RN dev; Buffer fallback otherwise
    return typeof atob === "function" ? atob(s) : Buffer.from(s, "base64").toString("utf8");
  } catch {
    try {
      return Buffer.from(s, "base64").toString("utf8");
    } catch {
      return null;
    }
  }
}

function decodeJwt(token?: string | null) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = base64UrlDecode(parts[1]);
    return payload ? JSON.parse(payload) : null;
  } catch {
    return null;
  }
}


export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

function maskToken(tok?: string | null) {
  if (!tok) return "MISSING";
  if (tok.length <= 16) return tok;
  return `${tok.slice(0, 8)}...${tok.slice(-8)}`;
}



/**
 * Install a request interceptor that fetches the current Clerk session token
 * right before each request and sets the Authorization header.
 * Returns a function that can be called to eject the interceptor.
 */
export function setupClerkInterceptor() {
  const interceptorId = api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        const clerk = getClerkInstance();

        // Normal token first
        // let token = await clerk?.session?.getToken();

 let token ="eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18yenVjcnlQSDk2TVYxM0pTMkpxbWxsM0Q4aTEiLCJ0eXAiOiJKV1QifQ.eyJlbWFpbCI6ImRlbW8uY3JtQGV4YXF1YmUuY29tIiwiZXhwIjoxNzYxNjU2MDMwLCJmdmEiOls3MTExLC0xXSwiaWF0IjoxNzYxNTY5NjMwLCJpc3MiOiJodHRwczovL25vYmxlLWdyYWNrbGUtNDYuY2xlcmsuYWNjb3VudHMuZGV2IiwianRpIjoiOTRiOGQ3MWMzOGI3ZWM3NDQzYmMiLCJuYmYiOjE3NjE1Njk2MjAsInNpZCI6InNlc3NfMzRRUGdPcTE5Q1NZWFpuR2g0NjM2SUtQZUZoIiwic3RzIjoiYWN0aXZlIiwic3ViIjoidXNlcl8zNFBhbjBZdnNhUnlNb0JLVmJhRVNrN0NhOTYiLCJ1aWQiOiJ1c2VyXzM0UGFuMFl2c2FSeU1vQktWYmFFU2s3Q2E5NiIsInYiOjJ9.RQ5xW1sMULQflzpJnuxXQ9VpjGN4yDQ3PKu33LKgvlcKuGBjqpqZZ1Jv8b9-SUbuh8JWvzolWCP0PPBinr9NSPFU-u5gL-9Fe9UDwnb3m-Pj6HePY9H0AgYzTWEm0uj3lQOEI9r4nCtaMRAY5MAYcq0zx90KDi2XVbFfsKaudogtAaLNs-kdN3hJGcGZq5Zf4cwb5_RWwgS0tMqWA1p35k_YL71h0yXMKf-jB_pYlc4pOIpiS7U1DlIRBhL7V3KH0wsThKt9FCJh2Cx2AS0PcSRpkp_5VEeQfzMiQerytAsjnomGBXxObEQDpki4-3czvNe9vhIfiDF37lLEBDHfIA"



 // 

// If not available, try forced refresh (useful on Android after second login / restore)
        // if (!token) {
        //   try {
        //     // token = await clerk?.session?.getToken({ skipCache: true });
        //   } catch (innerErr) {
        //     console.warn("[setupClerkInterceptor] Clerk forced-refresh failed:", innerErr);
        //   }
        // }

const claims = decodeJwt(token);
console.log("[API_CLIENT][JWT CLAIMS]", Platform.OS, claims);

        if (token) {
          const headers = AxiosHeaders.from(config.headers ?? {});
          headers.set("Authorization", `Bearer ${token}`);
          config.headers = headers as unknown as InternalAxiosRequestConfig["headers"];

          // DEBUG: raw token on Android only (remove in production)
          if (Platform.OS === "android") {
            // console.log("[apiClient][ANDROID] attaching raw token:", token, "for", config.url);
          } else {
            // console.log("[setupClerkInterceptor] attached token", token, "for", config.url);
          }
        } else {
          // console.log("[setupClerkInterceptor] no token available for", config.url);
        }
      } catch (err) {
        // console.warn("[setupClerkInterceptor] failed to attach token:", err);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return () => api.interceptors.request.eject(interceptorId);
}
