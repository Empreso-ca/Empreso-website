'use server'
import { prisma } from "@/lib/prisma";

export async function getJobs() {
  try {
    return await prisma.job.findMany({
      where: { status: "ACTIVE" },
      orderBy: { postedAt: "desc" },
    });
  } catch (error) {
    console.error("Database error in getJobs:", error);
    throw new Error("Unable to fetch jobs at the moment");
  }
}

export async function getJobById(jobId: number) {
  if (!jobId || isNaN(jobId)) {
    throw new Error('Invalid job ID');
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      title: true,
      companyName: true,
      description: true,
      location: true,
      jobType: true,
      salaryRange: true,
      postedAt: true,
    },
  });

  if (!job) {
    throw new Error('Job not found');
  }

  return job;
}

