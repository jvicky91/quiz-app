# Quiz API

A RESTful API for managing quizzes, users, and tracking user-specific quiz results.

## Features

- Create users and quizzes.
- Fetch quizzes without revealing answers.
- Submit answers.
- Retrieve quiz results linked to specific users.

---

## Setup and Run

### Prerequisites

- Docker and Docker Compose installed.

### Steps to Run

1. Clone this repository:

   ```bash
   git clone https://github.com/jvicky91/quiz-app.git
   cd quiz-app
   ```

2. Build and run the service:

   ```bash
   docker-compose up --build
   ```

3. Access the service at http://localhost:3000.

## Run Tests

### Steps to Run

```bash
npm test
```

## Known Issues or Limitations

- In-Memory Database: Data resets on server restart.
- No Authentication: APIs assume valid user IDs.
- Data Load: No pagination for large datasets.

## Postman Collection with environment file included in codebase
