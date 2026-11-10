import { API_URL } from "./api";

export interface Customer {
  id: string;
  name: string;
  pipelinesCount: number;
}

export const customerService = {
  async getAll(): Promise<Customer[]> {
    const res = await fetch(`${API_URL}/customers`);
    if (!res.ok) {
      throw new Error(`Erro ao buscar clientes: ${res.statusText}`);
    }
    return res.json();
  },

  async create(customer: Omit<Customer, "id">): Promise<Customer> {
    const res = await fetch(`${API_URL}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customer),
    });
    if (!res.ok) {
      throw new Error(`Erro ao criar cliente: ${res.statusText}`);
    }
    return res.json();
  },

  async update(id: string, customer: Partial<Customer>): Promise<Customer> {
    const res = await fetch(`${API_URL}/customers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customer),
    });
    if (!res.ok) {
      throw new Error(`Erro ao atualizar cliente: ${res.statusText}`);
    }
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/customers/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error(`Erro ao remover cliente: ${res.statusText}`);
    }
  },
};
