"use server";

import { currentUser } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

const BUCKET = "resumes";

export async function uploadResumeAction(formData: FormData): Promise<{ url: string }> {
  const user = await currentUser();
  if (!user) throw new Error("Authentication required.");

  const file = formData.get("resume") as File | null;
  if (!file || file.size === 0) throw new Error("No file provided.");

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only PDF and Word documents are accepted.");
  }

  const MAX_MB = 5;
  if (file.size > MAX_MB * 1024 * 1024) {
    throw new Error(`File must be under ${MAX_MB}MB.`);
  }

  // Supabase Storage rules:
  // - Path must NOT start with "/"
  // - Each segment must be non-empty
  // - Safe chars: a-z A-Z 0-9 - _ .
  const safeUserId = user.id.replace(/[^a-zA-Z0-9_-]/g, "_");
  const ext = (file.name.split(".").pop() ?? "pdf").toLowerCase();
  const storagePath = `users/${safeUserId}/master/latest_resume.${ext}`; // e.g. "users/user_2abc/master/resume.pdf"

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    console.error("[resume-upload] Supabase error:", {
      message: error.message,
      storagePath,
      bucket: BUCKET,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    });
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return { url: data.publicUrl };
}