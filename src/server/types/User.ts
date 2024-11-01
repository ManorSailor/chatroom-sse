import type { UUID } from "crypto";

type User = {
  id: UUID;
  username: string;
  password: string;
};

export type { User };
