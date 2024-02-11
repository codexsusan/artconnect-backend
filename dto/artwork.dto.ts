import { ArtworkInterface } from "../types";

class ArtworkDTO {
  _id: string;
  title: string;
  content: string;
  constructor(artwork: any) {
    this._id = artwork._id;
    this.title = artwork.title;
    this.content = artwork.content;
  }
}

export default ArtworkDTO;
