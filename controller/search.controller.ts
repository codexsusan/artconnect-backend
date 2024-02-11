import { Request, Response } from "express";
import "../utils/extended-express";

import {
  fetchQueryArtworks,
  fetchQueryUsers,
} from "../services/search.services";

export const searchAll = async (req: Request, res: Response) => {
  try {
    const { type, queryString } = req.query;

    if (!type && !queryString) {
      return res
        .status(400)
        .json({ message: "No search queries provided.", success: false });
    }

    let artworks;
    let users;

    if (type === "all") {
      artworks = await fetchQueryArtworks(`${queryString}`);
    } else if (type === "accounts") {
      users = await fetchQueryUsers(`${queryString}`);
    } else if (type === "artworks") {
      users = await fetchQueryArtworks(`${queryString}`);
    }

    const data = {
      artworks,
      users,
    };

    res.status(200).json({
      message: "Search successful.",
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};
