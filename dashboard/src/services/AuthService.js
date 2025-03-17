import axios from "axios";

const API_URL = "http://localhost:3000"; 

// Register User
export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData);
};

// Login User
export const loginUser = async (userData) => {
  return await axios.post(`${API_URL}/login`, userData);
};

// Forgot Password
export const forgotPassword = async (userData) => {
  return await axios.post(`${API_URL}/forgot-password`, userData);
};





