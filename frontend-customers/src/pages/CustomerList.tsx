import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import Header from "../components/base/Header";
import Table from "../components/base/Table";
import Button from "../components/core/Button";
import Col from "../components/core/Col";
import IconButton from "../components/core/IconButton";
import Row from "../components/core/Row";
import { NAVIGATION_ROUTES } from "../consts/navigationRoutes";
import "../index.css";
import { useState } from "react";
import CustomerForm from "./CustomerForm";

export type Customer = {
  id: string;
  name: string;
  pipelinesCount: number;
};

const CustomerList = () => {
  const [data, setData] = useState([
    { id: "0", name: "Maria", pipelinesCount: 2 },
    { id: "1", name: "Antônio", pipelinesCount: 27 },
  ] as Customer[]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const removeCustomer = (id: string) => {
    setData(data.filter((customer) => customer.id !== id));
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
        </Col>
      </Col>
      {!!selectedCustomer && (
        <CustomerForm
          onFinish={(customer) => {
            setData([...(selectedCustomer !== "new" ? data.filter((customer) => customer.id !== selectedCustomer) : data), { ...customer, id: data.length.toString() }]);
            setSelectedCustomer(null);
          }}
          initialData={data.find(
            (customer) => customer.id === selectedCustomer,
          )}
        />
      )}
    </>
  );
};

export default CustomerList;
