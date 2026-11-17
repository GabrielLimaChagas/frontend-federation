import { httpClient } from "./api";

export interface Customer {
  id: string;
  name: string;
  pipelinesCount: number;
}

export const customerService = {
  async getAll(): Promise<Customer[]> {
    return httpClient<Customer[]>("/customers");
  },

  async create(customer: Omit<Customer, "id">): Promise<Customer> {
    return httpClient<Customer>("/customers", {
      method: "POST",
      body: JSON.stringify(customer),
    });
  },

  async update(id: string, customer: Partial<Customer>): Promise<Customer> {
    return httpClient<Customer>(`/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(customer),
    });
  },

  async delete(id: string): Promise<void> {
    return httpClient<void>(`/customers/${id}`, {
      method: "DELETE",
    });
  },

  async requestBilling(id: string, amountCents = 15000, description = "Faturamento solicitado pelo cliente"): Promise<{ status: string; message: string }> {
    return httpClient<{ status: string; message: string }>(`/customers/${id}/billing-request`, {
      method: "POST",
      body: JSON.stringify({ amountCents, description }),
    });
  },
};
