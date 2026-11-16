import { describe, it, expect, vi, beforeEach } from "vitest";
import { customerService } from "./customerService";
import { authStorage } from "./api";

describe("customerService (HTTP & JWT Interceptor)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("deve buscar todos os clientes enviando o token JWT quando presente", async () => {
    authStorage.setToken("token-cliente-123");
    const mockCustomers = [{ id: "1", name: "Maria", pipelinesCount: 2 }];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => mockCustomers,
    } as Response);

    const customers = await customerService.getAll();

    expect(customers).toEqual(mockCustomers);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/customers",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer token-cliente-123",
          "Content-Type": "application/json",
        }),
      })
    );
  });

  it("deve criar um novo cliente com POST para o API Gateway", async () => {
    const newCustomer = { name: "João Silva", pipelinesCount: 5 };
    const createdCustomer = { id: "10", ...newCustomer };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => createdCustomer,
    } as Response);

    const result = await customerService.create(newCustomer);

    expect(result).toEqual(createdCustomer);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/customers",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(newCustomer),
      })
    );
  });
});
