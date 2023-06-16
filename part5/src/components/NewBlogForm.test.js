import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewBlogForm from "./NewBlogForm";

test('Submitting a new blog calls "createBlog" with the right contents', async () => {
  const mockHandler = jest.fn();

  render(<NewBlogForm handleCreate={mockHandler} />);

  const user = userEvent.setup();

  const toggleButton = screen.getByText("Create a new entry");
  await user.click(toggleButton);

  const inputs = screen.getAllByRole("textbox");

  await user.type(inputs[0], "title");
  await user.type(inputs[1], "author");
  await user.type(inputs[2], "url");

  const submitButton = screen.getByText("Create");
  await user.click(submitButton);

  expect(mockHandler.mock.calls).toHaveLength(1);
  expect(mockHandler.mock.calls[0][0]).toEqual({ title: "title", author: "author", url: "url" });
});
