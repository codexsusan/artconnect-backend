import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import "./utils/extended-express";
import morgan from "morgan";

import { createServer } from "http";

import { PORT } from "./constants";
import { dbConnection } from "./db_connection/connection";
import mainRoutes from "./routes/main.routes";
import { initSocket } from "./sockets/socketHandler";

const port = PORT || 3000;
const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

// socket.io
const server = createServer(app);
const io = initSocket(server);
// Routes
app.get("/api", (_req: Request, res: Response): void => {
  res.send({ message: "Hello world" });
});

app.use("/api/v1", mainRoutes);

// Error handling
app.use("*", (_req: Request, res: Response): void => {
  res.status(404).send({ message: "Not found" });
});

app.use(
  (_err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    res.status(500).send({ message: "Something went wrong!" });
  }
);

server.listen(port, async () => {
  await dbConnection();
  return console.log(`Server running on port http://localhost:${port}`);
});

// server.timeout = parseInt(SERVER_TIMEOUT as string);
