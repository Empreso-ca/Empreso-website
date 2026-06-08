"use server"
import { auth, clerkClient } from "@clerk/nextjs/server";

export const getUserId = async () => {
  const { userId } = await auth();
  return userId;
};


export async function getUser() {
  const userId = await getUserId();
  if (!userId) return null;
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return user;
}



export async function getUserResume(
  userId: string
): Promise<string | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/resume`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch resume");
    }

    const data = await response.json();

    return data.resume;
  } catch (error) {
    console.error("API error in getUserResume:", error);
    throw new Error("Unable to fetch Resume at the moment");
  }
}