import Artist from "../models/artist.model";

export const fetchArtistIdByUserId = async (userId: string) => {
  try {
    const artist = await Artist.findOne({ userId });
    if (!artist) {
      new Error("Artist not found.");
    }
    return artist._id;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
