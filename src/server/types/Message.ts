import type { UUID } from "crypto";

type Message = {
  authorId: UUID;
  roomId: UUID;
  content: string;
};

type MessageModel = {
  id: UUID;
  sentAt?: Date;
} & Message;

export type { Message, MessageModel };
