import { Request, Response } from "express";
import "../utils/extended-express";
import Event from "../models/events.model";

export const registerEvent = async (req: Request, res: Response) => {
  const userId: string = req.userId;
  // const { name, description, eventDate, location, eventType } = req.body;
  try {
    const newEvent = await Event.create({
      ...req.body,
      eventDate: new Date(),
      organizerId: userId,
    });
    res.status(201).json({
      message: "Event created successfully",
      success: true,
      data: newEvent,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res
        .status(404)
        .json({ message: "Event not found", success: false });
    }
    res
      .status(200)
      .json({ message: "Event found", success: true, data: event });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const removeEventById = async (req: Request, res: Response) => {
  const eventId = req.params.eventId;
  const userId = req.userId;
  try {
    const event = await Event.findOneAndDelete({
      _id: eventId,
      organizerId: userId,
    });
    if (!event) {
      return res
        .status(404)
        .json({ message: "Event not found", success: false });
    }
    res.status(200).json({ message: "Event deleted", success: true });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
