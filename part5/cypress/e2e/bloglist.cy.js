describe("Blog app", () => {
  beforeEach(() => {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    cy.request("POST", "http://localhost:3003/api/users/", {
      name: "Raphael Pucky",
      username: "pucky",
      password: "secret",
    });
  });

  it("Login form is shown", () => {
    cy.visit("http://localhost:3000");
    cy.get(".login");
  });

  describe("Login", () => {
    it("Succeeds with correct credentials", () => {
      cy.login({ username: "pucky", password: "secret" });
      cy.contains("Logged in as pucky");
    });

    it("Fails with wrong credentials", () => {
      cy.login({ username: "pucky", password: "1234" });
      cy.contains("Logged in").should("not.exist");
      cy.getAllLocalStorage().then((result) => {
        cy.wrap(result).should("be.empty");
      });
    });
  });

  describe("When logged in", () => {
    beforeEach(() => {
      cy.login({ username: "pucky", password: "secret" });
    });

    it("A blog can be created", () => {
      cy.contains("Create").click();
      cy.get("#newblog-title").type("cool title");
      cy.get("#newblog-author").type("author");
      cy.get("#newblog-url").type("url");
      cy.get(".button.green").click();
      cy.contains("Created blog");
      cy.get(".blog").first().contains("cool title");
    });

    it("A blog can be liked", () => {
      cy.createBlog({ title: "cool title", author: "pucky", url: "url" });
      cy.get(".togglebutton").click();
      cy.contains("Likes: 0");
      cy.get(".button.green:last").click();
      cy.contains("Likes: 1");
    });

    it("A blog can be deleted", () => {
      cy.createBlog({ title: "cool title", author: "pucky", url: "url" });
      cy.get(".togglebutton").click();
      cy.get(".button.red:last").click();
      cy.on("window:confirm", () => true).then(() => {
        cy.get(".blog").should("not.exist");
      });
    });

    it("Only blog's creator can see delete button", () => {
      // create second user
      cy.request("POST", "http://localhost:3003/api/users/", {
        name: "Paphael Rucky",
        username: "ykcup",
        password: "terces",
      });
      cy.createBlog({ title: "cool title", author: "pucky", url: "url" });
      cy.get(".togglebutton").click();
      cy.contains("Delete");
      cy.get(".button.red:last");
      cy.clearLocalStorage();
      cy.login({ username: "ykcup", password: "terces" });
      cy.get(".togglebutton").click();
      cy.get(".button.red:last");
      cy.contains("Delete").should("not.exist");
    });

    it.only("Blogs are sorted by total likes", () => {
      cy.createBlog({ title: "first blog", author: "pucky", url: "url" });
      cy.createBlog({ title: "second blog", author: "pucky", url: "url" });
      cy.get(".blog").eq(0).should("contain", "first blog");
      cy.get(".togglebutton").eq(1).click();
      cy.get(".button.green:last").click();
      cy.get(".blog").eq(0).should("contain", "second blog");
    });
  });
});
