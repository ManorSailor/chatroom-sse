import express from "express";
import ViteExpress from "vite-express";
import bcrypt from "bcryptjs";

import type { UserAuth } from "./types/UserAuth";
import type { User } from "./types/User";

const app = express();

app.use(express.json());

const userDb = new Map<string, User>();

app.post("/register", (req, res) => {
  const { username, password }: UserAuth = req.body;

  if (userDb.has(username)) {
    res.status(409).send({
      message: "This username is taken. Please choose another.",
    });
  }

  userDb.set(username, { username, password: bcrypt.hashSync(password) });

  res.status(201).send({
    message: `Welcome aboard, ${username}!`,
  });
});

app.post("/login", (req, res) => {
  const { username, password }: UserAuth = req.body;
  const user = userDb.get(username);

  if (!user) {
    res.status(400).send({
      message: `${username} does not exist! Please register first.`,
    });
  }

  const isPasswordSame = bcrypt.compareSync(password, user?.password ?? "");

  if (!isPasswordSame) {
    res.status(403).send({
      message: "Invalid password",
    });
  }

  res.status(200).send({
    token: "",
  });
});

export default ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
