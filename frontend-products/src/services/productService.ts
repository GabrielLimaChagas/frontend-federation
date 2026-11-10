import { API_URL } from "./api";

export interface Product {
  id: string;
  name: string;
  price: number;
}

export const productService = {
  async getAll(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) {
      throw new Error(`Erro ao buscar produtos: ${res.statusText}`);
    }
    return res.json();
  },

  async create(product: Omit<Product, "id">): Promise<Product> {
    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      throw new Error(`Erro ao criar produto: ${res.statusText}`);
    }
    return res.json();
  },

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      throw new Error(`Erro ao atualizar produto: ${res.statusText}`);
    }
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error(`Erro ao remover produto: ${res.statusText}`);
    }
  },
};
