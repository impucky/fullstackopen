const {
  totalLikes,
  favoriteBlog,
  mostLikes,
  mostBlogs,
  manyBlogs,
  singleBlog,
} = require("./helpers");

describe("Total Likes", () => {
  test("when list has only one blog, equals the likes of that", () => {
    const result = totalLikes(singleBlog);
    expect(result).toBe(5);
  });

  test("when list has several blogs, equals the sum of all likes", () => {
    const result = totalLikes(manyBlogs);
    expect(result).toBe(36);
  });

  test("when list is empty, equals 0", () => {
    expect(totalLikes([])).toBe(0);
  });
});

describe("Most liked blog", () => {
  test("when list has only one blog, return that blog", () => {
    const result = favoriteBlog(singleBlog);
    expect(result).toEqual({
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 5,
    });
  });

  test("when list has several blogs, return blog with the most likes", () => {
    const result = favoriteBlog(manyBlogs);
    expect(result).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});

describe("Author with the most blogs", () => {
  test("when list has only one blog, return that blog's author", () => {
    const result = mostBlogs(singleBlog);
    expect(result).toEqual({
      author: "Edsger W. Dijkstra",
      blogs: 1,
    });
  });

  test("when list has several blogs, return author with the most blogs", () => {
    const result = mostBlogs(manyBlogs);
    expect(result).toEqual({
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
});

describe("Author with the most likes", () => {
  test("when list has only one blog, return that blog's author", () => {
    const result = mostLikes(singleBlog);
    expect(result).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 5,
    });
  });

  test("when list has several blogs, return author with the most total likes", () => {
    const result = mostLikes(manyBlogs);
    expect(result).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
