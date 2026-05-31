import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";
import BlogForm from "./BlogForm";

describe("BlogForm component", () => {
  it("calls the event handler with the right details when a new blog is created", async () => {
    const onAddBlog = vi.fn();
    const onCancel = vi.fn();
    const testUser = userEvent.setup();

    render(<BlogForm onAddBlog={onAddBlog} onCancel={onCancel} />);

    await testUser.type(screen.getByRole("textbox", { name: /title/i }), "A new blog");
    await testUser.type(screen.getByRole("textbox", { name: /author/i }), "Ada Lovelace");
    await testUser.type(
      screen.getByRole("textbox", { name: /url/i }),
      "https://example.com/new-blog",
    );
    await testUser.click(screen.getByRole("button", { name: /create/i }));

    expect(onAddBlog).toHaveBeenCalledTimes(1);
    expect(onAddBlog).toHaveBeenCalledWith({
      title: "A new blog",
      author: "Ada Lovelace",
      url: "https://example.com/new-blog",
    });
  });
});
