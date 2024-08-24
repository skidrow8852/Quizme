import axios from "axios";

// API base URL
const apiUrl = `${import.meta.env.VITE_SERVER_HOST}/api/quizzes`;

// Axios instance for regular requests
const reqInstance = axios.create({});

// Get all quizzes
export const getallQuizzes = () => {
  return reqInstance.get(`${apiUrl}/all/generated/quizzes`);
};
