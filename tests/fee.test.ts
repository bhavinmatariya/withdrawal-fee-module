import request from "supertest";
import app from "../src/app";
import { PrismaClient } from "@prisma/client";
import * as rateService from "../src/services/rate.service";

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.withdrawalRateRange.deleteMany();
});

afterAll(async () => {
  await prisma.withdrawalRateRange.deleteMany();
  await prisma.$disconnect();
});

describe("Withdrawal Rate Module API", () => {
  test("POST /ranges - Create Rate Range", async () => {
    const res = await request(app).post("/api/ranges").send({
      minAmount: 1,
      maxAmount: 100,
      rate: 1.5,
    });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.rate).toBe("1.5");
  });

  test("GET /ranges - Get All Rates", async () => {
    const res = await request(app).get("/api/ranges");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("GET /api/ranges/getrate - Get Rate", async () => {
    const res = await request(app)
      .get("/api/ranges/getrate")
      .query({ amount: 50 });

    expect(res.status).toBe(200);
    expect(res.body.data).toBe("1.5");
  });

  test("PUT /api/ranges/:id - Update Rate Range", async () => {
    const rate = await prisma.withdrawalRateRange.findFirst();

    const res = await request(app).put(`/api/ranges/${rate!.id}`).send({
      rate: 2.0,
    });

    expect(res.status).toBe(200);
    expect(res.body.data.rate).toBe("2");
  });

  test("DELETE /api/ranges/:id - Delete Rate Range", async () => {
    const rate = await prisma.withdrawalRateRange.findFirst();

    const res = await request(app).delete(`/api/ranges/${rate!.id}`);

    expect(res.status).toBe(200);
  });

  test("POST /api/ranges/upload - Upload CSV Rates", async () => {
    const res = await request(app)
      .post("/api/ranges/upload")
      .attach(
        "file",
        Buffer.from("minimum,maximum,rate\n0,100,1.5"),
        "rates.csv"
      );

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("File uploaded successfully.");
  });

  test("POST /api/ranges/upload - Upload Excel Rates", async () => {
    const res = await request(app)
      .post("/api/ranges/upload")
      .attach("file", "tests/fixtures/rate.xlsx");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("File uploaded successfully.");
  });

  // test("POST /api/ranges/upload - No file uploaded", async () => {
  //   const res = await request(app).post("/api/ranges/upload");
  //   expect(res.status).toBe(500);
  //   expect(res.body.message).toBe("Please upload a CSV or Excel file.");
  // });

  test("GET /api/ranges/getrate - Amount not in range", async () => {
    const res = await request(app)
      .get("/api/ranges/getrate")
      .query({ amount: 99999 });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("No applicable rate range found for the specified amount.");
  });

  test("POST /api/ranges - Validation Error", async () => {
    const res = await request(app).post("/api/ranges").send({
      minAmount: -1,
      maxAmount: 100,
      rate: 1.5,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test("POST /api/ranges - should handle createRate errors", async () => {
    jest
      .spyOn(rateService, "createRate")
      .mockRejectedValueOnce(new Error("Unable to create rate range. Please try again later."));

    const res = await request(app).post("/api/ranges").send({
      minAmount: 0,
      maxAmount: 100,
      rate: 1.5,
    });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Unable to create rate range. Please try again later.");
  });

  test("PUT /api/ranges/:id - should handle updateRate errors", async () => {
    jest
      .spyOn(rateService, "updateRate")
      .mockRejectedValueOnce(new Error("Unable to update rate range. Please try again later."));

    const res = await request(app).put("/api/ranges/9999").send({
      rate: 2.5,
    });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Unable to update rate range. Please try again later.");
  });

  test("DELETE /api/ranges/:id - should handle deleteRate errors", async () => {
    jest
      .spyOn(rateService, "deleteRate")
      .mockRejectedValueOnce(new Error("Unable to delete rate range. Please try again later."));

    const res = await request(app).delete("/api/ranges/9999");

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Unable to delete rate range. Please try again later.");
  });
});
