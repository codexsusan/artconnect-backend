import Artwork from "../models/artworks.model";

export const CreateArtwork = async (data: any) => {
    return await Artwork.create({
        ...data,
        creationDate: new Date(),
    });
};

export const ArtworkById = async (id: string) => {
    return Artwork.findById(id).select("-__v");
}

export const ArtworkByUserId = async (userId: string) => {
    return Artwork.find({userId}).select("-__v");
}
