'use server'
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Profile, UserPrefill, ProfileCreate, ProfileUpdate } from "./types";
import { RecommendedResponse } from "@/app/(console)/console/smart-apply/page";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


function authHeaders(token: string | null) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}


async function request<T>(path: string, init?: RequestInit): Promise<T> {
  // console.log(`Requesting api ${path}`);
  
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Request failed");
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}



// ------------------------------
// USER APIs
// ------------------------------

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
      `${API_URL}/users/${userId}/resume`,
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


// ------------------------------
// JOB APIs
// ------------------------------


export async function getJobs() {
  try {
    const response = await fetch(
      `${API_URL}/jobs`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }

    return await response.json();
  } catch (error) {
    console.error("API error in getJobs:", error);
    throw new Error("Unable to fetch jobs at the moment");
  }
}

export async function getJobById(jobId: number) {
  if (!jobId || isNaN(jobId)) {
    throw new Error("Invalid job ID");
  }

  const response = await fetch(
    `${API_URL}/jobs/${jobId}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    throw new Error("Job not found");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch job");
  }

  return await response.json();
}



// ------------------------------
// APPLICATION APIs
// ------------------------------

export async function getApplication(userId: string, jobId: number) {
  const res = await fetch(
    `${API_URL}/application/get`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        jobId,
      }),
      cache: "no-store",
    }
  );

  if (!res.ok) return null;

  const data = await res.json();

  return data
    ? {
        ...data,
        resume: data.resume ?? undefined,
      }
    : null;
}


export async function createApplication(formData: FormData) {
  const userId = formData.get("userId") as string;
  const jobId = Number(formData.get("jobId"));
  const newResume = formData.get("newResume") as File;

  if (!userId || !jobId) return;

  const apiForm = new FormData();

  apiForm.append("userId", userId);
  apiForm.append("jobId", String(jobId));

  if (newResume && newResume.size > 0) {
    apiForm.append("newResume", newResume);
  }

  const res = await fetch(
    `${API_URL}/application/create`,
    {
      method: "POST",
      body: apiForm,
    }
  );

  if (!res.ok) {
    console.error("Failed to create application");
    return;
  }

  const data = await res.json();

  return data;
}




// ----------------------------
// RESUME PDF & LATEX APIs
// ----------------------------


function pdfBase64ToUrl(pdfBase64: string): string {
  const binary = atob(pdfBase64);

  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  const blob = new Blob([bytes], {
    type: "application/pdf",
  });

  return URL.createObjectURL(blob);
}


async function compilePDFToBase64(
  reader: ReadableStreamDefaultReader<Uint8Array>
): Promise<string | undefined> {
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    buffer += decoder.decode(value, {
      stream: true,
    });

    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    for (const event of events) {
      const dataLine = event
        .split("\n")
        .find((line) => line.startsWith("data: "));

      if (!dataLine) continue;

      const payload = JSON.parse(
        dataLine.replace("data: ", "")
      );

      if (payload.latex) {
        localStorage.setItem(
          "cvLatexCode",
          payload.latex
        );
      }

      if (payload.pdf_base64) {
        return pdfBase64ToUrl(payload.pdf_base64);
      }
    }
  }
}

export async function generateResumePDFUrl(
  session_id: string,
  token: string | null
): Promise<string | undefined> {
  try {

    const response = await fetch(
      `${API_URL}/generate/stream`,
      {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({ session_id }),
      }
    );

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body is empty");
    }

    return compilePDFToBase64(reader);

  } catch (error) {
    console.error(error);
    throw error;
  }
}


export async function compileLaTeX(
  latex: string, 
  token: string | null
): Promise<Blob> {

  const response = await fetch(
    `${API_URL}/generate/compile`,
    {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({
        latex,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error.detail || "Compilation failed"
    );
  }

  const { pdf_base64 } = await response.json();

  const binary = atob(pdf_base64);

  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], {
    type: "application/pdf",
  });
}





// ----------------------------
//  PROFILEs APIS
// ----------------------------
 

export async function loadProfiles(userId: string) {
  const res = await request<Profile[]>(`/profiles${userId ? `?userId=${userId}` : ""}`);
  return res;
}

export async function profilePrefillUser(userId:string) {
  const res = await request<UserPrefill>(`/profiles/prefill/${userId}`);
  return res;
}
 

export const createProfile = async (data: ProfileCreate) => {
  const res = request<Profile>("/profiles", { method: "POST", body: JSON.stringify(data) })
  return res;
}


export const uploadProfileResume = async (
  profile_id: number | undefined,
  formData: FormData,
  token: string
): Promise<{ resumeUrl: string }> => {
  const res = await fetch(`${API_URL}/profiles/${profile_id}/resume`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({
      detail: res.statusText,
    }));
    throw new Error(err.detail ?? "Failed to upload resume");
  }

  return res.json();
};

export const updateProfile = async (id: number, data: ProfileUpdate) => {
  const res = await request<Profile>(`/profiles/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
  return res;
}


export const deleteProfile = async (id: number) => {
  const res = await request<void>(`/profiles/${id}`, { method: "DELETE" })
  return res;
}

export const activateProfile = async (id: number) => {
  const res = await request<Profile>(`/profiles/${id}/activate`, { method: "POST" })
  return res;
}

export const getProfile = async (id: number) => {
  const res = await request<Profile>(`/profiles/${id}`)
  return res;
}



export const getSmartRecommendedJobs = async (id: string) => {
  const res = await request<RecommendedResponse>(`/jobs/recommended?user_id=${id}`, { method: "GET" })
  return res;
}