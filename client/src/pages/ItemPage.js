import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { Row, Col, Button, Form, Modal, Input, Select } from "antd";
import axios from "axios";
import {
  PlusCircleOutlined,
} from "@ant-design/icons";
import "../styles/ItemPage.css";

const ItemPage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newCategory] = useState("");
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
      editForm.setFieldsValue({
        name: selectedItem.name,
        price: selectedItem.price,
        image: selectedItem.image,
        category: selectedItem.category,
      });
    }
  }, [selectedItem, editModal, editForm]);

  const handleAddItem = async () => {
    try {
      const values = form.getFieldsValue();
      const newItem = {
        name: values.name,
        price: values.price,
        image: values.image,
        category: selectedCategory || newCategory,
      };

      const existingItem = itemsData.find((item) => item.name === newItem.name);
      if (existingItem) {
        alert("Item with the same name already exists");
        return;
      }

      await axios.post("/api/items/add-item", newItem);
      const response = await axios.get("/api/items/get-item");
      setItemsData(response.data);
      setPopupModal(false);
      form.resetFields();
      setSelectedCategory("");
      setCategories(
        response.data
          .map((item) => item.category)
          .filter((category, index, self) => self.indexOf(category) === index)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (record) => {
    setSelectedItem(record);
    setEditModal(true);
    editForm.setFieldsValue(record);
  };

  const handleUpdateItem = async () => {
    try {
      const values = editForm.getFieldsValue();
      const updatedItem = {
        ...selectedItem,
        name: values.name,
        price: values.price,
        image: values.image,
        category: editForm.getFieldValue("category"),
      };

      await axios.put(`/api/items/edit-item/${selectedItem._id}`, updatedItem);
      setItemsData(
        itemsData.map((item) =>
          item._id === selectedItem._id ? updatedItem : item
        )
      );
      setEditModal(false);
      editForm.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (record) => {
    try {
      await axios.delete(`/api/items/delete-item/${record._id}`);
      setItemsData(itemsData.filter((item) => item._id !== record._id));
    } catch (error) {
      console.log(error);
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
      <div className="itempages-head">
        <h1>Items</h1>
        <div style={{ marginBottom: 20 }}>
          {categories.map((category) => (
            <Button
              key={category}
              className={
                selectedCategory === category ? "navbut1 active" : "navbut1"
              }
              onClick={() => handleCategoryChange(category)}
              style={{ marginRight: 10 }}
            >
              {category}
            </Button>
          ))}
        </div>
        <button className="navbut1" onClick={() => setPopupModal(true)}>
          <PlusCircleOutlined
            className="iconaddtocart"
            style={{ cursor: "pointer" }}
          />
          Add Item
        </button>
      </div>
      <Row gutter={16}>
        {filteredItems.map((item) => (
          <Col key={item._id} xs={24} sm={12} md={8} lg={6} xl={4}>
            <div className="card">
              <div className="dish-card-container">
                <img
                  className="card-img"
                  loading="lazy"
                  src={item.image}
                  alt={item.name}
                />
                <div className="dish-info">
                  <p className="card-title">{item.name}</p>
                  <p className="card-info">₹{item.price}</p>
                </div>
                <div className="card-actions">
                  <button className="navbut1" onClick={() => handleEdit(item)}>
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <button
                    className="navbut1"
                    onClick={() => handleDelete(item)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Modal
        title="Add Item"
        visible={popupModal}
        onOk={handleAddItem}
        onCancel={() => setPopupModal(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Price" name="price">
            <Input />
          </Form.Item>
          <Form.Item label="Image" name="image">
            <Input />
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select value={selectedCategory} onChange={handleCategoryChange}>
              {categories.map((category) => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Item"
        visible={editModal}
        onOk={handleUpdateItem}
        onCancel={() => setEditModal(false)}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Price" name="price">
            <Input />
          </Form.Item>
          <Form.Item label="Image" name="image">
            <Input />
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select
              value={selectedItem.category}
              onChange={handleCategoryChange}
            >
              {categories.map((category) => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default ItemPage;
