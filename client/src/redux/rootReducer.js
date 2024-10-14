const initalState = {
    loading: false,
    cartItems: []  // Corrected from carItems to cartItems
};

export const rootReducer = (state = initalState, action) => {
    switch (action.type) {
      case "LOADING":
        return {
          ...state,
          loading: action.payload,
        };
      case "GET_CART_ITEMS":
      case "ADD_TO_CART":
        return {
          ...state,
          cartItems: [...state.cartItems, action.payload], // Corrected from carItems to cartItems
        };
      case "UPDATE_QUANTITY":
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item._id === action.payload._id
              ? { ...item, quantity: action.payload.quantity }
              : item
          ),
        };
      case "CLEAR_CART":
        return { ...state, cartItems: [] };
      case "DELETE_ITEM_CART":
        return {
          ...state,
          cartItems: state.cartItems.filter(
            (item) => item._id !== action.payload._id
          ),
        };
      default:
        return state;
    }
};