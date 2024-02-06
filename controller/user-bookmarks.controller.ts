import { Request, Response } from "express";
import Bookmark from "../models/user-bookmarks.model";

export const switchBookmark = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const artworkId = req.body.artworkId;

    const fetchedBookmark = await Bookmark.findOne({ userId, artworkId });
    if (fetchedBookmark) {
      // delete bookmark
      await Bookmark.findOneAndDelete({ _id: fetchedBookmark._id });
      res.status(200).json({ message: "Bookmark removed", success: true });
    } else {
      // add bookmark
      const bookmark = await Bookmark.create({ userId, artworkId });
      res
        .status(201)
        .json({ message: "Bookmark added", success: true, data: bookmark });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const userBookmarks = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const bookmarks = await Bookmark.find({ userId });
    res.status(200).json({
      message: "Fetched successfully.",
      success: true,
      data: bookmarks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};
