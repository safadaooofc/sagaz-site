import { prisma } from "./prisma";

export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ success: boolean; current: number }> {
  const now = new Date();
  
  // Clean up expired records for this key
  await prisma.rateLimit.deleteMany({
    where: {
      key,
      expire: {
        lt: now
      }
    }
  });

  const record = await prisma.rateLimit.upsert({
    where: { key },
    update: {
      points: { increment: 1 }
    },
    create: {
      key,
      points: 1,
      expire: new Date(now.getTime() + windowMs)
    }
  });

  if (record.points > limit) {
    return { success: false, current: record.points };
  }

  return { success: true, current: record.points };
}
