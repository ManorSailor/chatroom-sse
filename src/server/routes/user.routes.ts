import { Router } from "express";
import { loginHandler, registerHandler } from "@/server/handlers/user.handlers";

const userRoutes = Router();

userRoutes.post("/register", registerHandler);
userRoutes.post("/login", loginHandler);

export default userRoutes;
