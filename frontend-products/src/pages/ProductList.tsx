import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import Header from "../components/base/Header";
import Table from "../components/base/Table";
import Button from "../components/core/Button";
import Col from "../components/core/Col";
import IconButton from "../components/core/IconButton";
import Row from "../components/core/Row";
import ProductForm from "./ProductForm";
import { productService, type Product } from "../services/productService";

export type { Product };

const formatCentAsReal = (value = 0) =>
  (value / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const ProductList = () => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const products = await productService.getAll();
      setData(products);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const removeProduct = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir este produto?")) return;
    try {
      await productService.delete(id);
      setData((prev) => prev.filter((product) => product.id !== id));
    } catch (err: any) {
      alert(err.message || "Erro ao excluir produto");
    }
  };

  const handleFinish = async (formProduct: Omit<Product, "id">) => {
    try {
      if (selectedProduct === "new") {
        const created = await productService.create(formProduct);
        setData((prev) => [...prev, created]);
      } else if (selectedProduct) {
        const updated = await productService.update(selectedProduct, formProduct);
        setData((prev) =>
          prev.map((product) => (product.id === selectedProduct ? updated : product))
        );
      }
      setSelectedProduct(null);
    } catch (err: any) {
      alert(err.message || "Erro ao salvar produto");
    }
  };

  return (
    <>
      <Col className="w-full">
        <Header
          title="Produtos"
          rightAttachment={
            <Button
              label="Novo Produto"
              variant="primary"
              onClick={() => setSelectedProduct("new")}
            />
          }
        />
        <Col className="p-2">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}
          {loading ? (
            <div className="p-4 text-neutral-500">Carregando produtos...</div>
          ) : (
            <Table
              className="shadow"
              columns={[
                { header: "ID", accessor: "id" },
                { header: "Nome", accessor: "name" },
                {
                  header: "Preço",
                  accessor: (item) => formatCentAsReal(item.price),
                },
                {
                  header: "",
                  accessor: (item) => (
                    <Row className="text-neutral-600 justify-end gap-1">
                      <IconButton
                        icon={<PencilSquareIcon className="w-5 h-5" />}
                        onClick={() => setSelectedProduct(item.id)}
                      />
                      <IconButton
                        icon={<TrashIcon className="w-5 h-5" />}
                        onClick={() => removeProduct(item.id)}
                      />
                    </Row>
                  ),
                },
              ]}
              data={data}
              keyExtractor={(item: { id: string }) => item.id}
            />
          )}
        </Col>
      </Col>
      {!!selectedProduct && (
        <ProductForm
          onFinish={handleFinish}
          onCancel={() => setSelectedProduct(null)}
          initialData={data.find((product) => product.id === selectedProduct)}
        />
      )}
    </>
  );
};

export default ProductList;
