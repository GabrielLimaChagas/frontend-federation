# CRMaster — Frontend Microfrontends (Module Federation)

Projeto de Frontend do sistema **CRMaster**, construído sobre a arquitetura de **Microfrontends (MFE)** com **Vite**, **React 19**, **TypeScript**, **Tailwind CSS v4** e **Module Federation**.

---

## 👥 Integrantes do Grupo
* **Cauã Kammler**
* **Gabriel de Lima Chagas**
* **Vinicius Soares da Silva**

---

## 🏛️ Resumo Arquitetural
A interface foi projetada para garantir total independência entre times funcionais, isolando regras de apresentação por domínio:
* **`frontend-shell` (Porta 5173 - Host):** Casca hospedeira responsável pela autenticação, layout com menu lateral e pelo **Dashboard Executivo**, que consome exclusivamente o endpoint agregador `GET /api/summary` e `GET /api/health` do API Gateway & BFF.
* **`frontend-customers` (Porta 5174 - Remote):** Módulo de gestão de clientes com feedback visual em tempo real para a fila de mensageria assíncrona.
* **`frontend-products` (Porta 5175 - Remote):** Módulo de catálogo comercial de produtos em centavos e consulta aos logs de auditoria do consumidor assíncrono.
* **Segurança Centralizada:** Todas as requisições passam pelo cliente `httpClient`, que injeta de forma transparente o cabeçalho `Authorization: Bearer <token>` emitido pelo Gateway.

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
* Node.js v20+ e npm.

### Passo a Passo

1. **Instalação das dependências:**
   ```bash
   cd frontend-federation
   npm install
   npm install --prefix frontend-customers
   npm install --prefix frontend-products
   npm install --prefix frontend-shell
   ```

2. **Configuração de Variáveis de Ambiente:**
   Copie o arquivo de exemplo para as aplicações se desejar alterar o endereço do Gateway:
   ```bash
   # Padrão: http://localhost:5000/api
   VITE_API_GATEWAY_URL=http://localhost:5000/api
   ```

3. **Execução em Desenvolvimento:**
   Em três terminais separados:
   ```bash
   # Terminal 1 (Remote Clientes)
   npm run dev --prefix frontend-customers # Roda em http://localhost:5174

   # Terminal 2 (Remote Produtos)
   npm run dev --prefix frontend-products  # Roda em http://localhost:5175

   # Terminal 3 (Shell Principal)
   npm run dev --prefix frontend-shell     # Roda em http://localhost:5173
   ```
   Abra no navegador: `http://localhost:5173`.

4. **Execução dos Testes Automatizados:**
   ```bash
   # Testes de Arquitetura (Fitness Functions via dependency-cruiser)
   npm run test:arch

   # Testes Unitários de Componentes e Serviços (Vitest)
   npm run test --prefix frontend-customers
   npm run test --prefix frontend-products
   npm run test --prefix frontend-shell
   ```

---

## 🌐 Links de Produção na Azure & Swagger
* **Frontend em Produção (Azure Static Web Apps):** [https://zealous-pebble-0418eed0f.5.azurestaticapps.net](https://zealous-pebble-0418eed0f.5.azurestaticapps.net/)
* **API Gateway & BFF:** [https://formativa-api-gateway.azurewebsites.net](https://formativa-api-gateway.azurewebsites.net/)
* **Documentação Swagger/OpenAPI:** [https://formativa-api-gateway.azurewebsites.net/api/docs](https://formativa-api-gateway.azurewebsites.net/api/docs)

---

## 📹 Vídeo Demonstrativo (YouTube - Não Listado)
* **Link do Vídeo:** [https://youtu.be/JhIgVuGcaQM](https://youtu.be/JhIgVuGcaQM)

### Checklist Roteirizado para Gravação:
1. **Apresentação Inicial:** Todos os integrantes (`Cauã Kammler`, `Gabriel de Lima Chagas` e `Vinicius Soares da Silva`) com câmeras abertas e identificação do projeto.
2. **Navegação no Frontend em Nuvem:** Acessar o Azure Static Web Apps, exibir o **Dashboard** com os cards preenchidos via retorno único do BFF (`/api/summary`).
3. **Autenticação JWT:** Demonstrar a validação de sessão e o envio do Bearer token nas chamadas de rede (DevTools).
4. **CRUD Completo:** Cadastrar, editar e excluir clientes e produtos, mostrando os dados refletidos no MongoDB (Azure Cosmos DB) e no Azure SQL.
5. **Mensageria Assíncrona:** Cadastrar um cliente no frontend, exibir o banner visual de publicação na fila do Azure Service Bus e comprovar o registro persistido na tabela de auditoria consultada pelo Dashboard.
