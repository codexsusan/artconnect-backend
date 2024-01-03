import { Request, Response } from "express";
import "../utils/extended-express";
import Artist from "../models/artist.model";
import { ArtworkAvailability } from "../types";
import { CreateArtworkService } from "../services/artwork.services";
import { CreateArtworkReqDTO, CreateArtworkResDTO } from "../dto/artwork.dto";
import Artwork from "../models/artworks.model";
import { fetchArtistIdByUserId } from "../services/artist.services";

export const createArtwork = async (req: Request, res: Response) => {
  const userId: string = req.userId;
  const { title, description, imageURLs, medium, availabilityStatus } =
    req.body;
  try {
    const fetchedArtist = await Artist.findOne({ userId });
    if (!fetchedArtist) {
      return res.status(404).json({
        message: "You aren't registered as an artist.",
        success: false,
      });
    }

    const artworkData: CreateArtworkReqDTO = {
      artistId: fetchedArtist._id,
      title,
      description,
      imageURLs,
      medium,
      availabilityStatus: availabilityStatus ?? ArtworkAvailability.AVAILABLE,
    };

    const newArtwork: CreateArtworkResDTO =
      await CreateArtworkService(artworkData);

    res.status(201).json({
      message: "Artwork has been created successfully.",
      success: true,
      data: newArtwork,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const fetchArtworkById = async (req: Request, res: Response) => {
  const artworkId: string = req.params.artworkId;
  try {
    const fetchedArtwork = await Artwork.findById(artworkId);
    if (!fetchedArtwork) {
      return res.status(404).json({
        message: "Artwork not found.",
        success: false,
      });
    }

    res.status(200).json({
      message: "Artwork fetched successfully.",
      success: true,
      data: fetchedArtwork,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const fetchArtworksByArtistId = async (req: Request, res: Response) => {
  const artistId: string = req.params.artistId;
  try {
    const fetchedArtist = await Artist.findById(artistId);
    if (!fetchedArtist) {
      return res.status(404).json({
        message: "Artist not found.",
        success: false,
      });
    }
    const fetchedArtworks = await Artwork.find({ artistId });
    if (!fetchedArtworks) {
      return res.status(404).json({
        message: "Artworks not found.",
        success: false,
      });
    }
    res.status(200).json({
      message: "Artworks fetched successfully.",
      success: true,
      data: fetchedArtworks,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteArtworkById = async (req: Request, res: Response) => {
  const artworkId: string = req.params.artworkId;
  const userId = req.userId;
  try {
    const artistId = await fetchArtistIdByUserId(userId);
    const fetchedArtwork = await Artwork.findOne({
      _id: artworkId,
      artistId,
    });
    if (!fetchedArtwork) {
      return res.status(404).json({
        message: "Artwork not found.",
        success: false,
      });
    }
    await Artwork.deleteOne({ _id: artworkId, artistId });

    res.status(200).json({
      message: "Artwork deleted successfully.",
      success: true,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
