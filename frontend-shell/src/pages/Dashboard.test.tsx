import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import Dashboard from "./Dashboard";
import { bffService } from "../services/bffService";

vi.mock("../services/bffService", () => ({
  bffService: {
    getSummary: vi.fn(),
    getHealth: vi.fn(),
    getAuditLogs: vi.fn(),
    login: vi.fn(),
    verifyAuth: vi.fn(),
  },
}));

describe("Dashboard Page (BFF & Mensageria)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (bffService.getSummary as any).mockResolvedValue({
      customersCount: 12,
      productsCount: 8,
    });
    (bffService.getHealth as any).mockResolvedValue({
      gateway: "UP",
      status: "UP",
      services: { customers: "UP", products: "UP" },
    });
    (bffService.getAuditLogs as any).mockResolvedValue([
      {
        id: "1",
        eventType: "CustomerCreatedEvent",
        payload: '{"customerId": "1", "name": "Maria"}',
        createdAt: "2026-11-16 00:00:00",
      },
    ]);
    (bffService.verifyAuth as any).mockResolvedValue(true);
    (bffService.login as any).mockResolvedValue("mock-jwt");
  });

  it("renderiza os cards agregados do BFF e a seção de mensageria", async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Dashboard Executivo & BFF")).toBeInTheDocument();
      expect(screen.getByText("Total de Clientes")).toBeInTheDocument();
      expect(screen.getByText("Total de Produtos")).toBeInTheDocument();
      expect(screen.getByText("Mensageria Assíncrona (Azure Service Bus)")).toBeInTheDocument();
      expect(screen.getByText("CustomerCreatedEvent")).toBeInTheDocument();
    });
  });
});
