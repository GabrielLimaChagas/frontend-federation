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
  onFinish: (product: Product) => void;
}

const ProductForm = ({ initialData, onFinish }: ProductFormProps) => {
  const methods = useForm<Product>();

  if (initialData) methods.setValues(initialData);

  const onSubmit: SubmitHandler<Product> = (data) => onFinish(data);

  return (
    <Col className="w-full">
      <Header
        title="Produtos"
      />
      <Col className="w-full p-2">
        <Col className="bg-white p-4 rounded-lg shadow-md">
          <Form
            className="flex flex-col gap-2 max-w-100"
            methods={methods}
            onSubmit={onSubmit}
          >
            <Input name="name" label="Nome" />
            <Input name="price" label="Preço" />
            {/* <Input name="description" label="Descrição" /> */}
            <Row>
              <Button
                type="submit"
                label="Salvar Alterações"
                variant="primary"
              />
            </Row>
          </Form>
        </Col>
      </Col>
    </Col>
  );
};

export default ProductForm;
