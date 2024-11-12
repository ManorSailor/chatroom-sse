import { randomUUID } from "crypto";
import { describe, it, beforeAll, expect } from "vitest";

import { superFetch } from "./helpers/utils";

import type { Message } from "@/server/types/Message";
import type { AuthToken, UserAuth } from "@/server/types/UserAuth";

const fetch = superFetch;

describe("Chatroom:", () => {
  const defaultRoomId = "9b63be88-6c71-46e8-a914-5e9c6e82e582";
  const user: UserAuth = { username: "Sars", password: "pass" };
  const msg: Message = {
    roomId: defaultRoomId,
    authorId: randomUUID(),
    content: "Hello!",
  };
  let authToken: AuthToken;

  beforeAll(async () => {
    await fetch("/register", {
      method: "post",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" },
    });

    authToken = await (
      await fetch("/login", {
        method: "post",
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json" },
      })
    ).json();
  });

  it.skip("should let an authenticated user join a room");
  it.skip("should let an authenticated user join a room");

  it("should let a group member send a message", async () => {
    await fetch(`/rooms/${defaultRoomId}/messages`, {
      method: "post",
      body: JSON.stringify(msg),
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken.token,
      },
    })
      .expectStatus(201)
      .expectBody({ message: "Message sent successfully." });
  });

  it("should let group members receive messages", async () => {
    const response = await fetch(`/rooms/${defaultRoomId}/stream`, {
      method: "GET",
      headers: { Authorization: authToken.token },
    });

    await fetch(`/rooms/${defaultRoomId}/messages`, {
      method: "post",
      body: JSON.stringify(msg),
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken.token,
      },
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    expect(reader).toBeDefined();

    const { value } = await reader!.read();
    const receivedMsg = decoder.decode(value).split("\n").toString();

    expect(receivedMsg).toMatch("data: Hello!");
  });
});
