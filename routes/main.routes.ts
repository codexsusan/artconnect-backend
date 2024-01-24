import express, {Request, Response} from "express";
import "../utils/extended-express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import adminRoutes from "./admin.routes";
import artworksRoutes from "./artworks.routes";
import favouritesRoutes from "./favourites.routes";
import eventsRoutes from "./events.routes";
import galleryRoutes from "./gallery.routes";
import exhibitionRoutes from "./exhibition.routes";
import categoryRoutes from "./category.routes";

import userCategoryRoutes from "./userCategory.routes";

const router = express.Router();

router.get("/", (_: Request, res: Response): void => {
    res.send({
        message: "Hello everyone! This is the first version of the API.",
    });
});

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/artwork", artworksRoutes);
router.use("/favourites", favouritesRoutes);
router.use("/events", eventsRoutes);
router.use("/gallery", galleryRoutes);
router.use("/exhibition", exhibitionRoutes);
router.use("/category", categoryRoutes);
router.use("/user-category", userCategoryRoutes);

export default router;