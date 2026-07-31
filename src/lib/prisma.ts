import { PrismaClient } from "@prisma/client"
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma5 = globalThis as unknown as { prisma5: PrismaClient }

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

export const prisma = globalForPrisma5.prisma5 || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") globalForPrisma5.prisma5 = prisma

export default prisma
