import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { useAuth } from "@clerk/nextjs";

export async function GET() {
  const { userId, getToken } = await auth();
  
  if (!userId) {
    return NextResponse.json({ isPro: false });
  }
  
  // const token = await getToken({ template : "fastapi" });
  // console.log(token);

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