const request = require("supertest");
const express = require("express");
const { router: userRoutes, users } = require("./../src/user");
const quizRoutes = require("./../src/quiz");

const app = express();
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", quizRoutes);

describe("Integration Tests", () => {
  let userId, quizId;

  beforeEach(() => {
    Object.keys(users).forEach((key) => delete users[key]); // Reset users
  });

  test("Complete Workflow - Create User, Quiz, and Submit Answer", async () => {
    // Step 1: Create a User
    const userResponse = await request(app)
      .post("/api/users")
      .send({ name: "abc", email: "abc@example.com" });

    expect(userResponse.status).toBe(201);
    userId = userResponse.body.userId;

    // Step 2: Create a Quiz
    const quizResponse = await request(app)
      .post("/api/quizzes")
      .send({
        title: "Science Quiz",
        questions: [
          {
            text: "What is H2O?",
            options: ["Oxygen", "Hydrogen", "Water", "Carbon"],
            correct_option: 3,
          },
        ],
      });

    expect(quizResponse.status).toBe(201);
    quizId = quizResponse.body.quizId;

    // Step 3: Submit Answer
    const answerResponse = await request(app)
      .post(`/api/quizzes/${quizId}/questions/1/answer`)
      .send({ selected_option: 3, user_id: userId });

    expect(answerResponse.status).toBe(200);
    expect(answerResponse.body.is_correct).toBe(true);

    // Step 4: Get User Results
    const resultsResponse = await request(app).get(
      `/api/quizzes/${quizId}/users/${userId}/results`
    );
    expect(resultsResponse.status).toBe(200);
    expect(resultsResponse.body.score).toBe(1);
  });
});
