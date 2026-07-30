import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET() {
  await prisma.user.updateMany({ where: { email: 'paoteste40@gmail.com' }, data: { role: 'OWNER' } });
  return NextResponse.json({ success: true });
}
