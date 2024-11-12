import express from "express";

import * as UserService from "./services/user.service";
import * as ChatroomService from "./services/chatroom.service";
import * as MessageStream from "./services/messageStream.service";

import { requireAuth } from "./middlewares/requireAuth";
import { AuthError, NotFoundError } from "./exceptions/exceptions";

import type { UUID } from "crypto";
import type { UserAuth } from "./types/UserAuth";
import type { Message } from "./types/Message";

const app = express();

app.use(express.json());

app.get("/", requireAuth, (_, res) => {
  res.status(200).send({
    message: "You've successfully authenticated.",
  });
});

app.post("/register", (req, res) => {
  const userInfo: UserAuth = req.body;

  try {
    const user = UserService.register(userInfo);
    res.status(201).send({
      message: `Welcome aboard, ${user.username}!`,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(409).send({ message: error.message });
    }
  }
});

app.post("/login", (req, res) => {
  const userInfo: UserAuth = req.body;

  try {
    const authToken = UserService.login(userInfo);
    res.status(200).send(authToken);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).send({ message: error.message });
    } else if (error instanceof AuthError) {
      res.status(403).send({ message: error.message });
    }
  }
});

app.post("/rooms/:roomId/messages", requireAuth, (req, res) => {
  const { roomId } = req.params;
  const message: Message = req.body;

  const msg = ChatroomService.receiveMessage(roomId, message);
  MessageStream.broadcast(roomId as UUID, msg);

  res.status(201).send({
    message: "Message sent successfully.",
  });
});

app.get("/rooms/:roomId/stream", requireAuth, (req, res) => {
  const { roomId } = req.params;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Cache-Control", "no-cache");
  res.flushHeaders();

  const unsubscribe = MessageStream.subscribe(roomId as UUID, (msg, event) =>
    res.write(`id: ${msg.id}\nevent: ${event}\ndata: ${msg.content}\n\n`)
  );

  res.on("close", () => {
    unsubscribe();
    res.end();
  });
});

export default app;
