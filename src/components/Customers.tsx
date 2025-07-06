import { useState, useEffect, useCallback } from "react";
import { Table, Input, Button, Select, Modal, Form } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import "antd/dist/reset.css";
import customerService from "../ApiService/CustomerService";
import "./Customers.css";

interface Customer {
  id: number;
  name: string;
  email: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [desc, setDesc] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form] = Form.useForm();

  const loadCustomers = useCallback(async () => {
    const data = await customerService.getAll(search, sortBy, desc, currentPage, pageSize);
    setCustomers(data.customers);
    setTotalCustomers(data.total);
  }, [search, sortBy, desc, currentPage, pageSize]);
  
  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleDelete = async (id: number) => {
    await customerService.delete(id);
    loadCustomers();
  };

  const handleAdd = () => {
    setEditingCustomer(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    form.setFieldsValue(customer);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    form.validateFields().then(async (values) => {
      if (editingCustomer) {
        await customerService.update(editingCustomer.id, values);
      } else {
        await customerService.create(values);
      }
      setIsModalOpen(false);
      loadCustomers();
    });
  };

  return (
    <div className="customers-container">
      <div className="customers-box">
        <div className="controls-container">
          <div className="search-container">
            <Search placeholder="Search customers" onSearch={setSearch} enterButton />
          </div>
          <div className="sort-container">
            <Select
              placeholder="Sort by"
              onChange={setSortBy}
              className="w-32"
              options={[
                { value: "name", label: "Name" },
                { value: "email", label: "Email" }
              ]}
            />
            <Select
              placeholder="Order"
              onChange={value => setDesc(value === "true")}
              className="w-32"
              options={[
                { value: "true", label: "Descending" },
                { value: "false", label: "Ascending" }
              ]}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Add
            </Button>
          </div>
        </div>
        <div className="table-container">
          <Table
            dataSource={customers}
            rowKey="id"
            columns={[
              { title: "ID", dataIndex: "id" },
              { title: "Name", dataIndex: "name" },
              { title: "Email", dataIndex: "email" },
              {
                title: "Actions",
                render: (_: any, record: Customer) => (
                  <div className="actions-container">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
                  </div>
                ),
              },
            ]}
            pagination={{
              current: currentPage,
              pageSize,
              total: totalCustomers,
              onChange: setCurrentPage
            }}
          />
        </div>
      </div>
      <Modal
        title={editingCustomer ? "Edit Customer" : "Add Customer"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter name" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: "Please enter email" }]}>
            <Input type="email" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
