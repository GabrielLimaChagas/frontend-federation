import { describe, it, expect, vi, beforeEach } from "vitest";
import { productService } from "./productService";
import { authStorage } from "./api";

describe("productService (HTTP & JWT Interceptor)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("deve buscar todos os produtos enviando o token JWT quando presente", async () => {
    authStorage.setToken("token-produto-xyz");
    const mockProducts = [{ id: "1", name: "Roçadeira", price: 25999 }];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => mockProducts,
    } as Response);

    const products = await productService.getAll();

    expect(products).toEqual(mockProducts);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/products",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer token-produto-xyz",
          "Content-Type": "application/json",
        }),
      })
    );
  });

  it("deve buscar logs de auditoria do Service Bus via Gateway", async () => {
    const mockLogs = [
      { id: "1", eventType: "CustomerCreatedEvent", payload: "{}", createdAt: "2026-11-16" },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => mockLogs,
    } as Response);

    const logs = await productService.getAuditLogs();
    expect(logs).toEqual(mockLogs);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/products/audit-logs",
      expect.any(Object)
    );
  });
});
