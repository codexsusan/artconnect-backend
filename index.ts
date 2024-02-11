import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";

import { PORT, SERVER_TIMEOUT } from "./constants";
import { dbConnection } from "./db_connection/connection";
import mainRoutes from "./routes/main.routes";

const port = PORT || 3000;
const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.get("/api", (req: Request, res: Response): void => {
  res.send({ message: "Hello world" });
});

app.use("/api/v1", mainRoutes);

// Error handling
app.use("*", (req: Request, res: Response): void => {
  res.status(404).send({ message: "Not found" });
});

app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    res.status(500).send({ message: "Something went wrong!" });
  }
);

const server = app.listen(port, async () => {
  await dbConnection();
  return console.log(`Server running on port http://localhost:${port}`);
});

server.timeout = parseInt(SERVER_TIMEOUT as string);
