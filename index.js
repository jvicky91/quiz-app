const express = require("express");
const bodyParser = require("body-parser");
const quizRoutes = require("./src/quiz");
const { router: userRoutes } = require("./src/user");

const app = express();
app.use(bodyParser.json());

// Routes
app.use("/api", quizRoutes);
app.use("/api", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
