import axios from "axios";

// API base URL
const apiUrl = `${import.meta.env.VITE_SERVER_HOST}/api/admin`;

// Function to get user token from local storage
const getUserToken = () => {
  const key = localStorage.getItem("admin");
  return JSON.parse(key)?.token || null;
};

// Axios instance for regular requests
const reqInstance = axios.create({});

// Axios instance for file upload requests
const reqInstanceUpload = axios.create({
  headers: {
    "Content-Type": "multipart/form-data; boundary=XXX",
  },
});

// Upload image asset
export const uploadImage = (adminId, data) => {
  setAuthHeader(reqInstanceUpload);
  return reqInstanceUpload.post(`${apiUrl}/upload/${adminId}`, data);
};

// Function to set Authorization header with user token
const setAuthHeader = (instance) => {
  const token = getUserToken();
  if (token) {
    instance.defaults.headers.Authorization = `Bearer ${token}`;
  }
};

// Login to an admin profile
export const loginAdmin = (data) => {
  return reqInstance.post(`${apiUrl}/login`, data);
};

// Login to an admin profile
export const checkAdmin = (email) => {
  setAuthHeader(reqInstance);
  return reqInstance.get(`${apiUrl}/valid/${email}`);
};

// Create a new quiz
export const addQuiz = (data) => {
  setAuthHeader(reqInstance);
  return reqInstance.post(`${apiUrl}/quiz/add`, data);
};

// Get all Quizzes
export const getQuizzes = (admin) => {
  setAuthHeader(reqInstance);
  return reqInstance.get(`${apiUrl}/all/created/quizzes/${admin}`);
};

// MOdify a specific Quiz
export const modifyQuiz = (data) => {
  setAuthHeader(reqInstance);
  return reqInstance.put(`${apiUrl}/quiz/modify`, data);
};

// Delete a specific Quiz
export const removeQuiz = (id, admin) => {
  setAuthHeader(reqInstance);
  return reqInstance.delete(`${apiUrl}/delete/quiz/${id}/user/${admin}`);
};

// Modify a statement of a client
export const modifyStatement = (id, data) => {
  setAuthHeader(reqInstance);
  return reqInstance.put(`${apiUrl}/generated/statement/${id}`, data);
};

// Get all Statements
export const getStatements = (admin) => {
  setAuthHeader(reqInstance);
  return reqInstance.get(`${apiUrl}/all/generated/statements/${admin}`);
};

// Get all Clients
export const getClients = (admin) => {
  setAuthHeader(reqInstance);
  return reqInstance.get(`${apiUrl}/clients/${admin}`);
};
