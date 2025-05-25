const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new ApiError(
      response.status,
      `HTTP error! status: ${response.status}`
    );
  }

  // Handle 204 No Content responses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(url: string): Promise<T> =>
    fetch(`${API_BASE_URL}${url}`).then((res) => handleResponse<T>(res)),

  post: <T>(url: string, data?: unknown): Promise<T> =>
    fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined,
    }).then((res) => handleResponse<T>(res)),

  patch: <T>(url: string, data?: unknown): Promise<T> =>
    fetch(`${API_BASE_URL}${url}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined,
    }).then((res) => handleResponse<T>(res)),

  delete: <T>(url: string): Promise<T> =>
    fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
    }).then((res) => handleResponse<T>(res)),
};
