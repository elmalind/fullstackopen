import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import Blog from "./Blog";

describe("Blog component", () => {
  it("renders title and author as a link to the blog view", () => {
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

    render(
      <MemoryRouter>
        <Blog blog={blog} />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", {
      name: "Test Blog Title by Test Author",
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/blogs/1");
  });

  it("does not render blog details in the list", () => {
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

    render(
      <MemoryRouter>
        <Blog blog={blog} />
      </MemoryRouter>,
    );

    expect(screen.queryByText(/https:\/\/example.com/)).not.toBeInTheDocument();
    expect(screen.queryByText(/likes/)).not.toBeInTheDocument();
    expect(screen.queryByText(/added by John Doe/)).not.toBeInTheDocument();
  });
});
