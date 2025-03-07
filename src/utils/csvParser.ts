import csvParser from "csv-parser";
import { Readable } from "stream";
import { Prisma } from "@prisma/client";
import * as XLSX from "xlsx";

interface FeeCSVRow {
  minAmount: string;
  maxAmount: string;
  fee: string;
}

export const parseCSVorExcel = async (
  buffer: Buffer,
  mimetype: string
): Promise<Prisma.WithdrawalFeeRangeCreateManyInput[]> => {
  if (
    mimetype.includes("excel") ||
    mimetype.includes("spreadsheetml") ||
    mimetype.includes("xls") ||
    mimetype.includes("xlsx")
  ) {
    return parseExcel(buffer);
  }
  return parseCSV(buffer);
};

export const parseCSV = (
  buffer: Buffer
): Promise<Prisma.WithdrawalFeeRangeCreateManyInput[]> => {
  return new Promise((resolve, reject) => {
    const data: Prisma.WithdrawalFeeRangeCreateManyInput[] = [];

    Readable.from(buffer)
      .pipe(csvParser())
      .on("data", (row: FeeCSVRow) => {
        const minAmount = parseFloat(row.minAmount);
        const maxAmount = parseFloat(row.maxAmount);
        const fee = parseFloat(row.fee);

        if (isNaN(minAmount) || isNaN(maxAmount) || isNaN(fee)) {
          throw new Error(`Invalid CSV data: ${JSON.stringify(row)}`);
        }

        data.push({ minAmount, maxAmount, fee });
      })
      .on("end", () => resolve(data))
      .on("error", reject);
  });
};

const parseExcel = (buffer: Buffer) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: any[] = XLSX.utils.sheet_to_json(firstSheet);

  return rows.map((row) => {
    const minAmount = parseFloat(row.minAmount);
    const maxAmount = parseFloat(row.maxAmount);
    const fee = parseFloat(row.fee);

    if ([minAmount, maxAmount, fee].some(isNaN)) {
      throw new Error(`Invalid Excel data: ${JSON.stringify(row)}`);
    }

    return { minAmount, maxAmount, fee };
  });
};
