import axios from "axios";

// API base URL
const apiUrl = `${import.meta.env.VITE_SERVER_HOST}/api/client`;

// Function to get user token from local storage
const getUserToken = () => {
  const key = localStorage.getItem("client");
  return JSON.parse(key)?.token || null;
};

// Axios instance for regular requests
const reqInstance = axios.create({});

// Function to set Authorization header with user token
const setAuthHeader = (instance) => {
  const token = getUserToken();
  if (token) {
    instance.defaults.headers.Authorization = `Bearer ${token}`;
  }
};

// Create a new Client profile
export const createNewClient = (data) => {
  return reqInstance.post(`${apiUrl}/add`, data);
};

// Login to a Client profile
export const loginClient = (data) => {
  return reqInstance.post(`${apiUrl}/login`, data);
};

// Get user profile
export const getClientProfile = (id) => {
  setAuthHeader(reqInstance);
  return reqInstance.get(`${apiUrl}/profile/${id}`);
};
