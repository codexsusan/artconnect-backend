import { model, Schema } from "mongoose";
import { EventsInterface } from "../types";
import UserModel from "./user.model";

const eventsSchema: Schema<EventsInterface> = new Schema<EventsInterface>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  organizerId: {
    type: String,
    required: true,
    ref: UserModel,
  },
  eventType: {
    type: String,
    required: false,
  },
});

const Event = model("Event", eventsSchema);
export default Event;
