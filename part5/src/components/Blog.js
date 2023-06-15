import { useState } from "react";

const Blog = ({ blog }) => {
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
        <div>
          <p>
            <a href="">{blog.url}</a>
          </p>
          <p>
            Likes: {blog.likes}
            <button className="button green">+</button>
          </p>
          <p>Posted by: {blog.user.name}</p>
        </div>
      )}
    </div>
  );
};

export default Blog;
