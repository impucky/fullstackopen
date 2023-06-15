import axios from "axios";
import loginService from "./login";
const baseUrl = "/api/blogs";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const createNew = async (newBlog) => {
  const config = { headers: { Authorization: loginService.getToken() } };
  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, createNew };
