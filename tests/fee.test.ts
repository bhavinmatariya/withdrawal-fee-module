import request from "supertest";
import app from "../src/app";
import { PrismaClient } from "@prisma/client";
import * as feeService from "../src/services/fee.service";

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.withdrawalFeeRange.deleteMany();
});

afterAll(async () => {
  await prisma.withdrawalFeeRange.deleteMany();
  await prisma.$disconnect();
});

describe("Withdrawal Fee Module API", () => {
  test("POST /ranges - Create Fee Range", async () => {
    const res = await request(app).post("/api/ranges").send({
      minAmount: 1,
      maxAmount: 100,
      fee: 1.5,
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.fee).toBe("1.5");
  });

  test("GET /ranges - Get All Fees", async () => {
    const res = await request(app).get("/api/ranges");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("GET /api/ranges/calculate - Calculate Fee", async () => {
    const res = await request(app)
      .get("/api/ranges/calculate")
      .query({ amount: 50 });

    expect(res.status).toBe(200);
    expect(res.body.fee).toBe("1.5");
  });

  test("PUT /api/ranges/:id - Update Fee Range", async () => {
    const fee = await prisma.withdrawalFeeRange.findFirst();

    const res = await request(app).put(`/api/ranges/${fee!.id}`).send({
      fee: 2.0,
    });

    expect(res.status).toBe(200);
    expect(res.body.fee).toBe("2");
  });

  test("DELETE /api/ranges/:id - Delete Fee Range", async () => {
    const fee = await prisma.withdrawalFeeRange.findFirst();

    const res = await request(app).delete(`/api/ranges/${fee!.id}`);

    expect(res.status).toBe(204);
  });

  test("POST /api/ranges/upload - Upload CSV Fees", async () => {
    const res = await request(app)
      .post("/api/ranges/upload")
      .attach(
        "file",
        Buffer.from("minAmount,maxAmount,fee\n0,100,1.5"),
        "fees.csv"
      );

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Fees uploaded successfully.");
  });

  test("POST /api/ranges/upload - Upload Excel Fees", async () => {
    const res = await request(app)
      .post("/api/ranges/upload")
      .attach("file", "tests/fixtures/fee.xlsx");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Fees uploaded successfully.");
  });

  test("POST /api/ranges/upload - No file uploaded", async () => {
    const res = await request(app).post("/api/ranges/upload");
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("No file uploaded.");
  });

  test("GET /api/ranges/calculate - Amount not in range", async () => {
    const res = await request(app)
      .get("/api/ranges/calculate")
      .query({ amount: 99999 });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("No fee range found.");
  });

  test("POST /api/ranges - Validation Error", async () => {
    const res = await request(app).post("/api/ranges").send({
      minAmount: -1,
      maxAmount: 100,
      fee: 1.5,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test("POST /api/ranges - should handle createFee errors", async () => {
    jest
      .spyOn(feeService, "createFee")
      .mockRejectedValueOnce(new Error("Create Error"));

    const res = await request(app).post("/api/ranges").send({
      minAmount: 0,
      maxAmount: 100,
      fee: 1.5,
    });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Create Error");
  });

  test("PUT /api/ranges/:id - should handle updateFee errors", async () => {
    jest
      .spyOn(feeService, "updateFee")
      .mockRejectedValueOnce(new Error("Update Error"));

    const res = await request(app).put("/api/ranges/9999").send({
      fee: 2.5,
    });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Update Error");
  });

  test("DELETE /api/ranges/:id - should handle deleteFee errors", async () => {
    jest
      .spyOn(feeService, "deleteFee")
      .mockRejectedValueOnce(new Error("Delete Error"));

    const res = await request(app).delete("/api/ranges/9999");

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Delete Error");
  });
});
