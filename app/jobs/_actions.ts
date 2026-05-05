'use server';
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function applyToJob(formData: FormData) {
  const userId = formData.get("userId") as string;
  const jobId = Number(formData.get("jobId"));

  if (!userId || !jobId) return;

  const existing = await prisma.application.findFirst({
    where: { userId, jobId },
  });

  if (existing) return;

  const user = await prisma.user.findUnique({
    where: { userId },
    select: { resume: true },
  });

  if (!user?.resume) return;

  await prisma.application.create({
    data: {
      userId,
      jobId,
      resume: user.resume,
      status: "PENDING",
    },
  });

  revalidatePath(`/jobs/${jobId}`);
}
