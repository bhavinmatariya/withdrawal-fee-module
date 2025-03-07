import { Prisma } from "@prisma/client";
import PrismaService from "../config/prisma.service";

const prisma = PrismaService.getClient();

export const bulkCreateFees = async (fees: Prisma.WithdrawalFeeRangeCreateManyInput[]) => {
  return prisma.$transaction(async (prismaTx) => {
    await prismaTx.withdrawalFeeRange.deleteMany();
    return prismaTx.withdrawalFeeRange.createMany({ data: fees });
  });
};

export const createFee = async (data: Prisma.WithdrawalFeeRangeCreateInput) => {
  return prisma.withdrawalFeeRange.create({ data });
};

export const updateFee = async (id: number, data: Prisma.WithdrawalFeeRangeUpdateInput) => {
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
    orderBy: { minAmount: 'asc' },
  });
};