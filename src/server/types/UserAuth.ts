type UserAuth = {
  username: string;
  password: string;
};

type AuthToken = {
  token: string;
  expiresIn: number;
};

export type { UserAuth, AuthToken };
