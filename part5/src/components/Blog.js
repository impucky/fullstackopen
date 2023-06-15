import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, updateLike, updateDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const handleLike = async () => {
    await blogService.like(blog.id, blog.likes);
    updateLike(blog.id);
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete blog "${blog.title}" ?`)) {
      await blogService.remove(blog.id);
      updateDelete(blog.id);
    }
  };

  return (
    <div className="blog">
      <header>
        <div>
          <h3>{blog.title} </h3>
          <i>
            {blog.author} {blog.likes}
          </i>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="togglebutton">
          {expanded ? "Show less" : "Show more"}
        </button>
      </header>
      {expanded && (
        <div>
          <p>
            <a href="#">{blog.url}</a>
          </p>
          <p>
            Likes: {blog.likes}{" "}
            <button onClick={handleLike} className="button green">
              +
            </button>
          </p>
          <p>Posted by: {blog.user.name}</p>
          <button onClick={handleDelete} className="button red">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Blog;
