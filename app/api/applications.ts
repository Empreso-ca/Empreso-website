'use server'

import { prisma } from '@/lib/prisma';
import { Application } from '@/lib/types';

export async function getApplication(userId: string, jobId: number) : Promise<Application | null> {
  const application = await prisma.application.findFirst({
    where: {
      userId,
      jobId,
    },
  });

  if (!application) return null;

  return {
    ...application,
    resume: application.resume ?? undefined,
  };
}


export async function createApplication(userId: string, jobId: number) {
  // prevent duplicate applications
  const existing = await prisma.application.findFirst({
    where: { userId, jobId },
  });

  if (existing) {
    return existing;
  }

  return await prisma.application.create({
    data: {
      userId,
      jobId,
      status: "PENDING",
    },
  });
}