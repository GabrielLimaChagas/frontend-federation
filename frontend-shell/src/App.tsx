import { Route, Routes } from "react-router";
import { Suspense, lazy } from "react";
import { NAVIGATION_ROUTES } from "./consts/navigationRoutes";
import RootLayout from "./components/base/RootLayout";

const CustomerList = lazy(() => import("customers/CustomerList"));
const ProductList = lazy(() => import("products/ProductList"));

function App() {
  return (
    <Suspense fallback={<div>Carregando</div>}>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route path={NAVIGATION_ROUTES.PRODUCTS} element={<ProductList />} />
          {/* <Route path={NAVIGATION_ROUTES.NEW_PRODUCT} element={<ProductForm />} /> */}
          <Route
            path={NAVIGATION_ROUTES.CUSTOMERS}
            element={<CustomerList />}
          />
          {/* <Route
          path={NAVIGATION_ROUTES.NEW_CUSTOMER}
          element={<CustomerForm />}
        /> */}
          {/* <Route
          path={NAVIGATION_ROUTES.EDIT_CUSTOMER}
          element={<CustomerForm />}
        /> */}
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
