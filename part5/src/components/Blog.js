import { useState } from "react";

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="blog">
      <header>
        <div>
          <h3>{blog.title} </h3>
          <i>{blog.author}</i>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="togglebutton">
          {expanded ? "Show less" : "Show more"}
        </button>
      </header>
      {expanded && (
        <div className="blog-details">
          <p>
            <a href="#">{blog.url}</a>
          </p>
          <p>
            Likes: {blog.likes}{" "}
            <button onClick={() => handleLike(blog.id, blog.likes)} className="button green">
              +
            </button>
          </p>
          <p>Posted by: {blog.user.name}</p>
          {blog.user.username === user.username && (
            <button onClick={() => handleDelete(blog.id, blog.title)} className="button red">
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
