import Artwork from "../models/artworks.model";
import { CreateArtworkReqDTO } from "../dto/artwork.dto";

export const CreateArtworkService = async (data: CreateArtworkReqDTO) => {
  try {
    return await Artwork.create({
      ...data,
      creationDate: new Date(),
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
};
