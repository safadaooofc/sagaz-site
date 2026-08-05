import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const config = await prisma.adminConfig.findUnique({
      where: { key: "mines_active" }
    });
    const isActive = config?.value === "true";
    return NextResponse.json({ isActive });
  } catch (err) {
    return NextResponse.json({ isActive: false });
  }
}
