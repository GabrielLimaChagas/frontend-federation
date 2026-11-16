const DEFAULT_API_URL = "http://localhost:5000/api";

export const API_URL = import.meta.env.VITE_API_GATEWAY_URL || DEFAULT_API_URL;

const TOKEN_KEY = "crmaster_auth_token";

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
  hasToken(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

/**
 * Cliente HTTP centralizado que injeta automaticamente o cabeçalho Authorization: Bearer <token>
 * em todas as requisições direcionadas ao API Gateway / BFF.
 */
export async function httpClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  const token = authStorage.getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = response.statusText;
    try {
      const errData = await response.json();
      if (errData && errData.error) {
        errorDetail = errData.error;
      }
    } catch {
      // Ignora erro de parse caso a resposta não seja json
    }
    throw new Error(errorDetail || `Erro na requisição: ${response.status}`);
  }

  // Tratamento de respostas vazias (ex: 204 No Content)
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return null as unknown as T;
}
