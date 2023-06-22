import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ALL_AUTHORS, UPDATE_YEAR } from "../queries";

const Authors = () => {
  const authors = useQuery(ALL_AUTHORS);
  const [authorToUpdate, setAuthorToUpdate] = useState("");

  if (authors.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born || <button onClick={() => setAuthorToUpdate(a.name)}>SET</button>}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <UpdateAuthor author={authorToUpdate} setAuthor={setAuthorToUpdate} />
    </div>
  );
};

const UpdateAuthor = ({ author, setAuthor }) => {
  const [year, setYear] = useState("");

  const [updateYear] = useMutation(UPDATE_YEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateYear({ variables: { name: author, born: Number(year) } });
    resetForm();
  };

  const resetForm = () => {
    setYear("");
    setAuthor("");
  };

  if (!author) return null;

  return (
    <>
      <h3>
        set birth year for <i>{author}</i>
      </h3>
      <form onSubmit={handleSubmit}>
        <input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
        <button>SET</button>
      </form>
      <button onClick={resetForm}>CANCEL</button>
    </>
  );
};

export default Authors;
