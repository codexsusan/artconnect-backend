import {ArtworkInterface, UserInterface} from "../types";

export interface CreateArtworkReqDTO {
    userId: UserInterface["_id"];
    content: ArtworkInterface["content"];
    imageUrls: ArtworkInterface["imageUrls"];
    isForSale: ArtworkInterface["isForSale"];
    price: ArtworkInterface["price"];
    quantity: ArtworkInterface["quantity"];
    availabilityStatus: ArtworkInterface["availabilityStatus"];
}

export type CreateArtworkResDTO = ArtworkInterface;
