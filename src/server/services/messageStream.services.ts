import type { UUID } from "crypto";
import type { MessageModel } from "@/server/types/Message";

const subscribers = new Map<
  UUID,
  Set<(message: MessageModel, event: string) => void>
>();

function subscribe(
  roomId: UUID,
  cb: (message: MessageModel, event: string) => void
) {
  const callbacks = subscribers.get(roomId) ?? new Set();

  callbacks.add(cb);
  subscribers.set(roomId, callbacks);

  return () => callbacks.delete(cb);
}

function broadcast(
  roomId: UUID,
  message: MessageModel,
  event: string = "NEW_MSG"
) {
  const callbacks = subscribers.get(roomId);
  callbacks?.forEach((cb) => cb(message, event));
}

export { subscribe, broadcast };
