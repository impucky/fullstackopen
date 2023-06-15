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

// eslint-disable-next-line import/no-anonymous-default-export
export default { login, setToken, getToken };
