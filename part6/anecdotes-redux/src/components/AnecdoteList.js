import { useSelector, useDispatch } from "react-redux";
import { voteForAnecdote } from "../reducers/anecdoteReducer";
import { notify } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => state.anecdotes);
  const filter = useSelector((state) => state.filter);
  const dispatch = useDispatch();

  const handleVote = (anecdote) => {
    dispatch(voteForAnecdote(anecdote));
    dispatch(notify(`Voted for ${anecdote.content}`, 5));
  };

  return (
    <>
      {anecdotes
        .filter((a) => a.content.toLowerCase().includes(filter))
        .map((anecdote) => (
          <div style={{ padding: "0.8rem", borderBottom: "1px solid #bbb" }} key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes} votes <button onClick={() => handleVote(anecdote)}>vote</button>
            </div>
          </div>
        ))}
    </>
  );
};

export default AnecdoteList;
