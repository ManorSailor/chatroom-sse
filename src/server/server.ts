import "dotenv/config";
import ViteExpress from "vite-express";
import ExpressApp from "./app";

const { SERVER_PORT: PORT } = process.env;

const SERVER_PORT = PORT ? parseInt(PORT, 10) : 3000;

ViteExpress.listen(ExpressApp, SERVER_PORT, () =>
  console.log(`Server is listening on port ${SERVER_PORT}...`)
);
