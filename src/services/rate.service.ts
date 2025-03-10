import { Prisma } from "@prisma/client";
import PrismaService from "../config/prisma.service";
import { ApiError } from "../utils/ApiError";

const prisma = PrismaService.getClient();

export const bulkCreateRates = async (
  rates: Prisma.WithdrawalRateRangeCreateManyInput[]
) => {
  return prisma.$transaction(async (prismaTx) => {
    await prismaTx.withdrawalRateRange.deleteMany();
    return prismaTx.withdrawalRateRange.createMany({ data: rates });
  });
};

export const createRate = async (data: Prisma.WithdrawalRateRangeCreateInput) => {
  const existing = await prisma.withdrawalRateRange.findFirst({
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
      "Rate range overlaps with an existing range."
    );
  }
  return prisma.withdrawalRateRange.create({ data });
};

export const updateRate = async (
  id: number,
  data: Prisma.WithdrawalRateRangeUpdateInput
) => {
  const current = await prisma.withdrawalRateRange.findUnique({ where: { id } });
  if (!current) throw new ApiError(404, "Rate range not found.");

  const existing = await prisma.withdrawalRateRange.findFirst({
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
    throw new ApiError(400, "Rate range overlaps with an existing range.");
  }

  return prisma.withdrawalRateRange.update({ where: { id }, data });
};

export const deleteRate = async (id: number) => {
  return prisma.withdrawalRateRange.delete({ where: { id } });
};

export const getrate = async (amount: number) => {
  const WithdrawalRateRange = await prisma.withdrawalRateRange.findFirst({
    where: {
      minAmount: { lte: amount },
      maxAmount: { gte: amount },
    },
  });

  return WithdrawalRateRange?.rate;
};

export const getAllRates = async () => {
  return prisma.withdrawalRateRange.findMany({
    orderBy: { minAmount: "asc" },
  });
};
