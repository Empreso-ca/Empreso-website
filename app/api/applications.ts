'use server'

export async function getApplication(userId: string, jobId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/application/get`,
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
    `${process.env.NEXT_PUBLIC_API_URL}/application/create`,
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
