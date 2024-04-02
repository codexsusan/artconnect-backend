import { Readable } from "node:stream";

export interface FileTransfer {
  location?: string;
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  stream: Readable;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
  key?: string;
}

export interface UserInterface {
  _id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  location: string;
  dateOfBirth: Date;
  bio: string;
  phone: string;
  websiteURL: string;
  socialMediaLinks: string[];
  totalArtworks: number;
  totalFollowers: number;
  totalFollowing: number;
  interests: string[];
  occupation: string;
  education: string;
  preferredArtStyle: string;
  isArtist: boolean;
  lastLoginDate: Date;
  userType: string;
  isVerified: boolean;
  otp: string;
  deviceToken: string[];
}

export enum ArtworkAvailability {
  AVAILABLE = "available",
  SOLD = "sold",
  NOTFORSALE = "notforsale",
}

export interface ArtworkInterface {
  _id: string;
  user: string;
  title: string;
  content: string;
  imageUrls: string[];
  isForSale: boolean;
  price: string;
  quantity: string;
  availabilityStatus: ArtworkAvailability;
  categoryIds: string[];
  likeCount: string;
  commentCount: string;
}

export interface FavouritesInterface {
  _id: string;
  userId: string;
  artworkId: string;
}

export interface EventsInterface {
  _id: string;
  name: string;
  description: string;
  eventDate: Date;
  location: string;
  organizerId: string;
  eventType: string;
}

export interface GalleryInterface {
  _id: string;
  name: string;
  location: string;
  description: string;
  curatorId: string;
  establishmentDate: Date;
  openingTime: string;
  closingTime: string;
  contact: string;
  isOpenWeekend: boolean;
}

export interface ExhibitionInterface {
  _id: string;
  galleryId: string;
  userId: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  openingTime: string;
  closingTime: string;
}

export interface AdminInterface {
  _id: string;
  name: string;
  adminName: string;
  contact: string;
  location: string;
  email: string;
  password: string;
  profilePicture: string;
  isVerified: boolean;
  otp: string;
}

export interface CategoryInterface {
  _id: string;
  name: string;
  categoryName: string;
  imageUrl: string;
}

export interface UserInterestInterface {
  _id: string;
  userId: string;
  interestId: string;
}

export interface ArtworkLikeInterface {
  _id: string;
  userId: string;
  artworkId: string;
}

export interface ArtworkCommentInterface {
  _id: string;
  user: string;
  artworkId: string;
  content: string;
  parentId: string;
  likeCount: string;
  createdAt: Date;
}

export interface NestedCommentInterface {
  _id: string;
  user: string | Partial<UserInterface>;
  artworkId: string;
  content: string;
  createdAt: Date;
  children: NestedCommentInterface[];
}

export interface UserBookmarksInterface {
  _id: string;
  user: string;
  artwork: string;
}

export interface CommentLikeInterface {
  _id: string;
  userId: string;
  commentId: string;
}

export interface UserFollowersInterface {
  _id: string;
  followingId: string;
  followerId: string;
}

export interface TransactionInterface {
  _id: string;
  artworkId: string;
  sellerId: string;
  buyerId: string;
  transactionDate: Date;
  transactionAmount: string;
  // transactionStatus: string;
}

export interface NotificationInterface {
  _id: string;
  userId: string;
  title: string;
  body: string;
}

export interface NotificationMessageInterface {
  title: string;
  body: string;
  tokens: string[];
}

export interface Cart {
  _id: string;
  user: string;
  artwork: string;
  quantity: number;
  createdAt: Date;
}
