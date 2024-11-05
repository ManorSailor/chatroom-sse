import { randomUUID } from "crypto";
import type { Message, MessageModel } from "@/server/types/Message";

const msgs: MessageModel[] = [];

function addMessage(msg: Message) {
  msgs.push({ id: randomUUID(), sentAt: new Date(), ...msg });
}

export { addMessage };
