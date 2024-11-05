import type { UUID } from "crypto";

type Chatroom = {
  name: string;
  creatorId: UUID;
  members: Set<UUID>;
};

type ChatroomModel = {
  id: UUID;
  createdAt?: Date;
} & Chatroom;

export type { Chatroom, ChatroomModel };
