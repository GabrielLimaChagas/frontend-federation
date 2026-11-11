import { useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import Header from "../components/base/Header";
import Button from "../components/core/Button";
import Col from "../components/core/Col";
import Form from "../components/core/Form";
import Input from "../components/core/Input";
import Row from "../components/core/Row";
import "../index.css";
import type { Customer } from "../services/customerService";

interface CustomerFormProps {
  initialData?: Customer;
  onFinish: (customer: Omit<Customer, "id">) => void;
  onCancel?: () => void;
}

const CustomerForm = ({ initialData, onFinish, onCancel }: CustomerFormProps) => {
  const methods = useForm<Customer>({
    defaultValues: initialData || { name: "", pipelinesCount: 0 },
  });

  useEffect(() => {
    if (initialData) {
      methods.reset(initialData);
    }
  }, [initialData, methods]);

  const onSubmit: SubmitHandler<Customer> = (data) => {
    onFinish({
      name: data.name,
      pipelinesCount: Number(data.pipelinesCount),
    });
  };

  return (
    <Col className="w-full">
      <Header title="Clientes" />
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
                <Input
                  name="pipelinesCount"
                  label="Compras em Andamento"
                  type="number"
                />
                <Row className="gap-2 mt-4">
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
              </Col>
            </Row>
          </Form>
        </Col>
      </Col>
    </Col>
  );
};

export default CustomerForm;
