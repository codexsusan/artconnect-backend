import "dotenv/config";
import express, { Request, Response } from "express";
import morgan from "morgan";

import { PORT, SERVER_TIMEOUT } from "./constants";
import { dbConnection } from "./db_connection/connection";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import artistRoutes from "./routes/artist.routes";
import artworksRoutes from "./routes/artworks.routes";
import favouritesRoutes from "./routes/favourites.routes";
import eventsRoutes from "./routes/events.routes";

const port = PORT || 3000;
const app = express();

// MiddlewaresE
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.get("/api", (_: Request, res: Response): void => {
  res.send({ message: "Hello world" });
});

app.get("/api/v1/", (_: Request, res: Response): void => {
  res.send({
    message: "Hello everyone! This is the first version of the API.",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/artist", artistRoutes);
app.use("/api/v1/artwork", artworksRoutes);
app.use("/api/v1/favourites", favouritesRoutes);
app.use("/api/v1/events", eventsRoutes);

const server = app.listen(port, async () => {
  await dbConnection();
  return console.log(`Server running on port http://localhost:${port}`);
});

server.timeout = parseInt(SERVER_TIMEOUT as string);
