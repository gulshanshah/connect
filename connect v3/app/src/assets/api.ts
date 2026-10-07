










import axios from 'axios';
import { saveTokens, loadTokens, deleteTokens } from './Keychain';

const log = (...args) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}]`, ...args);
};

const api = axios.create({
  baseURL: 'http://10.68.42.246:5000',
});

api.interceptors.request.use(async (config) => {
  const tokens = await loadTokens();

  if (tokens) {
    log("📦 Tokens loaded from Keychain:", {
      accessToken: tokens.accessToken || '❌ Missing',
      refreshToken: tokens.refreshToken || '❌ Missing',
    });

    if (tokens.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      log("🔐 Request Authorization header set:", {
        url: config.url,
        method: config.method,
        accessToken: tokens.accessToken.slice(0, 20) + '...',
      });
    } else {
      log("⚠️ Access token is missing. Request will be unauthenticated:", config.url);
    }
  } else {
    log("❌ No tokens found at all. Request is unauthenticated:", config.url);
  }

  return config;
}, error => {
  log("❌ Request Interceptor Error:", error.message);
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    log(`✅ Response Received: [${response.status}] ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      log("⏳ 401 received. Attempting token refresh...");

      originalRequest._retry = true;
      const tokens = await loadTokens();

      log("🔍 Refresh Token to be used:", {
        refreshToken: tokens?.refreshToken || '❌ Not found',
      });

      try {
        const res = await axios.post('http://10.68.42.246:5000/auth/refresh', {
          refreshToken: tokens.refreshToken,
        });

        const { accessToken, refreshToken } = res.data;
        log("✅ New tokens received after refresh:", {
          accessToken: accessToken.slice(0, 20) + '...',
          refreshToken: refreshToken.slice(0, 20) + '...',
        });

        await saveTokens(accessToken, refreshToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        log("🔁 Retrying original request with new token:", originalRequest.url);
        return api(originalRequest);

      } catch (refreshError) {
        log("🚫 Refresh failed. Logging out user.", {
          error: refreshError.message,
        });
        await deleteTokens();
        return Promise.reject(refreshError);
      }
    }

    log("❌ Response Error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    });

    return Promise.reject(error);
  }
);

export default api;
