import { describe, expect, it } from "vitest";

import { superFetch } from "./helpers/utils";
import type { AuthToken, UserAuth } from "@/server/types/UserAuth";

const fetch = superFetch;

describe("User Auth:", () => {
  const user: UserAuth = { username: "Sars", password: "pass" };

  it("should register a user", async () => {
    await fetch("/register", {
      method: "post",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" },
    })
      .expectStatus(201)
      .expectBody({ message: `Welcome aboard, ${user.username}!` });
  });

  it("should not register a user with an existing username", async () => {
    await fetch("/register", {
      method: "post",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" },
    })
      .expectStatus(409)
      .expectBody({
        message: "This username is taken. Please choose another.",
      });
  });

  it("should login an existing user", async () => {
    const data = await fetch("/login", {
      method: "post",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" },
    })
      .expectStatus(200)
      .json();

    expect(data).toEqual({
      token: expect.any(String),
      expiresIn: expect.any(Number),
    });

    expect(data.token.length).toBeGreaterThan(0);
  });

  it("should not login a non-existing user", async () => {
    const nonExistentUser: UserAuth = { ...user, username: "DoesNotExist" };

    await fetch("/login", {
      method: "post",
      body: JSON.stringify(nonExistentUser),
      headers: { "Content-Type": "application/json" },
    })
      .expectStatus(404)
      .expectBody({
        message: `${nonExistentUser.username} does not exist! Please register first.`,
      });
  });

  it("should not login when password is invalid", async () => {
    await fetch("/login", {
      method: "post",
      body: JSON.stringify({ ...user, password: "Wrong" }),
      headers: { "Content-Type": "application/json" },
    })
      .expectStatus(403)
      .expectBody({
        message: "Invalid password",
      });
  });

  it("should allow an authenticated user to access protected resource", async () => {
    const token: AuthToken = await (
      await fetch("/login", {
        method: "post",
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json" },
      })
    ).json();

    await fetch("/", {
      headers: {
        Authorization: token.token,
      },
    })
      .expectStatus(200)
      .expectBody({ message: "You've successfully authenticated." });
  });

  it("should not allow an unauthenticated user to access protected resource", async () => {
    await fetch("/")
      .expectStatus(403)
      .expectBody({ message: "Unauthorized user. Access denied." });
  });
});
