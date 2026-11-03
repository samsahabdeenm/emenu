import axios, { type InternalAxiosRequestConfig } from 'axios'

// Bug fix: extend axios config type to include the _retry flag used by the
// response interceptor. Without this, TypeScript infers _retry as `any` and
// may strip it in strict mode, causing infinite retry loops on 401 responses.
interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Send cookies with every request
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auth endpoints that intentionally return 401 (wrong credentials, not expired token).
// The interceptor must NOT intercept these — doing so causes "Session expired"
// to flash instead of showing the actual error (e.g. "Invalid email or password").
const SKIP_REFRESH_URLS = [
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
]

// Response interceptor — silently refresh expired access tokens.
// Only fires for protected API calls (not auth endpoints above).
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequest
    const url = originalRequest.url || ''
    const isAuthEndpoint = SKIP_REFRESH_URLS.some(ep => url.includes(ep))

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true
      try {
        await api.post('/auth/refresh')
        return api(originalRequest)
      } catch {
        // Refresh failed → session truly expired, clear auth state
        window.dispatchEvent(new Event('auth:logout'))
      }
    }
    return Promise.reject(error)
  }
)

export default api
