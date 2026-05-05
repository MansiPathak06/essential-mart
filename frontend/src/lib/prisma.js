// Path: src/lib/prisma.js
import "dotenv/config";
import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { PrismaClient } = pkg;

// Connection Pool setup
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Prisma Client with Adapter
const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

export default prisma;