import { PrismaClient } from "@prisma/client";

class PrismaService {
  private static instance: PrismaClient;

  private constructor() {}

  public static getClient(): PrismaClient {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaClient();
      console.log("✅ Prisma Client Connected");
    }
    return PrismaService.instance;
  }
}

export default PrismaService;