"use server";

import { currentUser } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";


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

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File must be under 5MB.");
  }

  const safeUserId = user.id.replace(/[^a-zA-Z0-9_-]/g, "_");
  const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";

  const storagePath = `users/${safeUserId}/master/resume.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from("resumes")
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from("resumes")
    .getPublicUrl(storagePath);

  const publicUrl = data.publicUrl;

  return { url: publicUrl };
}