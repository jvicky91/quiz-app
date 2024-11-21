const request = require("supertest");
const express = require("express");
const quizRoutes = require("./../src/quiz");

const app = express();
app.use(express.json());
app.use("/api", quizRoutes);

describe("Quiz API Tests", () => {
  test("Create Quiz - Success", async () => {
    const response = await request(app)
      .post("/api/quizzes")
      .send({
        title: "Math Quiz",
        questions: [
          { text: "2 + 2?", options: [2, 3, 4, 5], correct_option: 2 },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body.quizId).toBeDefined();
  });

  test("Get Quiz - Success", async () => {
    const response = await request(app).get("/api/quizzes/1");
    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Math Quiz");
    expect(response.body.questions[0].correct_option).toBeUndefined();
  });
});
