import { Request, Response, NextFunction } from "express";
import * as rateService from "../services/rate.service";
import { parseCSVorExcel } from "../utils/csvParser";
import { ApiError } from "../utils/ApiError";

export const uploadRates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) throw new ApiError(400, 'Please upload a CSV or Excel file.');
    const rates = await parseCSVorExcel(req.file.buffer, req.file.mimetype);
    await rateService.bulkCreateRates(rates);
    res.status(200).json({ message: "File uploaded successfully." });
  } catch (error) {
    next(new ApiError(500, "Failed to upload file. Please ensure the file format is correct."));
  }
};

export const createRate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rate = await rateService.createRate(req.body);
    res.status(201).json({
      message: "Withdrawal rate range created successfully.",
      data: rate,
    });
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(500, "Unable to create rate range. Please try again later.")
    );
  }
};

export const updateRate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rate = await rateService.updateRate(+req.params.id, req.body);
    res.status(200).json({
      message: "Withdrawal rate range updated successfully.",
      data: rate,
    });
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(500, "Unable to update rate range. Please try again later.")
    );
  }
};

export const deleteRate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await rateService.deleteRate(+req.params.id);
    res.status(200).json({
      message: "Withdrawal rate range deleted successfully.",
    });
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(500, "Unable to delete rate range. Please try again later.")
    );
  }
};

export const getrate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const amount = parseFloat(req.query.amount as string);
    const rate = await rateService.getrate(amount);
    if (!rate) {
      throw new ApiError(
        404,
        "No applicable rate range found for the specified amount."
      );
    }
    res.status(200).json({
      message: "Withdrawal calculation rate fetched.",
      data: rate,
    });
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(500, "Unable to fetch calculate rate. Please try again later.")
    );
  }
};

export const getAllRates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rates = await rateService.getAllRates();
    res.status(200).json({
      message: "All withdrawal rate ranges retrieved successfully.",
      data: rates,
    });
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(500, "Unable to retrieve rate ranges. Please try again later.")
    );
  }
};
