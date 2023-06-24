import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useSubscription } from "@apollo/client";
import { BOOK_ADDED } from "./queries";

import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommendations from "./components/Recommendations";

const App = () => {
  const [token, setToken] = useState(null);

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      alert(`New book added: ${data.data.bookAdded.title}`);
    },
  });

  useEffect(() => {
    const loggedUser = localStorage.getItem("library-user-token");
    if (loggedUser) setToken(loggedUser);
  }, []);

  return (
    <main>
      <nav style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <Link to="/">authors </Link> <Link to="/books">| books </Link>
          {token && <Link to="/add">| add book </Link>}
          {token && <Link to="/recommend">| recommend</Link>}
        </div>
        <LoginForm token={token} setToken={setToken} />
      </nav>

      <Routes>
        <Route path="/" element={<Authors token={token} />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add" element={<NewBook token={token} />} />
        <Route path="/recommend" element={<Recommendations token={token} />} />
      </Routes>
    </main>
  );
};

export default App;
