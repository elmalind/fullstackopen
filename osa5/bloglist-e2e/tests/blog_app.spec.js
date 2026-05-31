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
  });
});
