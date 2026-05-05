"use server"
import { auth } from "@clerk/nextjs/server";

export const getUserId = async () => {
  const { userId } = await auth();
  return userId;
};
