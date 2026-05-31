const { test, expect, beforeEach, describe } = require("@playwright/test");

const createBlog = async (page, { title, author, url }) => {
  await page.getByRole("button", { name: "create new blog" }).click();
  await page.getByRole("textbox", { name: "title" }).fill(title);
  await page.getByRole("textbox", { name: "author" }).fill(author);
  await page.getByRole("textbox", { name: "url" }).fill(url);
  await page.getByRole("button", { name: "create", exact: true }).click();

  const blog = page
    .getByTestId("blog")
    .filter({ hasText: `${title} ${author}` });
  await expect(blog).toBeVisible();
  return blog;
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
    await expect(page.getByRole("heading", { name: "Log in to application" })).toBeVisible();
    await expect(page.getByText("username")).toBeVisible();
    await expect(page.getByText("password")).toBeVisible();
    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
  });

  describe("Login", () => {
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
      await page.locator('input[name="Username"]').fill("mluukkai");
      await page.locator('input[name="Password"]').fill("salainen");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
    });

    test("a new blog can be created", async ({ page }) => {
      const title = `Playwright creates a blog ${Date.now()}`;

      await createBlog(page, {
        title,
        author: "Matti Luukkainen",
        url: "https://example.com/playwright",
      });
    });

    test("a blog can be liked", async ({ page }) => {
      const title = `Likeable blog ${Date.now()}`;

      const blog = await createBlog(page, {
        title,
        author: "Matti Luukkainen",
        url: "https://example.com/likeable",
      });
      await blog.getByRole("button", { name: "view" }).click();
      await expect(blog.getByText("likes: 0")).toBeVisible();

      await blog.getByRole("button", { name: "like" }).click();

      await expect(blog.getByText("likes: 1")).toBeVisible();
    });

    test("the user who created a blog can delete it", async ({ page }) => {
      const title = `Removable blog ${Date.now()}`;

      const blog = await createBlog(page, {
        title,
        author: "Matti Luukkainen",
        url: "https://example.com/removable",
      });
      await blog.getByRole("button", { name: "view" }).click();

      page.once("dialog", async (dialog) => {
        expect(dialog.message()).toContain(`Remove blog ${title} by Matti Luukkainen?`);
        await dialog.accept();
      });

      await blog.getByRole("button", { name: "delete" }).click();

      await expect(blog).not.toBeVisible();
    });

    test("only the user who created a blog can see its delete button", async ({ page }) => {
      const title = `Owner-only delete blog ${Date.now()}`;

      const ownersBlog = await createBlog(page, {
        title,
        author: "Matti Luukkainen",
        url: "https://example.com/owner-only",
      });
      await ownersBlog.getByRole("button", { name: "view" }).click();
      await expect(ownersBlog.getByRole("button", { name: "delete" })).toBeVisible();

      await page.getByRole("button", { name: "logout" }).click();
      await page.locator('input[name="Username"]').fill("hellas");
      await page.locator('input[name="Password"]').fill("salainen");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("Arto Hellas logged in")).toBeVisible();

      const otherUsersBlog = page
        .getByTestId("blog")
        .filter({ hasText: `${title} Matti Luukkainen` });
      await expect(otherUsersBlog.getByRole("button", { name: "delete" })).not.toBeVisible();
    });

    test("blogs are ordered by likes with the most liked blog first", async ({ page }) => {
      const timestamp = Date.now();
      const firstTitle = `One like blog ${timestamp}`;
      const secondTitle = `Three likes blog ${timestamp}`;
      const thirdTitle = `Two likes blog ${timestamp}`;

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
        const blog = page
          .getByTestId("blog")
          .filter({ hasText: `${title} Matti Luukkainen` });
        await blog.getByRole("button", { name: "view" }).click();

        for (let i = 0; i < times; i += 1) {
          await blog.getByRole("button", { name: "like" }).click();
          await expect(blog.getByText(`likes: ${i + 1}`)).toBeVisible();
        }
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
