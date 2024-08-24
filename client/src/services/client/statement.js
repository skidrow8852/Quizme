import axios from "axios";

// API base URL
const apiUrl = `${import.meta.env.VITE_SERVER_HOST}/api/statement`;

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

// Create a new Client Statement
export const createNewClientStatement = (id, data) => {
  setAuthHeader(reqInstance);
  return reqInstance.post(`${apiUrl}/new/statement/${id}`, data);
};

// Get Client statements
export const getClientStatements = (id) => {
  setAuthHeader(reqInstance);
  return reqInstance.get(`${apiUrl}/all/generated/statements/${id}`);
};
