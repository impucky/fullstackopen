import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

const blog = {
  title: "Title",
  author: "puck",
  url: "abc.xyz",
  likes: 0,
  user: {
    name: "puck",
  },
};

test("initially renders title and author but not extra info", () => {
  const { container } = render(<Blog blog={blog} />);

  const details = container.querySelector(".blog-details");
  expect(details).toBeNull();
});

test('clicking "show more" displays the blog details', async () => {
  const { container } = render(<Blog blog={blog} />);

  const user = userEvent.setup();
  const button = screen.getByText("Show more");
  await user.click(button);

  const details = container.querySelector(".blog-details");
  expect(details).toHaveTextContent("abc.xyz");
  expect(details).toHaveTextContent("Likes");
});

test('Clicking like twice will call "updateLike" twice', async () => {
  const mockHandler = jest.fn();

  render(<Blog blog={blog} handleLike={mockHandler} />);

  const user = userEvent.setup();
  const button = screen.getByText("Show more");
  await user.click(button);

  const likeButton = screen.getByText("+");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
