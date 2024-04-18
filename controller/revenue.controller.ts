import { Request, Response } from "express";
import "../utils/extended-express";
import { format, startOfDay, subDays } from "date-fns";

import Order from "../models/order.model";
import { OrderInterface } from "../types";

export const getRevenueOfLast7Days = async (req: Request, res: Response) => {
  try {
    const today: Date = new Date();
    const sevenDaysAgo: Date = subDays(startOfDay(today), 6);

    const query = {
      createdAt: { $gte: sevenDaysAgo, $lte: today },
    };

    let totalRevenue = 0;

    const count = await Order.countDocuments(query);

    const orders = await Order.find(query);

    const revenueByDate: { [date: string]: number } = {};
    const currentDate: Date = new Date(sevenDaysAgo);
    for (let i = 0; i < 7; i++) {
      const formattedDate: string = format(currentDate, "yyyy-MM-dd");
      revenueByDate[formattedDate] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    orders.forEach((order: OrderInterface) => {
      const orderDate: string = format(order.createdAt, "yyyy-MM-dd");
      revenueByDate[orderDate] += parseFloat(order.totalPrice);
      totalRevenue += parseFloat(order.totalPrice);
    });

    const data = [];

    for (const date in revenueByDate) {
      data.push({
        date,
        revenue: revenueByDate[date],
        day: format(new Date(date), "EEEE"),
      });
    }

    return res.status(200).json({
      message: "Revenue fetched successfully.",
      success: true,
      data,
      count,
      totalRevenue,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getRevenueofLast30days = async (req: Request, res: Response) => {
  try {
    const today: Date = new Date();
    const thirtyDaysAgo: Date = subDays(startOfDay(today), 29);

    const orders = await Order.find({
      createdAt: { $gte: thirtyDaysAgo, $lte: today },
    });

    const revenueByDate: { [date: string]: number } = {};
    const currentDate: Date = new Date(thirtyDaysAgo);
    for (let i = 0; i < 30; i++) {
      const formattedDate: string = format(currentDate, "yyyy-MM-dd");
      revenueByDate[formattedDate] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    orders.forEach((order: OrderInterface) => {
      const orderDate: string = format(order.createdAt, "yyyy-MM-dd");
      revenueByDate[orderDate] += parseFloat(order.totalPrice);
    });

    const data = [];

    for (const date in revenueByDate) {
      data.push({
        date,
        revenue: revenueByDate[date],
        day: format(new Date(date), "EEEE"),
      });
    }

    return res.status(200).json({
      message: "Revenue fetched successfully.",
      data: data,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getRevenueOfToday = async (req: Request, res: Response) => {
  try {
    const today: Date = new Date();
    const startOfToday: Date = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday: Date = new Date(today.setHours(23, 59, 59, 999));

    const orders = await Order.find({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });

    let totalRevenue = 0;
    orders.forEach((order: OrderInterface) => {
      totalRevenue += parseFloat(order.totalPrice);
    });

    return res.status(200).json({
      message: "Revenue fetched successfully.",
      success: true,
      data: {
        revenue: totalRevenue,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};
