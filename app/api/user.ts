"use server"
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const getUserId = async () => {
  const { userId } = await auth();
  return userId;
};



export async function getUserResume(userId: string): Promise<string | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { userId },
      select: { resume: true },
    });

    if (!user || !user.resume) {
      throw new Error("Resume not found");
    }

    return user.resume;
  } catch (error) {
    console.error("Database error in getUserResume:", error);
    throw new Error("Unable to fetch Resume at the moment");
  }
}