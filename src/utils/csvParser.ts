import csvParser from "csv-parser";
import { Readable } from "stream";
import { Prisma } from "@prisma/client";
import * as XLSX from "xlsx";

interface RateCSVRow {
  minimum: string;
  maximum: string;
  rate: string;
}

export const parseCSVorExcel = async (
  buffer: Buffer,
  mimetype: string
): Promise<Prisma.WithdrawalRateRangeCreateManyInput[]> => {
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
): Promise<Prisma.WithdrawalRateRangeCreateManyInput[]> => {
  return new Promise((resolve, reject) => {
    const data: Prisma.WithdrawalRateRangeCreateManyInput[] = [];

    Readable.from(buffer)
      .pipe(csvParser())
      .on("data", (row: RateCSVRow) => {
        const minAmount = parseFloat(row.minimum);
        const maxAmount = parseFloat(row.maximum);
        const rate = parseFloat(row.rate);

        if (isNaN(minAmount) || isNaN(maxAmount) || isNaN(rate)) {
          throw new Error(`Invalid CSV data: ${JSON.stringify(row)}`);
        }

        data.push({ minAmount, maxAmount, rate });
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
    const minAmount = parseFloat(row.minimum);
    const maxAmount = parseFloat(row.maximum);
    const rate = parseFloat(row.rate);

    if ([minAmount, maxAmount, rate].some(isNaN)) {
      throw new Error(`Invalid Excel data: ${JSON.stringify(row)}`);
    }

    return { minAmount, maxAmount, rate };
  });
};
