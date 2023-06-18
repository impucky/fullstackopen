import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const makeId = () => Number((Math.random() * 1000000).toFixed(0));

export const getAnecdotes = () => axios.get(baseUrl).then((res) => res.data);

export const createAnecdote = (content) => {
  return axios
    .post(baseUrl, {
      content,
      votes: 0,
      id: makeId(),
    })
    .then((res) => res.data);
};

export const voteForAnecdote = (anecdote) => {
  return axios
    .put(`${baseUrl}/${anecdote.id}`, {
      ...anecdote,
      votes: anecdote.votes + 1,
    })
    .then((res) => res.data);
};
