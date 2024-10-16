import axios from 'axios';

// Create an instance of axios with the backend URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,  // This will be the URL from Render
});

export default api;
