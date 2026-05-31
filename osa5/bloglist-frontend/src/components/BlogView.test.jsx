import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";
import BlogView from "./BlogView";

vi.mock("../services/blogs", () => ({
  default: {
    update: vi.fn(),
  },
}));

const blog = {
  id: "blog1",
  title: "Component testing",
  author: "Ada Lovelace",
  url: "https://example.com/component-testing",
  likes: 7,
  user: {
    id: "user1",
    username: "ada",
    name: "Ada Lovelace",
  },
};

const renderBlogView = (user) => {
  render(
    <MemoryRouter initialEntries={["/blogs/blog1"]}>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <BlogView
              blogs={[blog]}
              user={user}
              onUpdate={vi.fn()}
              onRemove={vi.fn()}
            />
          }
        />
      </Routes>
    </MemoryRouter>,
  );
};

describe("BlogView component", () => {
  it("shows blog details and likes to a logged out user, but no buttons", () => {
    renderBlogView(null);

    expect(
      screen.getByRole("heading", {
        name: "Component testing by Ada Lovelace",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("https://example.com/component-testing")).toBeInTheDocument();
    expect(screen.getByText(/likes 7/)).toBeInTheDocument();
    expect(screen.getByText("added by Ada Lovelace")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("shows only the like button to a logged in user who did not create the blog", () => {
    renderBlogView({
      id: "user2",
      username: "grace",
      name: "Grace Hopper",
    });

    expect(screen.getByRole("button", { name: "like" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "delete" })).not.toBeInTheDocument();
  });

  it("shows the delete button to the blog creator", () => {
    renderBlogView({
      id: "user1",
      username: "ada",
      name: "Ada Lovelace",
    });

    expect(screen.getByRole("button", { name: "like" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "delete" })).toBeInTheDocument();
  });
});
