import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import Header from "../components/base/Header";
import Table from "../components/base/Table";
import Button from "../components/core/Button";
import Col from "../components/core/Col";
import IconButton from "../components/core/IconButton";
import Row from "../components/core/Row";
import ProductForm from "./ProductForm";

export type Product = {
  id: string;
  name: string;
  price: number;
};

const formatCentAsReal = (value = 0) =>
  (value / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const ProductList = () => {
  const [data, setData] = useState([
    { id: "0", name: "Roçadeira Stihl", price: 25999 },
    { id: "1", name: "Óleo 2T", price: 3299 },
  ] as Product[]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const removeCustomer = (id: string) => {
    setData(data.filter((product) => product.id !== id));
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
                      onClick={() => removeCustomer(item.id)}
                    />
                  </Row>
                ),
              },
            ]}
            data={data}
            keyExtractor={(item: { id: string }) => item.id}
          />
        </Col>
      </Col>
      {!!selectedProduct && (
        <ProductForm
          onFinish={(product) => {
            if (selectedProduct === "new") {
              setData([
                ...data,
                { ...product, id: new Date().getTime().toString() },
              ]);
            } else {
              const editingIndex = data.findIndex(
                (product) => product.id === selectedProduct,
              );
              const newData = [...data];
              newData[editingIndex] = { ...newData[editingIndex], ...product };
              setData(newData);
            }
            setSelectedProduct(null);
          }}
          initialData={data.find((product) => product.id === selectedProduct)}
        />
      )}
    </>
  );
};

export default ProductList;
