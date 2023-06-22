import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";

const App = () => {
  return (
    <main>
      <nav>
        <Link to="/"> authors </Link>
        <Link to="/books">books </Link>
        <Link to="/add"> add book</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add" element={<NewBook />} />
      </Routes>
    </main>
  );
};

export default App;
