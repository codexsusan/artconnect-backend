import { ArtistInterface, ArtworkInterface } from "../types";

export interface CreateArtworkReqDTO {
  artistId: ArtistInterface["_id"];
  title: ArtworkInterface["title"];
  description: ArtworkInterface["description"];
  imageURLs: ArtworkInterface["imageURLs"];
  medium: ArtworkInterface["medium"];
  availabilityStatus: ArtworkInterface["availabilityStatus"];
}

export type CreateArtworkResDTO = ArtworkInterface;
