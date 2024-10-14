import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { Col, Row, Input, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import styled from 'styled-components';
import { PageTitle } from '../styles/SharedStyles';

const { Search } = Input;

// Define the new saffron color
const saffronColor = '#FF9933';
const saffronColorHover = '#FF8000';

const ItemCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  max-width: 240px;
  margin: 0 auto;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ItemImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
`;

const ItemContent = styled.div`
  padding: 12px;
`;

const ItemName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const ItemPrice = styled.p`
  font-size: 14px;
  color: ${saffronColor};
  font-weight: 500;
  margin-bottom: 8px;
`;

const StyledButton = styled.button`
  background-color: ${saffronColor};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${saffronColorHover};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 153, 51, 0.5);
  }
`;

const CategoryButton = styled(StyledButton)`
  margin-right: 8px;
  margin-bottom: 8px;
  
  &.active {
    background-color: ${saffronColorHover};
    color: white;
  }
`;

const AddToCartButton = styled(StyledButton)`
  width: 100%;
  font-size: 14px;
  height: 32px;
`;

const StyledSearch = styled(Search)`
  .ant-input-group-addon {
    background-color: ${saffronColor} !important;
    border-color: ${saffronColor} !important;
  }

  .ant-input-search-button {
    background-color: ${saffronColor} !important;
    border-color: ${saffronColor} !important;

    &:hover {
      background-color: ${saffronColorHover} !important;
      border-color: ${saffronColorHover} !important;
    }
  }
`;

const Homepage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();
  const { cartItems } = useSelector(state => state.rootReducer);

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

  const handleAddToCart = (item) => {
    const existingItem = cartItems.find(cartItem => cartItem._id === item._id);
    if (existingItem) {
      dispatch({
        type: "UPDATE_CART",
        payload: { ...existingItem, quantity: existingItem.quantity + 1 }
      });
      message.success(`Increased ${item.name} quantity in cart`);
    } else {
      dispatch({
        type: "ADD_TO_CART",
        payload: { ...item, quantity: 1 },
      });
      message.success(`${item.name} added to cart`);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const filteredItems = itemsData.filter((item) => {
    const categoryMatch = selectedCategory === "all" || item.category === selectedCategory;
    const searchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <DefaultLayout>
      <div style={{ padding: "20px" }}>
        <PageTitle style={{ color: saffronColor }}>Menu Items 🍽️</PageTitle>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} sm={12}>
            <div>
              {categories.map((category) => (
                <CategoryButton
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={selectedCategory === category ? 'active' : ''}
                >
                  {category}
                </CategoryButton>
              ))}
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <StyledSearch
              placeholder="Search items"
              allowClear
              enterButton="Search"
              size="large"
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
          {filteredItems.map((item) => (
            <Col xs={12} sm={8} md={6} lg={4} key={item._id}>
              <ItemCard>
                <ItemImage alt={item.name} src={item.image} />
                <ItemContent>
                  <ItemName>{item.name}</ItemName>
                  <ItemPrice>₹{item.price}</ItemPrice>
                  <AddToCartButton onClick={() => handleAddToCart(item)}>
                    Add to Cart
                  </AddToCartButton>
                </ItemContent>
              </ItemCard>
            </Col>
          ))}
        </Row>
      </div>
    </DefaultLayout>
  );
};

export default Homepage;
