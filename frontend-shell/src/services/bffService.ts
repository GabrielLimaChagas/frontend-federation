import { httpClient, authStorage } from "./api";

export interface DashboardSummary {
  customersCount: number;
  productsCount: number;
  totalCatalogValueCents?: number;
  totalPipelinesCount?: number;
}

export interface HealthStatus {
  gateway: string;
  status: "UP" | "DEGRADED" | "DOWN";
  services: {
    customers: string;
    products: string;
  };
}

export interface AuditLogItem {
  id: string;
  eventType: string;
  payload: string;
  createdAt: string;
}

export const bffService = {
  /**
   * Consome o endpoint agregador BFF do API Gateway: GET /api/summary
   */
  async getSummary(): Promise<DashboardSummary> {
    return httpClient<DashboardSummary>("/summary");
  },

  /**
   * Consome o endpoint agregado de saúde do ecossistema: GET /api/health
   */
  async getHealth(): Promise<HealthStatus> {
    return httpClient<HealthStatus>("/health");
  },

  /**
   * Consome os logs de auditoria dos eventos assíncronos via rota proxy do Gateway
   */
  async getAuditLogs(): Promise<AuditLogItem[]> {
    try {
      return await httpClient<AuditLogItem[]>("/products/audit-logs");
    } catch {
      return [];
    }
  },

  /**
   * Endpoint centralizado de autenticação no API Gateway (POST /api/auth/token ou /api/auth/login)
   */
  async login(username = "admin", password = "password123"): Promise<string> {
    const data = await httpClient<{ token: string }>("/auth/token", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    if (data?.token) {
      authStorage.setToken(data.token);
    }
    return data.token;
  },

  /**
   * Validação do token atual no Gateway
   */
  async verifyAuth(): Promise<boolean> {
    try {
      const res = await httpClient<{ valid: boolean }>("/auth/verify");
      return !!res?.valid;
    } catch {
      return false;
    }
  },
};
