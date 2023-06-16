import { useState } from "react";

const NewBlogForm = ({ handleCreate }) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreate({ title, author, url });
    toggleForm("");
  };

  const toggleForm = () => {
    setVisible(!visible);
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return visible ? (
    <>
      <h2>New blog</h2>
      <form onSubmit={handleSubmit} className="addblog">
        <div>
          <p>Title</p>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <p>Author</p>
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        </div>
        <div>
          <p>URL</p>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} required />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={toggleForm} className="button red">
            Cancel
          </button>
          <button type="submit" className="button green">
            Create
          </button>
        </div>
      </form>
    </>
  ) : (
    <div className="addblog">
      <button onClick={toggleForm} className="button green">
        Create a new entry
      </button>
    </div>
  );
};

export default NewBlogForm;
