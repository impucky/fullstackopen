import { useState, useEffect } from "react";
import "./index.css";

import Blog from "./components/Blog";
import UserPanel from "./components/UserPanel";
import NewBlogForm from "./components/NewBlogForm";
import Message from "./components/Message";

import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({
    content: "",
    type: "",
  });

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs.sort((a, b) => a.likes < b.likes)));
  }, []);

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("blogListUser");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setUser(user);
      loginService.setToken(user.token);
    }
  }, []);

  const showMessage = (content, type) => {
    setMessage({ content, type });
    setTimeout(() => {
      setMessage({ content, type: "" });
    }, 3000);
  };

  const handleCreate = async (blog) => {
    const createdBlog = await blogService.createNew(blog);
    setBlogs(blogs.concat(createdBlog));
    showMessage(`Created blog "${createdBlog.title}"`, "success");
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete blog "${title}" ?`)) {
      await blogService.remove(id);
      const updatedBlogs = [...blogs];
      const deletedIndex = updatedBlogs.findIndex((blog) => blog.id === id);
      updatedBlogs.splice(deletedIndex, 1);
      setBlogs(updatedBlogs);
    } else return;
  };

  const handleLike = async (id, likes) => {
    await blogService.like(id, likes);
    const updatedBlogs = blogs
      .map((blog) => {
        if (blog.id === id) return { ...blog, likes: likes + 1 };
        else return blog;
      })
      .sort((a, b) => {
        return a.likes < b.likes ? 1 : -1;
      });
    setBlogs(updatedBlogs);
  };

  return (
    <>
      <Message {...message} />
      <UserPanel setUser={setUser} showMessage={showMessage} user={user} />
      <main>
        {user && <NewBlogForm handleCreate={handleCreate} />}
        <h1>Blogs</h1>
        {user &&
          blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              handleLike={handleLike}
              handleDelete={handleDelete}
              user={user}
            />
          ))}
      </main>
    </>
  );
};

export default App;
