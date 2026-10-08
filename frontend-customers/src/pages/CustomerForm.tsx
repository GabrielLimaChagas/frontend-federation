import { type SubmitHandler, useForm } from "react-hook-form";
import Header from "../components/base/Header";
import Button from "../components/core/Button";
import Col from "../components/core/Col";
import Form from "../components/core/Form";
import Input from "../components/core/Input";
import Row from "../components/core/Row";
import "../index.css";
import type { Customer } from "./CustomerList";

interface CustomerFormProps {
  initialData?: Customer;
  onFinish: (customer: Customer) => void;
}

const CustomerForm = ({ initialData, onFinish }: CustomerFormProps) => {
  const methods = useForm<Customer>();

  if (initialData) methods.setValues(initialData);

  const onSubmit: SubmitHandler<Customer> = (data) => onFinish(data);
  return (
    <Col className="w-full">
      <Header title="Customers" />
      <Col className="w-full p-2">
        <Col className="bg-white p-4 rounded-lg shadow-md">
          <Form
            className="flex flex-col gap-2"
            methods={methods}
            onSubmit={onSubmit}
          >
            <Row className="gap-16">
              <Col className="w-full">
                <Input name="name" label="Nome" />
                <Input name="pipelinesCount" label="Compras em Andamento" />
                <Button
                  type="submit"
                  label="Salvar Alterações"
                  variant="primary"
                  className="mt-4"
                />
              </Col>
            </Row>
          </Form>
        </Col>
      </Col>
    </Col>
  );
};

export default CustomerForm;
