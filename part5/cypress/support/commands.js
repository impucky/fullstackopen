Cypress.Commands.add("login", ({ username, password }) => {
  cy.request({
    method: "POST",
    url: "http://localhost:3003/api/login",
    failOnStatusCode: false,
    body: {
      username,
      password,
    },
  }).then((response) => {
    if (response.status === 200) {
      localStorage.setItem("blogListUser", JSON.stringify(response.body));
    }
    cy.visit("http://localhost:3000");
  });
});

Cypress.Commands.add("createBlog", (blog) => {
  cy.request({
    method: "POST",
    url: "http://localhost:3003/api/blogs",
    body: blog,
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("blogListUser")).token}`,
    },
  });
  cy.visit("http://localhost:3000");
});
