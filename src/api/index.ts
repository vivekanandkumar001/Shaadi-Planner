import { apiRequest } from "./client"

// AUTH API
export const authApi = {
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    apiRequest("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    apiRequest("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  logout: () => apiRequest("/auth/logout", { method: "POST" }),
  getMe: () => apiRequest("/auth/me"),
  forgotPassword: (email: string) =>
    apiRequest("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
  resetPassword: (token: string, newPassword: string) =>
    apiRequest("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, newPassword }) }),
  updateProfile: (data: { name: string; phone?: string }) =>
    apiRequest("/auth/profile", { method: "PUT", body: JSON.stringify(data) }),
  deleteAccount: () => apiRequest("/auth/account", { method: "DELETE" }),
}

// WEDDINGS API
export const weddingsApi = {
  getAll: () => apiRequest("/weddings"),
  create: (data: any) => apiRequest("/weddings", { method: "POST", body: JSON.stringify(data) }),
  getOne: (id: string) => apiRequest(`/weddings/${id}`),
  update: (id: string, data: any) => apiRequest(`/weddings/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/weddings/${id}`, { method: "DELETE" }),
}

// GUESTS API
export const guestsApi = {
  getAll: (weddingId: string, params?: { side?: string; rsvp?: string; search?: string }) => {
    const query = new URLSearchParams(params as any).toString()
    return apiRequest(`/guests/${weddingId}${query ? `?${query}` : ""}`)
  },
  create: (weddingId: string, data: any) =>
    apiRequest(`/guests/${weddingId}`, { method: "POST", body: JSON.stringify(data) }),
  update: (weddingId: string, id: string, data: any) =>
    apiRequest(`/guests/${weddingId}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (weddingId: string, id: string) =>
    apiRequest(`/guests/${weddingId}/${id}`, { method: "DELETE" }),
}

// FUNCTIONS API
export const eventsApi = {
  getAll: (weddingId: string) => apiRequest(`/events/${weddingId}`),
  create: (weddingId: string, data: any) =>
    apiRequest(`/events/${weddingId}`, { method: "POST", body: JSON.stringify(data) }),
  update: (weddingId: string, id: string, data: any) =>
    apiRequest(`/events/${weddingId}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (weddingId: string, id: string) =>
    apiRequest(`/events/${weddingId}/${id}`, { method: "DELETE" }),
}

// VENDORS API
export const vendorsApi = {
  getAll: (weddingId: string) => apiRequest(`/vendors/${weddingId}`),
  create: (weddingId: string, data: any) =>
    apiRequest(`/vendors/${weddingId}`, { method: "POST", body: JSON.stringify(data) }),
  update: (weddingId: string, id: string, data: any) =>
    apiRequest(`/vendors/${weddingId}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (weddingId: string, id: string) =>
    apiRequest(`/vendors/${weddingId}/${id}`, { method: "DELETE" }),
}

// CHECKLIST TASKS API
export const tasksApi = {
  getAll: (weddingId: string) => apiRequest(`/tasks/${weddingId}`),
  create: (weddingId: string, data: any) =>
    apiRequest(`/tasks/${weddingId}`, { method: "POST", body: JSON.stringify(data) }),
  toggle: (weddingId: string, id: string) =>
    apiRequest(`/tasks/${weddingId}/${id}/toggle`, { method: "PATCH" }),
  update: (weddingId: string, id: string, data: any) =>
    apiRequest(`/tasks/${weddingId}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (weddingId: string, id: string) =>
    apiRequest(`/tasks/${weddingId}/${id}`, { method: "DELETE" }),
}

// SEATING API
export const seatingApi = {
  getAll: (weddingId: string) => apiRequest(`/seating/${weddingId}`),
  createTable: (weddingId: string, data: { name: string; capacity: number }) =>
    apiRequest(`/seating/${weddingId}`, { method: "POST", body: JSON.stringify(data) }),
  assignGuest: (weddingId: string, guestId: string, tableId: string) =>
    apiRequest(`/seating/${weddingId}/assign`, { method: "POST", body: JSON.stringify({ guestId, tableId }) }),
  unassignGuest: (weddingId: string, guestId: string) =>
    apiRequest(`/seating/${weddingId}/unassign`, { method: "POST", body: JSON.stringify({ guestId }) }),
  deleteTable: (weddingId: string, id: string) =>
    apiRequest(`/seating/${weddingId}/${id}`, { method: "DELETE" }),
}

// MENU API
export const menuApi = {
  getAll: (weddingId: string) => apiRequest(`/menu/${weddingId}`),
  createCourse: (weddingId: string, data: any) =>
    apiRequest(`/menu/${weddingId}`, { method: "POST", body: JSON.stringify(data) }),
  updateCourse: (weddingId: string, id: string, data: any) =>
    apiRequest(`/menu/${weddingId}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCourse: (weddingId: string, id: string) =>
    apiRequest(`/menu/${weddingId}/${id}`, { method: "DELETE" }),
}

// SHAGUN API
export const shagunApi = {
  getAll: (weddingId: string) => apiRequest(`/shagun/${weddingId}`),
  create: (weddingId: string, data: any) =>
    apiRequest(`/shagun/${weddingId}`, { method: "POST", body: JSON.stringify(data) }),
  update: (weddingId: string, id: string, data: any) =>
    apiRequest(`/shagun/${weddingId}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (weddingId: string, id: string) =>
    apiRequest(`/shagun/${weddingId}/${id}`, { method: "DELETE" }),
}

// NOTES API
export const notesApi = {
  getAll: (weddingId: string) => apiRequest(`/notes/${weddingId}`),
  create: (weddingId: string, data: any) =>
    apiRequest(`/notes/${weddingId}`, { method: "POST", body: JSON.stringify(data) }),
  update: (weddingId: string, id: string, data: any) =>
    apiRequest(`/notes/${weddingId}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  togglePin: (weddingId: string, id: string) =>
    apiRequest(`/notes/${weddingId}/${id}/pin`, { method: "PATCH" }),
  delete: (weddingId: string, id: string) =>
    apiRequest(`/notes/${weddingId}/${id}`, { method: "DELETE" }),
}

// BUDGET API
export const budgetApi = {
  getSummary: (weddingId: string) => apiRequest(`/budget/${weddingId}`),
  update: (weddingId: string, data: any) =>
    apiRequest(`/budget/${weddingId}`, { method: "PUT", body: JSON.stringify(data) }),
}

// SHARE API
export const shareApi = {
  createLink: (weddingId: string) => apiRequest(`/shares/${weddingId}`, { method: "POST" }),
  getPublic: (token: string) => apiRequest(`/shares/public/${token}`),
  revokeLink: (weddingId: string, token: string) =>
    apiRequest(`/shares/${weddingId}/${token}`, { method: "DELETE" }),
}

// SEARCH API
export const searchApi = {
  search: (weddingId: string, query: string) =>
    apiRequest(`/search/${weddingId}?q=${encodeURIComponent(query)}`),
}

// MIGRATION API
export const migrationApi = {
  importLocalData: (data: any) =>
    apiRequest("/migration/import", { method: "POST", body: JSON.stringify(data) }),
}
