// App
export const PORT = process.env.PORT || 3500;
export const SERVER_TIMEOUT = process.env.SERVER_TIMEOUT || 30000;

// Database
export const DATABASE_URL = process.env.DATABASE_URL;

// JWT
export const JWT_SECRET = process.env.JWT_SECRET;

// Email: Resend
export const FROM_ADDRESS = process.env.FROM_ADDRESS;
export const RESEND_SECRET = process.env.RESEND_SECRET;

// Bcrypt
export const SALT_ROUNDS: number = parseInt(process.env.SALT_ROUNDS) || 10;

// Bucket Details
export const BUCKET_ACCESS_KEY = process.env.BUCKET_ACCESS_KEY;
export const BUCKET_BUCKET_NAME = process.env.BUCKET_BUCKET_NAME;
export const BUCKET_ENDPOINT = process.env.BUCKET_ENDPOINT;
export const BUCKET_REGION = process.env.BUCKET_REGION;
export const BUCKET_SECRET_ACCESS_KEY = process.env.BUCKET_SECRET_ACCESS_KEY;

export const DEFAULT_PROFILE = process.env.DEFAULT_PROFILE;

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;

export const UPSTASH_URL = process.env.UPSTASH_URL;

export const PRIVATE_KEY_ID = process.env.PRIVATE_KEY_ID;
