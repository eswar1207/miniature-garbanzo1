import { createStore,combineReducers,applyMiddleware } from "redux";
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import { rootReducer } from './rootReducer';
const finalReducer=combineReducers({
    rootReducer: rootReducer
});
const initalState = {
    rootReducer: {
        // Initial state for your app goes here
        cartItems:localStorage.getItem('cartItems') 
            ? JSON.parse(localStorage.getItem('cartItems')) 
            :[],
    },
};
const middleware=[thunk]
const store = createStore(
    finalReducer,
    initalState,
    composeWithDevTools(applyMiddleware(...middleware))
);
export default store;
