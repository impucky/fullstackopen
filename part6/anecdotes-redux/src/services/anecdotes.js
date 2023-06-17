import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

export const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createNew = async (content) => {
  const anecdote = { content, votes: 0, id: Number((Math.random() * 1000000).toFixed(0)) };
  const response = await axios.post(baseUrl, anecdote);
  return response.data;
};

const voteOn = async (anecdote) => {
  const response = await axios.put(`${baseUrl}/${anecdote.id}`, {
    ...anecdote,
    votes: anecdote.votes + 1,
  });
  return response.data;
};

const anecdoteService = { getAll, createNew, voteOn };

export default anecdoteService;
