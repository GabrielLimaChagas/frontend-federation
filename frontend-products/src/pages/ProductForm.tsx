import { useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import Header from "../components/base/Header";
import Button from "../components/core/Button";
import Col from "../components/core/Col";
import Form from "../components/core/Form";
import Input from "../components/core/Input";
import Row from "../components/core/Row";
import type { Product } from "./ProductList";

interface ProductFormProps {
  initialData?: Product;
  onFinish: (product: Omit<Product, "id">) => void;
  onCancel?: () => void;
}

const ProductForm = ({ initialData, onFinish, onCancel }: ProductFormProps) => {
  const methods = useForm<Product>({
    defaultValues: initialData || { name: "", price: 0 },
  });

  useEffect(() => {
    if (initialData) {
      methods.reset(initialData);
    }
  }, [initialData, methods]);

  const onSubmit: SubmitHandler<Product> = (data) => {
    onFinish({
      name: data.name,
      price: Number(data.price),
    });
  };

  return (
    <Col className="w-full">
      <Header title="Produtos" />
      <Col className="w-full p-2">
        <Col className="bg-white p-4 rounded-lg shadow-md">
          <Form
            className="flex flex-col gap-2 max-w-100"
            methods={methods}
            onSubmit={onSubmit}
          >
            <Input name="name" label="Nome" />
            <Input name="price" label="Preço (em centavos)" type="number" />
            <Row className="gap-2 mt-2">
              <Button
                type="submit"
                label="Salvar Alterações"
                variant="primary"
              />
              {onCancel && (
                <Button
                  type="button"
                  label="Cancelar"
                  variant="secondary"
                  onClick={onCancel}
                />
              )}
            </Row>
          </Form>
        </Col>
      </Col>
    </Col>
  );
};

export default ProductForm;
