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
import userInterestRoutes from "./user-interest.routes";
import artworkCommentRoutes from "./artwork-comment.routes";
import userBookmarkRoutes from "./user-bookmark.routes";
import uploadRoutes from "./images.routes";
import userFollowerRoutes from "./user-follower.routes";
import searchRoutes from "./search.routes";
import notificationRoutes from "./notification.routes";

const router = express.Router();

// router.get("/", (_: Request, res: Response): void => {
//   res.send({
//     message: "Hello everyone! This is the first version of the API.",
//   });
// });

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/artwork", artworksRoutes);
router.use("/favourites", favouritesRoutes);
router.use("/events", eventsRoutes);
router.use("/gallery", galleryRoutes);
router.use("/exhibition", exhibitionRoutes);
router.use("/category", categoryRoutes);
router.use("/interest", userInterestRoutes);
router.use("/comment", artworkCommentRoutes);
router.use("/bookmark", userBookmarkRoutes);
router.use("/upload", uploadRoutes);
router.use("/user-follower", userFollowerRoutes);
router.use("/search", searchRoutes);
router.use("/notification", notificationRoutes);


export default router;