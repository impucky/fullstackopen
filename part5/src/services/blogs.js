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

const remove = async (id) => {
  const config = { headers: { Authorization: loginService.getToken() } };
  await axios.delete(`${baseUrl}/${id}`, config);
};

const like = async (id, likes) => {
  const config = { headers: { Authorization: loginService.getToken() } };
  await axios.put(`${baseUrl}/${id}`, { likes: likes + 1 }, config);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, createNew, remove, like };
