import axios from "axios";
import loginService from "./login";
const baseUrl = "/api/blogs";

const getOne = (id) => axios.get(`${baseUrl}/${id}`).then((res) => res.data);

const getAll = () => axios.get(baseUrl).then((res) => res.data);

const createNew = async (newBlog) => {
  const config = { headers: { Authorization: loginService.getToken() } };
  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const remove = async (blog) => {
  const config = { headers: { Authorization: loginService.getToken() } };
  await axios.delete(`${baseUrl}/${blog.id}`, config);
  return blog;
};

const like = async (blog) => {
  const config = { headers: { Authorization: loginService.getToken() } };
  const response = await axios.put(`${baseUrl}/${blog.id}`, { likes: blog.likes + 1 }, config);
  return response.data;
};

export default { getOne, getAll, createNew, remove, like };
