const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: {
    code: string
    message: string
    fields?: Record<string, string>
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  }

  // Get token from localStorage as fallback if cookies are blocked by browser cross-site rules
  const token = localStorage.getItem("shaadi_auth_token")
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: "include", // Send HttpOnly session cookies
  }

  try {
    const res = await fetch(url, config)
    const data = await res.json()

    if (!res.ok) {
      return {
        success: false,
        error: data.error || {
          code: `HTTP_${res.status}`,
          message: data.message || "An unexpected error occurred",
        },
      }
    }

    return data
  } catch (error: any) {
    console.error("API Network Error:", error)
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: "Unable to connect to Shaadi Planner server. Please check your internet connection.",
      },
    }
  }
}
