import React from "react";
import "../styles/itemlist.css";
import { useDispatch, useSelector } from "react-redux";

const ItemList = ({ item }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.rootReducer.cartItems);

  const handleAddToCart = () => {
    // Check if the item already exists in the cart
    const existingItem = cartItems.find(
      (cartItem) => cartItem._id === item._id
    );

    if (existingItem) {
      // If the item exists, update its quantity
      dispatch({
        type: "UPDATE_CART_ITEM",
        payload: { ...existingItem, quantity: existingItem.quantity + 1 },
      });
    } else {
      // If the item does not exist, add it to the cart
      dispatch({
        type: "ADD_TO_CART",
        payload: { ...item, quantity: 1 },
      });
    }
  };

  return (
    <div>
      <div className="card">
        <img src={item.image} alt={item.name} className="card-img" />
        <p className="card-title">{item.name}</p>
        <p className="card-info">₹{item.price}</p>
        <button className="navbut1" onClick={handleAddToCart}>
          <i className="fa-solid fa-plus"></i>Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ItemList;
