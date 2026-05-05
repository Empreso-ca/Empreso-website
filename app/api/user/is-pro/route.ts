"use server"
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ isPro: false });
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      plan: "PRO",
      isActive: true,
      OR: [
        { endDate: null },
        { endDate: { gt: new Date() } },
      ],
    },
    select: { id: true },
  });

  return NextResponse.json({ isPro: !!subscription });
}