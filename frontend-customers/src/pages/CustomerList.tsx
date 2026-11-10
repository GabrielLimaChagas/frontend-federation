import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import Header from "../components/base/Header";
import Table from "../components/base/Table";
import Button from "../components/core/Button";
import Col from "../components/core/Col";
import IconButton from "../components/core/IconButton";
import Row from "../components/core/Row";
import "../index.css";
import CustomerForm from "./CustomerForm";
import { customerService, type Customer } from "../services/customerService";

export type { Customer };

const CustomerList = () => {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const customers = await customerService.getAll();
      setData(customers);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const removeCustomer = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir este cliente?")) return;
    try {
      await customerService.delete(id);
      setData((prev) => prev.filter((customer) => customer.id !== id));
    } catch (err: any) {
      alert(err.message || "Erro ao excluir cliente");
    }
  };

  const handleFinish = async (formCustomer: Omit<Customer, "id">) => {
    try {
      if (selectedCustomer === "new") {
        const created = await customerService.create(formCustomer);
        setData((prev) => [...prev, created]);
      } else if (selectedCustomer) {
        const updated = await customerService.update(selectedCustomer, formCustomer);
        setData((prev) =>
          prev.map((customer) => (customer.id === selectedCustomer ? updated : customer))
        );
      }
      setSelectedCustomer(null);
    } catch (err: any) {
      alert(err.message || "Erro ao salvar cliente");
    }
  };

  return (
    <>
      <Col className="w-full">
        <Header
          title="Clientes"
          rightAttachment={
            <Button
              label="Novo Cliente"
              variant="primary"
              onClick={() => setSelectedCustomer("new")}
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
            <div className="p-4 text-neutral-500">Carregando clientes...</div>
          ) : (
            <Table<Customer>
              className="shadow"
              columns={[
                { header: "ID", accessor: "id" },
                { header: "Nome", accessor: "name" },
                { header: "Compras em Andamento", accessor: "pipelinesCount" },
                {
                  header: "",
                  accessor: (item) => (
                    <Row className="text-neutral-600 justify-end gap-1">
                      <IconButton
                        icon={
                          <PencilSquareIcon
                            className="w-5 h-5"
                            onClick={() => setSelectedCustomer(item.id)}
                          />
                        }
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
          )}
        </Col>
      </Col>
      {!!selectedCustomer && (
        <CustomerForm
          onFinish={handleFinish}
          onCancel={() => setSelectedCustomer(null)}
          initialData={data.find(
            (customer) => customer.id === selectedCustomer,
          )}
        />
      )}
    </>
  );
};

export default CustomerList;
