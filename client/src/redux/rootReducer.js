const initialState = {
    loading: false,
    cartItems: []
};

export const rootReducer = (state = initialState, action) => {
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
                cartItems: [...state.cartItems, action.payload],
            };
        case "UPDATE_CART":
            return {
                ...state,
                cartItems: state.cartItems.map((item) =>
                    item._id === action.payload._id ? action.payload : item
                ),
            };
        case "DELETE_FROM_CART":
            return {
                ...state,
                cartItems: state.cartItems.filter(
                    (item) => item._id !== action.payload._id
                ),
            };
        case "CLEAR_CART":
            return {
                ...state,
                cartItems: [],
            };
        default:
            return state;
    }
};
