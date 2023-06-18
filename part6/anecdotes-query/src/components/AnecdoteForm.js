import { useMutation, useQueryClient } from "react-query";
import { createAnecdote } from "../requests";
import { useContext } from "react";
import NotificationContext from "../NotificationContext";

const AnecdoteForm = () => {
  const [notification, sendNotification] = useContext(NotificationContext);

  const queryClient = useQueryClient();

  const newAnecdoteMutation = useMutation({
    mutationFn: (event) => {
      event.preventDefault();
      const content = event.target.anecdote.value;
      event.target.anecdote.value = "";
      return createAnecdote(content);
    },
    onSuccess: (newAnecdote) => {
      sendNotification(`Created "${newAnecdote.content}"`);
      const previous = queryClient.getQueryData("anecdotes");
      queryClient.setQueryData("anecdotes", previous.concat(newAnecdote));
    },
    onError: (error) => {
      sendNotification(error.response.data.error);
    },
  });

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={newAnecdoteMutation.mutate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
