import axios from "axios";
const baseUrl = "/api/login";

let token = null;

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getToken = () => {
  return token;
};

export default { login, setToken, getToken };
