export interface UserInterface {
  _id: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  location: string;
  name: string;
  dateOfBirth: Date;
  bio: string;
  phone: string;
  websiteURL: string;
  socialMediaLinks: string[];
  interests: string[];
  occupation: string;
  education: string;
  preferredArtStyle: string;
  accountCreationDate: Date;
  lastLoginDate: Date;
  userType: string;
  isVerified: boolean;
  otp: string;
}

export interface ArtistInterface {
  _id: string;
  userId: string;
  artistName: string;
  biography: string;
  contactInfo: string;
  socialMediaLinks: string[];
  location: string;
  websiteURL: string;
  education: string;
  style: string;
  awardsHonors: string[];
  exhibitions: string[];
  collections: string[];
  galleryRepresentation: string;
  isFeatured: boolean;
  isVerified: boolean;
  joinDate: Date;
  profileViews: number;
}

export enum ArtworkAvailability {
  AVAILABLE = "available",
  SOLD = "sold",
}

export interface ArtworkInterface {
  _id: string;
  artistId: string;
  title: string;
  description: string;
  imageURLs: string[];
  medium: string;
  creationDate: Date;
  availabilityStatus: ArtworkAvailability;
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
  openingTime: Date;
  closingTime: Date;
  contact: string;
  isOpenWeekend: boolean;
}
