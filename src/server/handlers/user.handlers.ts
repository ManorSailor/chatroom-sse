import * as UserService from "@/server/services/user.service";
import { AuthError, NotFoundError } from "@/server/exceptions/exceptions";

import type { Request, Response } from "express";
import type { UserAuth } from "@/server/types/UserAuth";

function registerHandler(req: Request, res: Response) {
  const userInfo: UserAuth = req.body;

  try {
    const user = UserService.register(userInfo);
    res.status(201).send({
      message: `Welcome aboard, ${user.username}!`,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(409).send({ message: error.message });
    }
  }
}

function loginHandler(req: Request, res: Response) {
  const userInfo: UserAuth = req.body;

  try {
    const authToken = UserService.login(userInfo);
    res.status(200).send(authToken);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).send({ message: error.message });
    } else if (error instanceof AuthError) {
      res.status(403).send({ message: error.message });
    }
  }
}

export { registerHandler, loginHandler };
