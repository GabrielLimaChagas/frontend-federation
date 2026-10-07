import { Suspense } from "react";
import CustomerList from "./pages/CustomerList";

export default function App() {
  return (
    <div>
      <header>
        <h1>Meu Sistema</h1>
        <nav>
          <a href="/">Início</a>
          {" | "}
          <a href="/professores">Clientes</a>
        </nav>
      </header>

      <main>
        <Suspense fallback={<p>Carregando módulo...</p>}>
          <CustomerList />
        </Suspense>
      </main>
    </div>
  );
}
