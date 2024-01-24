import {Request, Response} from "express";
import "../utils/extended-express";
import {CreateArtworkService} from "../services/artwork.services";
import {CreateArtworkReqDTO, CreateArtworkResDTO} from "../dto/artwork.dto";
import Artwork from "../models/artworks.model";
import {getUserById} from "../services/user.services";

export const createArtwork = async (req: Request, res: Response) => {
    const userId: string = req.userId;
    const {content, imageUrls, isForSale, price, quantity, availabilityStatus} =
        req.body;
    try {
        const fetchedUser = await getUserById(userId);
        if (!fetchedUser) {
            return res.status(404).json({
                message: "User not found.",
                success: false,
            });
        }

        const artworkData: CreateArtworkReqDTO = {
            artistId: fetchedUser._id,
            content,
            imageUrls,
            isForSale,
            price,
            quantity,
            availabilityStatus,
        };

        const newArtwork: CreateArtworkResDTO =
            await CreateArtworkService(artworkData);

        res.status(201).json({
            message: "Artwork has been created successfully.",
            success: true,
            data: newArtwork,
        });
    } catch (error) {
        res.status(500).json({message: error.message, success: false});
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
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message, success: false});
    }
};

export const fetchArtworksByUserId = async (req: Request, res: Response) => {
    const userId: string = req.params.userId;
    try {
        const fetchedArtworks = await Artwork.find({userId});
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
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message, success: false});
    }
};

export const deleteArtworkById = async (req: Request, res: Response) => {
    const artworkId: string = req.params.artworkId;
    const userId = req.userId;
    try {
        const fetchedArtwork = await Artwork.findOne({
            _id: artworkId,
            userId,
        });
        if (!fetchedArtwork) {
            return res.status(404).json({
                message: "Artwork not found.",
                success: false,
            });
        }
        await Artwork.deleteOne({_id: artworkId, userId});

        res.status(200).json({
            message: "Artwork deleted successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message, success: false});
    }
};
