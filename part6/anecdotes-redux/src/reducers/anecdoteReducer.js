import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const byVotes = (a, b) => {
  return a.votes < b.votes ? 1 : -1;
};

const anecdoteSlice = createSlice({
  name: "anecdote",
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      return state.concat(action.payload);
    },
    updateVotes(state, action) {
      return state
        .map((anecdote) => {
          return anecdote.id === action.payload.id ? action.payload : anecdote;
        })
        .sort(byVotes);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const voteForAnecdote = (anecdote) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.voteOn(anecdote);
    dispatch(updateVotes(newAnecdote));
  };
};

export const { appendAnecdote, updateVotes, setAnecdotes } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;
