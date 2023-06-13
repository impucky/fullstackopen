const totalLikes = (blogs) => {
  return blogs.reduce((a, b) => {
    return a + b.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  const { title, author, likes } = blogs.reduce((a, b) => (a.likes > b.likes ? a : b));
  return { title, author, likes };
};

const mostBlogs = (blogs) => {
  const tally = blogs.reduce((sum, blog) => {
    sum[blog.author] = (sum[blog.author] || 0) + 1;
    return sum;
  }, {});
  const max = maxKey(tally);
  return { author: max, blogs: tally[max] };
};

const mostLikes = (blogs) => {
  const tally = blogs.reduce((sum, blog) => {
    sum[blog.author] = (sum[blog.author] || 0) + blog.likes;
    return sum;
  }, {});
  const max = maxKey(tally);
  return { author: max, likes: tally[max] };
};

const maxKey = (obj) => {
  return Object.keys(obj).reduce((curr, next) => (obj[curr] > obj[next] ? curr : next));
};

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
