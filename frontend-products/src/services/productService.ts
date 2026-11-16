import { httpClient } from "./api";

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface AuditLog {
  id: string;
  eventType: string;
  payload: string;
  createdAt: string;
}

export const productService = {
  async getAll(): Promise<Product[]> {
    return httpClient<Product[]>("/products");
  },

  async create(product: Omit<Product, "id">): Promise<Product> {
    return httpClient<Product>("/products", {
      method: "POST",
      body: JSON.stringify(product),
    });
  },

  async update(id: string, product: Partial<Product>): Promise<Product> {
    return httpClient<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    });
  },

  async delete(id: string): Promise<void> {
    return httpClient<void>(`/products/${id}`, {
      method: "DELETE",
    });
  },

  // Consulta de eventos de mensageria assíncrona processados pelo consumidor
  async getAuditLogs(): Promise<AuditLog[]> {
    return httpClient<AuditLog[]>("/products/audit-logs");
  },
};
