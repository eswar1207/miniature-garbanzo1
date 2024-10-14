import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { Row, Col, Button, Form, Modal, Input, Select, message } from "antd";
import axios from "axios";
import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "../styles/ItemPage.css";

const { Option } = Select;

const ItemPage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [selectedItem, setSelectedItem] = useState({});

  useEffect(() => {
    const getAllItems = async () => {
      try {
        const { data } = await axios.get("/api/items/get-item");
        setItemsData(data);
        const uniqueCategories = [
          "all",
          ...new Set(data.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.log(error);
      }
    };
    getAllItems();
  }, []);

  useEffect(() => {
    if (editModal) {
      editForm.setFieldsValue(selectedItem);
    }
  }, [selectedItem, editModal, editForm]);

  const handleAddItem = async () => {
    try {
      const values = await form.validateFields();
      const newItem = {
        ...values,
        category: selectedCategory === "all" ? values.category : selectedCategory,
      };

      const existingItem = itemsData.find((item) => item.name === newItem.name);
      if (existingItem) {
        message.error("Item with the same name already exists");
        return;
      }

      await axios.post("/api/items/add-item", newItem);
      message.success("Item added successfully");
      const response = await axios.get("/api/items/get-item");
      setItemsData(response.data);
      setPopupModal(false);
      form.resetFields();
      setSelectedCategory("all");
      setCategories([
        "all",
        ...new Set(response.data.map((item) => item.category)),
      ]);
    } catch (error) {
      console.log(error);
      message.error("Failed to add item");
    }
  };

  const handleEdit = (record) => {
    setSelectedItem(record);
    setEditModal(true);
  };

  const handleUpdateItem = async () => {
    try {
      const values = await editForm.validateFields();
      const updatedItem = {
        ...selectedItem,
        ...values,
      };

      await axios.put(`/api/items/edit-item/${selectedItem._id}`, updatedItem);
      message.success("Item updated successfully");
      setItemsData(
        itemsData.map((item) =>
          item._id === selectedItem._id ? updatedItem : item
        )
      );
      setEditModal(false);
      editForm.resetFields();
    } catch (error) {
      console.log(error);
      message.error("Failed to update item");
    }
  };

  const handleDelete = async (record) => {
    try {
      await axios.delete(`/api/items/delete-item/${record._id}`);
      message.success("Item deleted successfully");
      setItemsData(itemsData.filter((item) => item._id !== record._id));
    } catch (error) {
      console.log(error);
      message.error("Failed to delete item");
    }
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const filteredItems =
    selectedCategory === "all"
      ? itemsData
      : itemsData.filter((item) => item.category === selectedCategory);

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between align-items-center">
        <h1>Item List</h1>
        <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => setPopupModal(true)}>
          Add Item
        </Button>
      </div>
      <Select
        style={{ width: 200, marginBottom: 20 }}
        value={selectedCategory}
        onChange={handleCategoryChange}
      >
        {categories.map((category) => (
          <Option key={category} value={category}>{category}</Option>
        ))}
      </Select>
      <Row gutter={[16, 16]}>
        {filteredItems.map((item) => (
          <Col key={item._id} xs={24} sm={12} md={8} lg={6}>
            <div className="item-card">
              <img src={item.image} alt={item.name} className="item-image" />
              <h3 className="item-name">{item.name}</h3>
              <p className="item-price">Price: ₹{item.price}</p>
              <div className="item-actions">
                <EditOutlined
                  className="edit-icon"
                  onClick={() => handleEdit(item)}
                />
                <DeleteOutlined
                  className="delete-icon"
                  onClick={() => handleDelete(item)}
                />
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Modal
        title="Add New Item"
        visible={popupModal}
        onCancel={() => setPopupModal(false)}
        footer={false}
      >
        <Form layout="vertical" onFinish={handleAddItem} form={form}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="image" label="Image URL" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select>
              {categories.filter(cat => cat !== "all").map((category) => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <div className="d-flex justify-content-end">
            <Button type="primary" htmlType="submit">
              SAVE
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Edit Item"
        visible={editModal}
        onCancel={() => setEditModal(false)}
        footer={false}
      >
        <Form
          layout="vertical"
          initialValues={selectedItem}
          onFinish={handleUpdateItem}
          form={editForm}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="image" label="Image URL" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select>
              {categories.filter(cat => cat !== "all").map((category) => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <div className="d-flex justify-content-end">
            <Button type="primary" htmlType="submit">
              SAVE
            </Button>
          </div>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default ItemPage;
