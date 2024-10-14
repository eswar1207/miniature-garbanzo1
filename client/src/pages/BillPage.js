import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { Table,  Modal, Form, Input, Select, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { ElegantCard, PageTitle, StyledButton } from '../styles/SharedStyles';

const { Option } = Select;

const BillPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/bills/get-bills");
      console.log("Raw response:", response);
      console.log("Response data type:", typeof response.data);
      console.log("Is response.data an array?", Array.isArray(response.data));
      console.log("Fetched bills:", response.data);

      // Extract the bills array from the response
      const billsArray = response.data.data;

      console.log("Is billsArray an array?", Array.isArray(billsArray));
      console.log("Bills array:", billsArray);

      setBills(Array.isArray(billsArray) ? billsArray : []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bills:", err);
      setError("Failed to fetch bills. Please try again later.");
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Customer Phone",
      dataIndex: "customerPhoneNumber",
      key: "customerPhoneNumber",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `₹${Number(amount).toFixed(2)}`,
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
      render: (tax) => `₹${Number(tax).toFixed(2)}`,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <EditOutlined
            onClick={() => handleEdit(record)}
            style={{ marginRight: 12 }}
          />
          <DeleteOutlined
            onClick={() => handleDelete(record._id)}
            style={{ color: "red" }}
          />
        </>
      ),
    },
  ];

  const handleEdit = (record) => {
    setEditingBill(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/bills/delete-bills/${id}`);
      message.success("Bill deleted successfully");
      fetchBills();
    } catch (err) {
      console.error("Error deleting bill:", err);
      message.error("Failed to delete bill");
    }
  };

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingBill) {
          console.log("Updating bill with ID:", editingBill._id);
          console.log("Update data:", values);
          const response = await axios.patch(
            `/api/bills/update-bills/${editingBill._id}`,
            values
          );
          console.log("Update response:", response);
          message.success("Bill updated successfully");
        } else {
          const response = await axios.post("/api/bills/add-bill", values);
          console.log("Add response:", response);
          message.success("Bill added successfully");
        }
        setIsModalVisible(false);
        fetchBills();
      } catch (err) {
        console.error("Error adding/updating bill:", err);
        if (err.response) {
          console.error("Error response:", err.response.data);
          console.error("Error status:", err.response.status);
        }
        message.error("Failed to add/update bill");
      }
    });
  };
  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <DefaultLayout>
      <PageTitle>Bills 📄</PageTitle>
      <ElegantCard>
        <StyledButton type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: '20px' }}>
          Add Bill
        </StyledButton>
        <Table
          columns={columns}
          dataSource={bills}
          loading={loading}
          rowKey="_id"
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
      </ElegantCard>

      <Modal
        title={editingBill ? "Update Bill" : "Add Bill"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Customer Name"
            name="customerName"
            rules={[
              { required: true, message: "Please enter customer name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Customer Phone"
            name="customerPhoneNumber"
            rules={[
              {
                required: true,
                message: "Please enter customer phone number",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Total Amount"
            name="totalAmount"
            rules={[{ required: true, message: "Please enter total amount" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Tax"
            name="tax"
            rules={[{ required: true, message: "Please enter tax" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Payment Method"
            name="paymentMethod"
            rules={[
              { required: true, message: "Please select payment method" },
            ]}
          >
            <Select>
              <Option value="cash">Cash</Option>
              <Option value="card">Card</Option>
              <Option value="online">Online</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default BillPage;
