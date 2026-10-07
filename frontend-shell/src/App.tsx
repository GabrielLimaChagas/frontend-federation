import { Suspense, lazy } from "react";

const CustomersList = lazy(() => import("customers/CustomerList"));

export default function App() {
  return (
    <div>
      <main>
        <Suspense fallback={<p>Carregando módulo...</p>}>
          <CustomersList />
        </Suspense>
      </main>
    </div>
  );
}
