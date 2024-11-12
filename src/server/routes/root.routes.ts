import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";

const rootRoutes = Router();

rootRoutes.get("/", requireAuth, (_, res) => {
  res.status(200).send({
    message: "You've successfully authenticated.",
  });
});

export default rootRoutes;
