import express from "express";

import rootRoutes from "./routes/root.routes";
import userRoutes from "./routes/user.routes";
import chatroomRoutes from "./routes/chatroom.routes";

const app = express();

app.use(express.json());

app.use(rootRoutes);
app.use(userRoutes);
app.use(chatroomRoutes);

export default app;
