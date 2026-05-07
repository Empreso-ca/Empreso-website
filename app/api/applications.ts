'use server'

import { prisma } from '@/lib/prisma';
import { Application } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';

const BUCKET = "resumes"

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


export async function createApplication(formData: FormData) {
  const userId = formData.get("userId") as string;
  const jobId = Number(formData.get("jobId"));
  const newResume = formData.get("newResume") as File;

  if (!userId || !jobId) return;

  const existing = await prisma.application.findFirst({
    where: { userId, jobId },
  });

  if (existing) return;

  let resumeUrl: string | null = null;

  if (newResume && newResume.size > 0) {
    const filePath = `users/${userId}/application/job-${jobId}/${newResume.name}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, newResume, {
        upsert: true,
        contentType: newResume.type,
      });

    if (error) {
      console.error("Upload error:", error);
      return;
    }

    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath);

    resumeUrl = data.publicUrl;
  }

  const user = await prisma.user.findUnique({
    where: { userId },
    select: { resume: true },
  });

  const finalResume = resumeUrl || user?.resume;

  if (!finalResume) return;

  await prisma.application.create({
    data: {
      userId,
      jobId,
      resume: finalResume,
      status: "PENDING",
    },
  });
  
  revalidatePath(`/jobs/verify-details/${jobId}`);
}
