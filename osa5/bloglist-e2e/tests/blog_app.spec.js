const { test, expect, beforeEach, describe } = require("@playwright/test");

const createBlog = async (page, { title, author, url }) => {
  await page.getByRole("link", { name: "create new blog" }).click();
  await page.getByRole("textbox", { name: "title" }).fill(title);
  await page.getByRole("textbox", { name: "author" }).fill(author);
  await page.getByRole("textbox", { name: "url" }).fill(url);
  await page.getByRole("button", { name: "create", exact: true }).click();

  await expect(page).toHaveURL("http://127.0.0.1:5173/");
  const blog = page
    .getByTestId("blog")
    .filter({ hasText: `${title} by ${author}` });
  await expect(blog).toBeVisible();
  return blog;
};

const openBlog = async (page, title, author) => {
  const blog = page
    .getByTestId("blog")
    .filter({ hasText: `${title} by ${author}` });
  await blog.getByRole("link", { name: `${title} by ${author}` }).click();
};

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://127.0.0.1:3003/api/testing/reset");
    await request.post("http://127.0.0.1:3003/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });
    await request.post("http://127.0.0.1:3003/api/users", {
      data: {
        name: "Arto Hellas",
        username: "hellas",
        password: "salainen",
      },
    });

    await page.goto("http://127.0.0.1:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await page.getByRole("link", { name: "login" }).click();

    await expect(page.getByRole("heading", { name: "Log in to application" })).toBeVisible();
    await expect(page.getByText("username")).toBeVisible();
    await expect(page.getByText("password")).toBeVisible();
    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
  });

  describe("Login", () => {
    beforeEach(async ({ page }) => {
      await page.goto("http://127.0.0.1:5173/login");
    });

    test("succeeds with correct credentials", async ({ page }) => {
      await page.locator('input[name="Username"]').fill("mluukkai");
      await page.locator('input[name="Password"]').fill("salainen");
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.locator('input[name="Username"]').fill("mluukkai");
      await page.locator('input[name="Password"]').fill("wrongpassword");
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("wrong username/password")).toBeVisible();
      await expect(page.getByText("Matti Luukkainen logged in")).not.toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await page.goto("http://127.0.0.1:5173/login");
      await page.locator('input[name="Username"]').fill("mluukkai");
      await page.locator('input[name="Password"]').fill("salainen");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
    });

    test("a new blog can be created", async ({ page }) => {
      const title = "Playwright creates a blog";

      await createBlog(page, {
        title,
        author: "Matti Luukkainen",
        url: "https://example.com/playwright",
      });
    });

    test("the create blog view can be opened from navigation", async ({ page }) => {
      await page.getByRole("link", { name: "create new blog" }).click();

      await expect(page).toHaveURL("http://127.0.0.1:5173/create");
      await expect(page.getByRole("heading", { name: "create new blog" })).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      const title = "Likeable blog";

      await createBlog(page, {
        title,
        author: "Matti Luukkainen",
        url: "https://example.com/likeable",
      });
      await openBlog(page, title, "Matti Luukkainen");
      await expect(page.getByText("likes 0")).toBeVisible();

      await page.getByRole("button", { name: "like" }).click();

      await expect(page.getByText("likes 1")).toBeVisible();
    });

    test("a logged out user cannot like a blog", async ({ page }) => {
      const title = "Anonymous cannot like";

      await createBlog(page, {
        title,
        author: "Matti Luukkainen",
        url: "https://example.com/no-anonymous-like",
      });
      await page.getByRole("button", { name: "logout" }).click();

      await openBlog(page, title, "Matti Luukkainen");

      await expect(page.getByText("likes 0")).toBeVisible();
      await expect(page.getByRole("button", { name: "like" })).not.toBeVisible();
    });

    test("the user who created a blog can delete it", async ({ page }) => {
      const title = "Removable blog";

      await createBlog(page, {
        title,
        author: "Matti Luukkainen",
        url: "https://example.com/removable",
      });
      await openBlog(page, title, "Matti Luukkainen");

      page.once("dialog", async (dialog) => {
        expect(dialog.message()).toContain(`Remove blog ${title} by Matti Luukkainen?`);
        await dialog.accept();
      });

      await page.getByRole("button", { name: "delete" }).click();

      await expect(page.getByTestId("blog").filter({ hasText: title })).not.toBeVisible();
    });

    test("only the user who created a blog can see its delete button", async ({ page }) => {
      const title = "Owner-only delete blog";

      await createBlog(page, {
        title,
        author: "Matti Luukkainen",
        url: "https://example.com/owner-only",
      });
      await openBlog(page, title, "Matti Luukkainen");
      await expect(page.getByRole("button", { name: "delete" })).toBeVisible();

      await page.getByRole("button", { name: "logout" }).click();
      await page.getByRole("link", { name: "login" }).click();
      await page.locator('input[name="Username"]').fill("hellas");
      await page.locator('input[name="Password"]').fill("salainen");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("Arto Hellas logged in")).toBeVisible();

      await openBlog(page, title, "Matti Luukkainen");
      await expect(page.getByRole("button", { name: "delete" })).not.toBeVisible();
    });

    test("blogs are ordered by likes with the most liked blog first", async ({ page }) => {
      const firstTitle = "React patterns";
      const secondTitle = "Testing routes";
      const thirdTitle = "Node middleware";

      await createBlog(page, {
        title: firstTitle,
        author: "Matti Luukkainen",
        url: "https://example.com/one-like",
      });
      await createBlog(page, {
        title: secondTitle,
        author: "Matti Luukkainen",
        url: "https://example.com/three-likes",
      });
      await createBlog(page, {
        title: thirdTitle,
        author: "Matti Luukkainen",
        url: "https://example.com/two-likes",
      });

      const likeBlog = async (title, times) => {
        await openBlog(page, title, "Matti Luukkainen");

        for (let i = 0; i < times; i += 1) {
          await page.getByRole("button", { name: "like" }).click();
          await expect(page.getByText(`likes ${i + 1}`)).toBeVisible();
        }

        await page.getByRole("link", { name: "blogs" }).click();
      };

      await likeBlog(firstTitle, 1);
      await likeBlog(secondTitle, 3);
      await likeBlog(thirdTitle, 2);

      await expect(page.getByTestId("blog").nth(0)).toContainText(secondTitle);
      await expect(page.getByTestId("blog").nth(1)).toContainText(thirdTitle);
      await expect(page.getByTestId("blog").nth(2)).toContainText(firstTitle);
    });
  });
});
