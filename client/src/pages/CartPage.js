import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Table, Form, Input, Select, message, Button, Modal } from "antd";
const { Option } = Select;
const CartPage = () => {
  const [subtotal, setSubtotal] = useState(0);
  const [form] = Form.useForm();
  const [billPopup, setBillPopup] = useState(false);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.rootReducer);

  const handleIncrement = (record) => {
    dispatch({
      type: "UPDATE_CART",
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  const handleDecrement = (record) => {
    if (record.quantity > 1) {
      dispatch({
        type: "UPDATE_CART",
        payload: { ...record, quantity: record.quantity - 1 },
      });
    }
  };

  const handleDelete = (record) => {
    dispatch({
      type: "DELETE_FROM_CART",
      payload: record,
    });
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt={record.name} height="60" width="60" />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => `₹${price}`,
    },
    {
      title: "Quantity",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <PlusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleIncrement(record)}
          />
          <b>{record.quantity}</b>
          <MinusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleDecrement(record)}
          />
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <DeleteOutlined
          style={{ cursor: "pointer" }}
          onClick={() => handleDelete(record)}
        />
      ),
    },
  ];

  useEffect(() => {
    const calculateSubtotal = () => {
      const total = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setSubtotal(total);
    };
    calculateSubtotal();
  }, [cartItems]);

  const handleCreateInvoice = async (values) => {
    try {
      const taxAmount = subtotal * (values.tax / 100);
      const totalAmount = subtotal + taxAmount;

      const billData = {
        customerName: values.customerName,
        customerPhoneNumber: values.phoneNumber,
        totalAmount,
        tax: taxAmount,
        paymentMethod: values.paymentMethod,
        cartItems,
        userId: "user_id_here", // You need to get this from your authentication system
      };

      const response = await axios.post("/api/bills/add-bill", billData);
      message.success("Invoice created successfully!");
      setBillPopup(false);
      form.resetFields();
      dispatch({ type: "CLEAR_CART" }); // Clear the cart after generating the invoice

      // Print the bill
      printBill(response.data.data);

      // Clear the cart
      dispatch({ type: "CLEAR_CART" });
    } catch (error) {
      console.error("Error creating invoice:", error);
      message.error("Failed to create invoice!");
    }
  };

  const printBill = (billData) => {
    const printContent = `
    <html>
      <head>
        <title>Bill</title>
        <style>
          body { font-family: Arial, sans-serif; font-size: 12px; width: 80mm; }
          h1 { text-align: center; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .total { font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Invoice</h1>
        <p>Customer: ${billData.customerName}</p>
        <p>Phone: ${billData.customerPhoneNumber}</p>
        <table>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
          ${billData.cartItems
            .map(
              (item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>₹${item.price}</td>
            </tr>
          `
            )
            .join("")}
          <tr>
            <td colspan="2">Subtotal</td>
            <td>₹${billData.totalAmount - billData.tax}</td>
          </tr>
          <tr>
            <td colspan="2">Tax</td>
            <td>₹${billData.tax.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="2">Total</td>
            <td>₹${billData.totalAmount.toFixed(2)}</td>
          </tr>
        </table>
        <p>Thank you for shopping with us!</p>
      </body>
    </html>
  `;

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <DefaultLayout>
      <div className="cart-page">
        <h1>Cart</h1>
        <Table columns={columns} dataSource={cartItems} />
        <h2>Subtotal: ₹{subtotal}</h2>
        <Button type="primary" onClick={() => setBillPopup(true)}>
          Generate Invoice
        </Button>
        <Modal
          title="Generate Invoice"
          visible={billPopup}
          onCancel={() => setBillPopup(false)}
          footer={[
            <Button key="back" onClick={() => setBillPopup(false)}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              form="invoice-form"
            >
              Create Invoice
            </Button>,
          ]}
        >
          <Form
            id="invoice-form"
            form={form}
            layout="vertical"
            onFinish={handleCreateInvoice}
          >
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
              label="Phone Number"
              name="phoneNumber"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Tax"
              name="tax"
              rules={[{ required: true, message: "Please enter tax" }]}
            >
              <Input />
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
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default CartPage;
