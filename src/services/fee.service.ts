import { Prisma } from "@prisma/client";
import PrismaService from "../config/prisma.service";
import { ApiError } from "../utils/ApiError";

const prisma = PrismaService.getClient();

export const bulkCreateFees = async (
  fees: Prisma.WithdrawalFeeRangeCreateManyInput[]
) => {
  return prisma.$transaction(async (prismaTx) => {
    await prismaTx.withdrawalFeeRange.deleteMany();
    return prismaTx.withdrawalFeeRange.createMany({ data: fees });
  });
};

export const createFee = async (data: Prisma.WithdrawalFeeRangeCreateInput) => {
  const existing = await prisma.withdrawalFeeRange.findFirst({
    where: {
      OR: [
        {
          minAmount: { lte: data.maxAmount },
          maxAmount: { gte: data.minAmount },
        },
      ],
    },
  });
  if (existing) {
    throw new ApiError(
      400,
      "Fee range with same minAmount and maxAmount already exists."
    );
  }
  return prisma.withdrawalFeeRange.create({ data });
};

export const updateFee = async (
  id: number,
  data: Prisma.WithdrawalFeeRangeUpdateInput
) => {
  const current = await prisma.withdrawalFeeRange.findUnique({ where: { id } });
  if (!current) throw new ApiError(404, "Fee range not found.");

  const existing = await prisma.withdrawalFeeRange.findFirst({
    where: {
      id: { not: id },
      OR: [
        {
          minAmount: { lte: data.maxAmount as number },
          maxAmount: { gte: data.minAmount as number },
        },
      ],
    },
  });

  if (existing) {
    throw new ApiError(400, "Fee range overlaps with an existing range.");
  }

  return prisma.withdrawalFeeRange.update({ where: { id }, data });
};

export const deleteFee = async (id: number) => {
  return prisma.withdrawalFeeRange.delete({ where: { id } });
};

export const calculateFee = async (amount: number) => {
  return prisma.withdrawalFeeRange.findFirst({
    where: {
      minAmount: { lte: amount },
      maxAmount: { gte: amount },
    },
  });
};

export const getAllFees = async () => {
  return prisma.withdrawalFeeRange.findMany({
    orderBy: { minAmount: "asc" },
  });
};
