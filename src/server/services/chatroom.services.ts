import { randomUUID, type UUID } from "crypto";

import * as MessageService from "./message.services";
import { NotFoundError } from "@/server/exceptions/exceptions";

import type { Message, MessageModel } from "@/server/types/Message";
import type { ChatroomModel } from "@/server/types/Chatroom";

// TODO: Use db
const rooms: ChatroomModel[] = [];

// Setup a default room
rooms.push({
  id: "9b63be88-6c71-46e8-a914-5e9c6e82e582",
  name: "#default-room",
  createdAt: new Date(),
  creatorId: randomUUID(),
  members: new Set(),
});

function joinRoom(roomId: UUID, userId: UUID) {
  const roomToJoin = rooms.find((r) => r.id === roomId);

  if (!roomToJoin) {
    throw new NotFoundError("Room not found!");
  }

  roomToJoin.members.add(userId);
}

function receiveMessage(roomId: string, message: Message): MessageModel {
  const room = rooms.find((r) => r.id === roomId);

  if (!room) {
    throw new NotFoundError("Room not found!");
  }

  // TODO: Ensure message author is a member of group before saving the message
  // const isUserMember = room.members.has(message.authorId)

  return MessageService.addMessage(message);
}

function subscribeToRoom(roomId: UUID, userId: UUID, cb) {
  
}

export { joinRoom, receiveMessage };
