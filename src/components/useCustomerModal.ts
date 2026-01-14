import { useState } from "react";
import { Form } from "antd";
import { Customer } from "./types";

export function useCustomerModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form] = Form.useForm();

  const openAddModal = () => {
    setEditingCustomer(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    form.setFieldsValue(customer);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return {
    isModalOpen,
    editingCustomer,
    form,
    openAddModal,
    openEditModal,
    closeModal,
  };
}
