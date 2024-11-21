const request = require("supertest");
const express = require("express");
const { router: userRoutes, users } = require("./../src/user");

const app = express();
app.use(express.json());
app.use("/api", userRoutes);

describe("Users API Tests", () => {
  let userId;

  test("Create User - Success", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({ name: "abc", email: "abc@example.com" });

    expect(response.status).toBe(201);
    expect(response.body.userId).toBeDefined();
    userId = response.body.userId;
  });

  test("Get User - Success", async () => {
    const response = await request(app).get(`/api/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("abc");
  });

  test("Get User - Not Found", async () => {
    const response = await request(app).get("/api/users/999");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });
});
