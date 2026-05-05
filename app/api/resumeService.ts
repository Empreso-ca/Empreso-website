'use server'
import { supabase } from "@/lib/supabase";

const BUCKET = "resumes";

export const getResumeFromSupabase = async (userId: string) => {
  // console.log("Fetching resume for:", userId);

  const safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, "_");

  const possiblePaths = [
    `${safeUserId}/resume.pdf`,
    `${safeUserId}/resume.doc`,
    `${safeUserId}/resume.docx`,
  ];

  for (const path of possiblePaths) {
    // console.log("Checking path:", path);

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, 60 * 60);

    if (!error && data?.signedUrl) {
      return data.signedUrl;
    }
  }

  console.log("No resume found");
  return null;
};