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
