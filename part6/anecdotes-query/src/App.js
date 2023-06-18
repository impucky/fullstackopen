import { useContext } from "react";
import NotificationContext from "./NotificationContext";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getAnecdotes, voteForAnecdote } from "./requests";

import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";

const App = () => {
  const [notification, sendNotification] = useContext(NotificationContext);
  const queryClient = useQueryClient();

  const { isLoading, isError, data } = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
  });

  const voteMutation = useMutation({
    mutationFn: voteForAnecdote,
    onSuccess: (updatedAnecdote) => {
      sendNotification(`Voted for "${updatedAnecdote.content}"`);
      queryClient.setQueryData(
        "anecdotes",
        data.map((anecdote) => {
          return updatedAnecdote.id === anecdote.id ? updatedAnecdote : anecdote;
        })
      );
    },
  });

  if (isError) return <p>Server error</p>;

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteForm />
      {data &&
        data.map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => voteMutation.mutate(anecdote)}>vote</button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default App;
