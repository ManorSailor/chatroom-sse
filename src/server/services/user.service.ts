import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

import { AuthError, NotFoundError } from "@/server/exceptions/exceptions";

import type { User } from "@/server/types/User";
import type { AuthToken, UserAuth } from "@/server/types/UserAuth";

// TODO: Use a proper database
const db = new Map<string, User>();

const { SECRET_KEY = "test-secret" } = process.env;
const A_DAY_IN_SECONDS = 24 * 60 * 60;

function register({ username, password }: UserAuth): User {
  if (db.has(username)) {
    throw new AuthError("This username is taken. Please choose another.");
  }

  const user: User = {
    id: randomUUID(),
    username,
    password: bcrypt.hashSync(password),
  };
  db.set(username, user);

  return user;
}

function login({ username, password }: UserAuth): AuthToken {
  const user = db.get(username);

  if (!user) {
    throw new NotFoundError(
      `${username} does not exist! Please register first.`
    );
  }

  const isPasswordSame = bcrypt.compareSync(password, user.password);

  if (!isPasswordSame) {
    throw new AuthError("Invalid password");
  }

  const token = jwt.sign({ id: user.id }, SECRET_KEY, {
    expiresIn: A_DAY_IN_SECONDS,
  });

  return {
    token: `Bearer ${token}`,
    expiresIn: A_DAY_IN_SECONDS,
  };
}

export { register, login };
