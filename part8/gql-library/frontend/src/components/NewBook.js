import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";

import { ADD_BOOK, ALL_BOOKS } from "../queries";

const NewBook = ({ token }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) navigate("/");
  }, [token]);

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }],
  });

  const submit = async (event) => {
    event.preventDefault();

    if (genres.length > 0) {
      addBook({ variables: { title, author, published: Number(published), genres } });
      setTitle("");
      setPublished("");
      setAuthor("");
      setGenres([]);
      setGenre("");
    } else return alert("please add at least one genre");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input value={title} onChange={({ target }) => setTitle(target.value)} required />
        </div>
        <div>
          author
          <input value={author} onChange={({ target }) => setAuthor(target.value)} required />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
            required
          />
        </div>
        <div>
          <input value={genre} onChange={({ target }) => setGenre(target.value)} />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(", ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
