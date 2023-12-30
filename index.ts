import "dotenv/config";

import express, { Request, Response } from "express";
import morgan from "morgan";

import { PORT, SERVER_TIMEOUT } from "./constants";
import authRoutes from "./routes/auth.routes";
import { dbConnection } from "./db_connection/connection";

const port = PORT || 3000;
const app = express();

// MiddlewaresE
app.use(express.json());
app.use(morgan("dev"));

app.get("/api", (_: Request, res: Response): void => {
  res.send({ message: "Hello world" });
});

app.get("/api/v1/", (_: Request, res: Response): void => {
  res.send({
    message: "Hello everyone! This is the first version of the API.",
  });
});

app.use("/api/v1/auth", authRoutes);

const server = app.listen(port, async () => {
  await dbConnection();
  return console.log(`Server running on port http://localhost:${port}`);
});

server.timeout = parseInt(SERVER_TIMEOUT as string);
