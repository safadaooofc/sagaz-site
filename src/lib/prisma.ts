import { PrismaClient } from "@prisma/client"
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma2 = globalThis as unknown as { prisma2: PrismaClient }

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

export const prisma = globalForPrisma2.prisma2 || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") globalForPrisma2.prisma2 = prisma

export default prisma
