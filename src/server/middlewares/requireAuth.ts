import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const { SECRET_KEY = "test-secret" } = process.env;

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  jwt.verify(token ?? "", SECRET_KEY, (err, user) => {
    if (err) {
      res.status(403).send({
        message: "Unauthorized user. Access denied.",
      });
    }

    req.user = user;
    next();
  });
}

export { verifyToken as requireAuth };
