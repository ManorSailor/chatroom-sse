import { randomUUID } from "crypto";
import type { Message, MessageModel } from "@/server/types/Message";

const msgs: MessageModel[] = [];

function addMessage(msg: Message): MessageModel {
  const message: MessageModel = {
    ...msg,
    id: randomUUID(),
    sentAt: new Date(),
  };

  msgs.push(message);

  return message;
}

export { addMessage };
