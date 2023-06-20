import { useQueryClient, useMutation } from "react-query";
import { useNotify } from "../context/NotificationContext";
import blogService from "../services/blogs";

const Blog = ({ blog, user }) => {
  const notifyWith = useNotify();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: blogService.like,
    onSuccess: (likedBlog) => {
      queryClient.setQueryData("blogs", (blogs) => {
        return blogs.map((blog) =>
          blog.id === likedBlog.id ? { ...blog, likes: likedBlog.likes } : blog
        );
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (deletedBlog) => {
      notifyWith([`Deleted blog "${deletedBlog.title}"`, "error"]);
      queryClient.setQueryData("blogs", (blogs) => {
        const deletedIndex = blogs.findIndex((blog) => blog.id === deletedBlog.id);
        blogs.splice(deletedIndex, 1);
        return blogs;
      });
    },
  });

  if (!blog) return null;

  return (
    <>
      <h3>
        {blog.title} - <i>{blog.author}</i>
      </h3>
      <div className="blog">
        <p>
          <a href="#">{blog.url}</a>
        </p>
        <p>
          Likes: {blog.likes}{" "}
          <button onClick={() => likeMutation.mutate(blog)} className="button green">
            +
          </button>
        </p>
        <p>Posted by: {blog.user.name}</p>
        {blog.user.username === user.username && (
          <button onClick={() => deleteMutation.mutate(blog)} className="button red">
            Delete
          </button>
        )}
      </div>
    </>
  );
};

export default Blog;
