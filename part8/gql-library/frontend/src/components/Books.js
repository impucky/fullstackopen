import { useState, useEffect } from "react";
import { useQuery, useSubscription, useApolloClient } from "@apollo/client";
import { ALL_BOOKS, BOOK_ADDED } from "../queries";

import BookList from "./BookList";

const Books = (props) => {
  const [genre, setGenre] = useState("all");
  const [allGenres, setAllGenres] = useState(null);
  const { data: books } = useQuery(ALL_BOOKS, { ...(genre !== "all" && { variables: { genre } }) });

  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      client.refetchQueries({
        include: [ALL_BOOKS],
      });
    },
  });

  useEffect(() => {
    if (books && !allGenres) {
      let genres = ["all"];
      books.allBooks.forEach((book) => {
        book.genres.forEach((genre) => {
          if (!genres.includes(genre)) genres.push(genre);
        });
      });
      setAllGenres(genres);
    }
  }, [books]);

  const selectGenre = (e) => {
    setGenre(e.target.value);
  };

  return (
    <div>
      <h2>books</h2>
      genre:{" "}
      <select value={genre} onChange={selectGenre}>
        {allGenres && allGenres.map((g) => <option key={g}>{g}</option>)}
      </select>
      <BookList books={books?.allBooks} />
    </div>
  );
};

export default Books;
