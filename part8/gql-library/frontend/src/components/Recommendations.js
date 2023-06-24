import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useApolloClient } from "@apollo/client";
import { ALL_BOOKS, CURRENT_USER } from "../queries";

import BookList from "./BookList";

const Recommendations = ({ token }) => {
  const { data: user } = useQuery(CURRENT_USER);
  const genre = user?.me.favoriteGenre;
  const { data: recs } = useQuery(ALL_BOOKS, { skip: !genre, variables: { genre } });

  const client = useApolloClient();

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) navigate("/");
  }, [token]);

  return (
    <div>
      <h3>Recommendations</h3>
      {recs && (
        <>
          <p>
            Based on your favorite genre <b>{genre}</b>
          </p>
          <BookList books={recs.allBooks} />
        </>
      )}
    </div>
  );
};

export default Recommendations;
