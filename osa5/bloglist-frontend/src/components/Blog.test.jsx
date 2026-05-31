import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import blogService from "../services/blogs";
import Blog from "./Blog";

vi.mock("../services/blogs", () => ({
  default: {
    update: vi.fn(),
  },
}));

describe("Blog component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders title and author by default", () => {
    const blog = {
      id: "1",
      title: "Test Blog Title",
      author: "Test Author",
      url: "https://example.com",
      likes: 5,
      user: {
        id: "user1",
        name: "John Doe",
      },
    };

    const user = {
      id: "user2",
      name: "Current User",
    };

    const mockOnUpdate = () => {};
    const mockOnRemove = () => {};
    render(
      <Blog
        blog={blog}
        user={user}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
      />,
    );

    // Check that title and author are rendered
    expect(screen.getByText(/Test Blog Title/)).toBeInTheDocument();
    expect(screen.getByText(/Test Author/)).toBeInTheDocument();
  });

  it("does not render url and likes by default", () => {
    const blog = {
      id: "1",
      title: "Test Blog Title",
      author: "Test Author",
      url: "https://example.com",
      likes: 5,
      user: {
        id: "user1",
        name: "John Doe",
      },
    };

    const user = {
      id: "user2",
      name: "Current User",
    };

    const mockOnUpdate = () => {};
    const mockOnRemove = () => {};
    render(
      <Blog
        blog={blog}
        user={user}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
      />,
    );

    // Check that url is not rendered
    expect(screen.queryByText(/https:\/\/example.com/)).not.toBeInTheDocument();

    // Check that likes count is not rendered
    expect(screen.queryByText(/likes:/)).not.toBeInTheDocument();
  });

  it("renders url, likes, and user when view button is clicked", async () => {
    const blog = {
      id: "1",
      title: "Test Blog Title",
      author: "Test Author",
      url: "https://example.com",
      likes: 5,
      user: {
        id: "user1",
        name: "John Doe",
      },
    };

    const user = {
      id: "user2",
      name: "Current User",
    };

    const mockOnUpdate = () => {};
    const mockOnRemove = () => {};
    render(
      <Blog
        blog={blog}
        user={user}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
      />,
    );

    // Find and click the view button
    const viewButton = screen.getByRole("button", { name: /view/ });
    await userEvent.click(viewButton);

    // Check that url is now rendered
    expect(screen.getByText(/https:\/\/example.com/)).toBeInTheDocument();

    // Check that likes count is now rendered
    expect(screen.getByText(/likes: 5/)).toBeInTheDocument();

    // Check that user name is now rendered
    expect(screen.getByText("added by John Doe")).toBeInTheDocument();
  });

  it("calls the event handler twice when like button is clicked twice", async () => {
    const blog = {
      id: "1",
      title: "Test Blog Title",
      author: "Test Author",
      url: "https://example.com",
      likes: 5,
      user: {
        id: "user1",
        name: "John Doe",
      },
    };

    const user = {
      id: "user2",
      name: "Current User",
    };

    blogService.update.mockResolvedValue(blog);

    const mockOnUpdate = vi.fn();
    const mockOnRemove = () => {};
    render(
      <Blog
        blog={blog}
        user={user}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
      />,
    );

    const testUser = userEvent.setup();
    await testUser.click(screen.getByRole("button", { name: /view/ }));

    const likeButton = screen.getByRole("button", { name: /like/ });
    await testUser.click(likeButton);
    await testUser.click(likeButton);

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledTimes(2);
    });
  });
});
