import { Request, Response } from "express";
import "../utils/extended-express";
import Artist from "../models/artist.model";
import { getUserById } from "../services/user.services";

export const RegisterArtist = async (req: Request, res: Response) => {
  const userId: string = req.userId;
  const { artistName } = req.body;
  try {
    const fetchedArtist = await Artist.findOne({
      userId,
    });

    if (fetchedArtist) {
      return res
        .status(400)
        .json({ message: "You are already registered as artist." });
    }
    const fetchedUser = await getUserById(userId);

    if (!fetchedUser) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    const newArtist = await Artist.create({
      userId,
      artistName,
      isVerified: fetchedUser.isVerified,
      joinDate: new Date(),
    });

    return res.status(201).json({
      message: "Artist has been created successfully.",
      success: true,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const GetArtistById = async (req: Request, res: Response) => {
  const artistId = req.params.artistId;
  try {
    const artist = await Artist.findById(artistId);

    if (!artist) {
      return res.status(404).json({
        message: "Artist not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Artist found.",
      success: true,
      data: artist,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
