'use server';

export async function getJobs() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs`,
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
    `${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`,
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
