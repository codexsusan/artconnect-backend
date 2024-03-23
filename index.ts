import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import "./utils/extended-express";
import morgan from "morgan";
import cors from "cors";

import { PORT } from "./constants";
import { dbConnection } from "./db_connection/connection";
import mainRoutes from "./routes/main.routes";
import client from "./utils/redis";

const port = PORT || 3000;
const app = express();
app.use(cors());

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    res.status(500).send({ message: "Something went wrong!" });
  }
);

app.listen(port, async () => {
  await dbConnection();
  await client.connect();
  return console.log(`Server running on port http://localhost:${port}`);
});

// server.timeout = parseInt(SERVER_TIMEOUT as string);
