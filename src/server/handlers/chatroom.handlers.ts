import * as ChatroomService from "@/server/services/chatroom.services";
import * as MessageStream from "@/server/services/messageStream.services";

import type { UUID } from "crypto";
import type { Request, Response } from "express";
import type { Message } from "@/server/types/Message";

function sendMessageHandler(req: Request, res: Response) {
  const { roomId } = req.params;
  const message: Message = req.body;

  const msg = ChatroomService.receiveMessage(roomId, message);
  MessageStream.broadcast(roomId as UUID, msg);

  res.status(201).send({
    message: "Message sent successfully.",
  });
}

function messageStreamHandler(req: Request, res: Response) {
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
}

export { sendMessageHandler, messageStreamHandler };
