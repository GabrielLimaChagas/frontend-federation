import { Route, Routes } from "react-router";
import { Suspense, lazy } from "react";
import { NAVIGATION_ROUTES } from "./consts/navigationRoutes";
import RootLayout from "./components/base/RootLayout";
import Dashboard from "./pages/Dashboard";

const CustomerList = lazy(() => import("customers/CustomerList"));
const ProductList = lazy(() => import("products/ProductList"));

function App() {
  return (
    <Suspense fallback={<div className="p-8 text-neutral-500">Carregando microfrontend...</div>}>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          {/* Rota inicial / Dashboard consumindo o BFF */}
          <Route index element={<Dashboard />} />
          <Route path={NAVIGATION_ROUTES.DASHBOARD} element={<Dashboard />} />

          {/* Rotas dos Microsserviços Federados */}
          <Route path={NAVIGATION_ROUTES.PRODUCTS} element={<ProductList />} />
          <Route path={NAVIGATION_ROUTES.CUSTOMERS} element={<CustomerList />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
