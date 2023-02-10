import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:4001',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'auth-token': localStorage.getItem('token'),
  },
});