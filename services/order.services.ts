import { getPresignedUrl } from "../middlewares/image.middleware";
import Order from "../models/order.model";
import User from "../models/user.model";
import { OrderInterface } from "../types";
import { getArtworkDetailData } from "./artwork.services";

export const getOrderDetails = async (
  orderId: OrderInterface["_id"],
  currentUserId: string
) => {
  const order = await Order.findById(orderId);
  const artwork = await getArtworkDetailData(order.artwork, currentUserId);
  const buyer = await User.findById(order.buyer).select(
    "name username email profilePicture"
  );
  const buyerPresignedProfilePicture = await getPresignedUrl(
    buyer.profilePicture
  );
  return {
    ...order.toJSON(),
    buyer: {
      ...buyer.toJSON(),
      profilePicture: buyerPresignedProfilePicture,
    },
    seller: artwork.user,
    artwork,
  };
};
