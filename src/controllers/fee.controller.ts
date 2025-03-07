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
    if (!req.file) throw new ApiError(400, 'No file uploaded.');
    const fees = await parseCSVorExcel(req.file.buffer, req.file.mimetype);
    await feeService.bulkCreateFees(fees);
    res.status(200).json({ message: "Fees uploaded successfully." });
  } catch (error) {
    next(new ApiError(500, (error as Error).message));
  }
};

export const createFee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fee = await feeService.createFee(req.body);
    res.status(201).json(fee);
  } catch (error) {
    next(new ApiError(500, (error as Error).message));
  }
};

export const updateFee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fee = await feeService.updateFee(+req.params.id, req.body);
    res.status(200).json(fee);
  } catch (error) {
    next(new ApiError(500, (error as Error).message));
  }
};

export const deleteFee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await feeService.deleteFee(+req.params.id);
    res.status(204).send();
  } catch (error) {
    next(new ApiError(500, (error as Error).message));
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
      throw new ApiError(404, "No fee range found.");
    }
    res.status(200).json(fee);
  } catch (error) {
    next(new ApiError(500, (error as Error).message));
  }
};

export const getAllFees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fees = await feeService.getAllFees();
    res.status(200).json(fees);
  } catch (error) {
    next(new ApiError(500, (error as Error).message));
  }
};
