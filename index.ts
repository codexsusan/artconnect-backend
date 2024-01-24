import "dotenv/config";
import express, {Request, Response} from "express";
import morgan from "morgan";

import {PORT, SERVER_TIMEOUT} from "./constants";
import {dbConnection} from "./db_connection/connection";
import mainRoutes from "./routes/main.routes";


const port = PORT || 3000;
const app = express();

// MiddlewaresE
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.get("/api", (_: Request, res: Response): void => {
    res.send({message: "Hello world"});
});

// app.get("/api/v1/", (_: Request, res: Response): void => {
//     res.send({
//         message: "Hello everyone! This is the first version of the API.",
//     });
// });

app.use("/api/v1", mainRoutes);

// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/user", userRoutes);
// app.use("/api/v1/admin", adminRoutes);
// app.use("/api/v1/artwork", artworksRoutes);
// app.use("/api/v1/favourites", favouritesRoutes);
// app.use("/api/v1/events", eventsRoutes);
// app.use("/api/v1/gallery", galleryRoutes);
// app.use("/api/v1/exhibition", exhibitionRoutes);
// app.use("/api/v1/category", categoryRoutes);
// app.use("/api/v1/user-category", userCategoryRoutes);

const server = app.listen(port, async () => {
    await dbConnection();
    return console.log(`Server running on port http://localhost:${port}`);
});

server.timeout = parseInt(SERVER_TIMEOUT as string);
