import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";
import { notify } from "../reducers/notificationReducer";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const add = async (e) => {
    e.preventDefault();
    const content = e.target.content.value;
    e.target.content.value = "";
    dispatch(createAnecdote(content));
    dispatch(notify(`Created anecdote "${content}"`, 5));
  };

  return (
    <>
      <h2>Create new</h2>
      <form onSubmit={add}>
        <input name="content" />
        <button>create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;
