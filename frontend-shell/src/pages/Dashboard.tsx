import React, { useEffect, useState } from "react";
import Header from "../components/base/Header";
import Col from "../components/core/Col";
import Row from "../components/core/Row";
import Button from "../components/core/Button";
import {
  bffService,
  type DashboardSummary,
  type HealthStatus,
  type AuditLogItem,
} from "../services/bffService";
import { authStorage } from "../services/api";
import {
  UsersIcon,
  ArchiveBoxIcon,
  BoltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  KeyIcon,
} from "@heroicons/react/20/solid";

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenInfo, setTokenInfo] = useState<string | null>(authStorage.getToken());
  const [authStatus, setAuthStatus] = useState<string>("Verificando...");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Chamada agregada única para métricas via BFF: GET /api/summary
      const summaryData = await bffService.getSummary();
      setSummary(summaryData);

      // Verificação de saúde dos microsserviços via Gateway: GET /api/health
      try {
        const healthData = await bffService.getHealth();
        setHealth(healthData);
      } catch (hErr) {
        console.warn("Health check error:", hErr);
      }

      // Consulta aos logs do consumidor assíncrono (Azure Service Bus)
      const logs = await bffService.getAuditLogs();
      setAuditLogs(logs);

      // Validação de autenticação
      const isValid = await bffService.verifyAuth();
      setAuthStatus(isValid ? "Autenticado (JWT Válido)" : "Sem Token / Não Autenticado");
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados do BFF");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const token = await bffService.login("admin", "admin123");
      setTokenInfo(token);
      await loadDashboardData();
    } catch (err: any) {
      alert("Falha no login: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authStorage.removeToken();
    setTokenInfo(null);
    setAuthStatus("Sem Token");
  };

  useEffect(() => {
    // Se não tiver token gravado, faz login demonstrativo automático para inicializar o Bearer token
    if (!authStorage.getToken()) {
      bffService.login("admin", "admin123").then((token) => {
        setTokenInfo(token);
        loadDashboardData();
      }).catch(() => {
        loadDashboardData();
      });
    } else {
      loadDashboardData();
    }
  }, []);

  return (
    <Col className="w-full">
      <Header
        title="Dashboard Executivo & BFF"
        rightAttachment={
          <Row className="items-center gap-2">
            <Button
              label="Atualizar BFF"
              variant="secondary"
              onClick={loadDashboardData}
            />
            {tokenInfo ? (
              <Button label="Logout" variant="secondary" onClick={handleLogout} />
            ) : (
              <Button label="Login JWT" variant="primary" onClick={handleLogin} />
            )}
          </Row>
        }
      />

      <Col className="p-4 gap-6 w-full">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Aviso do Gateway: </strong> {error}
          </div>
        )}

        {/* Status de Segurança e Token JWT */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200">
          <Row className="items-center justify-between">
            <Row className="items-center gap-3">
              <KeyIcon className="w-6 h-6 text-indigo-600" />
              <div>
                <h4 className="font-semibold text-neutral-800">
                  Segurança Centralizada no API Gateway
                </h4>
                <p className="text-sm text-neutral-500">
                  {authStatus} • Injeção automática via cabeçalho{" "}
                  <code className="bg-neutral-100 px-1 py-0.5 rounded text-xs text-neutral-700">
                    Authorization: Bearer &lt;token&gt;
                  </code>
                </p>
              </div>
            </Row>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                tokenInfo
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {tokenInfo ? "Bearer Token Ativo" : "Não Autenticado"}
            </span>
          </Row>
        </div>

        {/* Cards de Métricas Consolidadas (BFF GET /api/summary) */}
        <div>
          <h3 className="text-lg font-bold text-neutral-800 mb-3">
            Métricas Agregadas via BFF (
            <span className="text-blue-600 text-sm font-normal">GET /api/summary</span>)
          </h3>
          <Row className="gap-4 w-full">
            {/* Card Total Clientes */}
            <div className="flex-1 bg-white p-5 rounded-xl shadow-sm border border-neutral-200">
              <Row className="items-center justify-between mb-2">
                <span className="text-neutral-500 font-medium text-sm">Total de Clientes</span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <UsersIcon className="w-5 h-5" />
                </div>
              </Row>
              <div className="text-3xl font-bold text-neutral-800">
                {loading ? "..." : summary?.customersCount ?? 0}
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Persistido no MongoDB / Azure Cosmos DB
              </p>
            </div>

            {/* Card Total Produtos */}
            <div className="flex-1 bg-white p-5 rounded-xl shadow-sm border border-neutral-200">
              <Row className="items-center justify-between mb-2">
                <span className="text-neutral-500 font-medium text-sm">Total de Produtos</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <ArchiveBoxIcon className="w-5 h-5" />
                </div>
              </Row>
              <div className="text-3xl font-bold text-neutral-800">
                {loading ? "..." : summary?.productsCount ?? 0}
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Persistido no Azure SQL Database / SQL Server
              </p>
            </div>

            {/* Card Status do Gateway / Ecossistema */}
            <div className="flex-1 bg-white p-5 rounded-xl shadow-sm border border-neutral-200">
              <Row className="items-center justify-between mb-2">
                <span className="text-neutral-500 font-medium text-sm">Saúde do Ecossistema</span>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <BoltIcon className="w-5 h-5" />
                </div>
              </Row>
              <div className="text-xl font-bold text-neutral-800 flex items-center gap-2">
                {health?.status === "UP" ? (
                  <>
                    <CheckCircleIcon className="w-6 h-6 text-emerald-500" />
                    <span>Totalmente Operacional</span>
                  </>
                ) : (
                  <>
                    <ExclamationTriangleIcon className="w-6 h-6 text-amber-500" />
                    <span>{health?.status || "Verificando..."}</span>
                  </>
                )}
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Customer: {health?.services.customers || "N/A"} | Product:{" "}
                {health?.services.products || "N/A"}
              </p>
            </div>
          </Row>
        </div>

        {/* Painel de Mensageria Assíncrona (Azure Service Bus) */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-200">
          <Row className="justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-neutral-800">
                Mensageria Assíncrona (Azure Service Bus)
              </h3>
              <p className="text-sm text-neutral-500">
                Auditoria de eventos disparados pelo <strong>Customer Service</strong> e
                consumidos/persistidos pelo <strong>Product Service</strong>.
              </p>
            </div>
            <button
              onClick={loadDashboardData}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <ArrowPathIcon className="w-4 h-4" /> Atualizar Fila
            </button>
          </Row>

          {auditLogs.length === 0 ? (
            <div className="p-6 text-center text-neutral-400 bg-neutral-50 rounded-lg border border-dashed border-neutral-300">
              Nenhum evento registrado na fila ainda. Cadastre um novo cliente no menu{" "}
              <strong>Clientes</strong> para disparar o evento assíncrono{" "}
              <code>CustomerCreatedEvent</code>!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500">
                    <th className="py-2 px-3">ID do Registro</th>
                    <th className="py-2 px-3">Tipo do Evento</th>
                    <th className="py-2 px-3">Data / Hora de Processamento</th>
                    <th className="py-2 px-3">Payload Recebido da Fila</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-neutral-100 hover:bg-neutral-50 transition"
                    >
                      <td className="py-2.5 px-3 font-mono text-xs">{log.id}</td>
                      <td className="py-2.5 px-3">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded font-medium">
                          {log.eventType}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-neutral-500 text-xs">
                        {log.createdAt || "Agora"}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-xs text-neutral-700 bg-neutral-50 rounded max-w-md truncate">
                        {log.payload}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Col>
    </Col>
  );
};

export default Dashboard;
