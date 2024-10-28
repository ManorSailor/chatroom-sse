import express from "express";

import * as UserService from "./services/user";
import { AuthError, NotFoundError } from "./exceptions/exceptions";

import type { UserAuth } from "./types/UserAuth";

const app = express();

app.use(express.json());

app.post("/register", (req, res) => {
  const user: UserAuth = req.body;

  try {
    UserService.register(user);
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(409).send({ message: error.message });
    }
  }

  res.status(201).send({
    message: `Welcome aboard, ${user.username}!`,
  });
});

app.post("/login", (req, res) => {
  const user: UserAuth = req.body;

  try {
    const authToken = UserService.login(user);
    res.status(200).send(authToken);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).send({ message: error.message });
    } else if (error instanceof AuthError) {
      res.status(403).send({ message: error.message });
    }
  }
});

export default app;
