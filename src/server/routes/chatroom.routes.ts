import { Router } from "express";

import { requireAuth } from "@/server/middlewares/requireAuth";
import {
  messageStreamHandler,
  sendMessageHandler,
} from "@/server/handlers/chatroom.handlers";

const chatroomRoutes = Router();

chatroomRoutes.post("/rooms/:roomId/messages", requireAuth, sendMessageHandler);
chatroomRoutes.get("/rooms/:roomId/stream", requireAuth, messageStreamHandler);

export default chatroomRoutes;
