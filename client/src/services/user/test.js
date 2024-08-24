import axios from "axios";

// API base URL
const apiUrl = `${import.meta.env.VITE_SERVER_HOST}/api/statement`;

// Function to get user token from local storage
const getUserToken = (quizId) => {
  const key = localStorage.getItem(`user:${quizId}`);
  return JSON.parse(key)?.token || null;
};

// Axios instance for regular requests
const reqInstance = axios.create({});

// Function to set Authorization header with user token
const setAuthHeader = (instance, quizId) => {
  const token = getUserToken(quizId);
  if (token) {
    instance.defaults.headers.Authorization = `Bearer ${token}`;
  }
};

// Login to user profile
export const loginUser = (data) => {
  return reqInstance.post(`${apiUrl}/user/quiz`, data);
};

/// check if the Statement is approved
export const checkStatementId = (id) => {
  return reqInstance.get(`${apiUrl}/generated/test/${id}`);
};

// Get Quiz Data for Authenticated users
export const getQuizDataValues = (quizId, username) => {
  setAuthHeader(reqInstance, quizId);
  return reqInstance.get(`${apiUrl}/user/quiz/${quizId}/user/${username}`);
};

// Get Quiz Data for Authenticated users
export const submitQuiz = (quizId, data) => {
  setAuthHeader(reqInstance, quizId);
  return reqInstance.post(`${apiUrl}/submit/quiz`, data);
};
