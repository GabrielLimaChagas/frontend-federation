import { describe, it, expect, vi, beforeEach } from "vitest";
import { bffService } from "./bffService";
import { authStorage } from "./api";

describe("bffService (API Gateway & BFF)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("deve buscar o resumo agregado via GET /api/summary com cabeçalho Bearer", async () => {
    authStorage.setToken("fake-jwt-token-xyz");

    const mockSummary = { customersCount: 15, productsCount: 42 };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => mockSummary,
    } as Response);

    const summary = await bffService.getSummary();

    expect(summary).toEqual(mockSummary);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/summary",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer fake-jwt-token-xyz",
          "Content-Type": "application/json",
        }),
      })
    );
  });

  it("deve verificar a saúde do ecossistema via GET /api/health", async () => {
    const mockHealth = {
      gateway: "UP",
      status: "UP",
      services: { customers: "UP", products: "UP" },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => mockHealth,
    } as Response);

    const health = await bffService.getHealth();
    expect(health).toEqual(mockHealth);
  });

  it("deve realizar login centralizado e armazenar o Bearer token no storage", async () => {
    const mockLoginResponse = {
      token: "jwt-token-issued-by-gateway",
      tokenType: "Bearer",
      expiresIn: 3600,
      user: "admin",
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => mockLoginResponse,
    } as Response);

    const token = await bffService.login("admin", "admin123");

    expect(token).toBe("jwt-token-issued-by-gateway");
    expect(authStorage.getToken()).toBe("jwt-token-issued-by-gateway");
  });
});
