import { Request, Response, NextFunction } from "express";
import * as feeService from "../services/fee.service";
import { parseCSVorExcel } from "../utils/csvParser";
import { ApiError } from "../utils/ApiError";

export const uploadFees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) throw new ApiError(400, 'Please upload a CSV or Excel file.');
    const fees = await parseCSVorExcel(req.file.buffer, req.file.mimetype);
    await feeService.bulkCreateFees(fees);
    res.status(200).json({ message: "File uploaded successfully." });
  } catch (error) {
    next(new ApiError(500, "Failed to upload fees. Please ensure the file format is correct."));
  }
};

export const createFee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fee = await feeService.createFee(req.body);
    res.status(201).json({
      message: "Withdrawal fee range created successfully.",
      data: fee,
    });
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(500, "Unable to create fee range. Please try again later.")
    );
  }
};

export const updateFee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fee = await feeService.updateFee(+req.params.id, req.body);
    res.status(200).json({
      message: "Withdrawal fee range updated successfully.",
      data: fee,
    });
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(500, "Unable to update fee range. Please try again later.")
    );
  }
};

export const deleteFee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await feeService.deleteFee(+req.params.id);
    res.status(200).json({
      message: "Withdrawal fee range deleted successfully.",
    });
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(500, "Unable to delete fee range. Please try again later.")
    );
  }
};

export const calculateFee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const amount = parseFloat(req.query.amount as string);
    const fee = await feeService.calculateFee(amount);
    if (!fee) {
      throw new ApiError(
        404,
        "No applicable fee range found for the specified amount."
      );
    }
    res.status(200).json({
      message: "Withdrawal calculation fee fetched.",
      data: fee,
    });
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(500, "Unable to fetch calculate fee. Please try again later.")
    );
  }
};

export const getAllFees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fees = await feeService.getAllFees();
    res.status(200).json({
      message: "All withdrawal fee ranges retrieved successfully.",
      data: fees,
    });
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(500, "Unable to retrieve fee ranges. Please try again later.")
    );
  }
};
