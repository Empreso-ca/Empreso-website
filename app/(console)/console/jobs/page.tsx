import { Suspense } from "react";
import { getJobFilterOptions } from "@/lib/api-client";
import { JobFilters } from "@/components/console/jobs/job-filters";
import { JobList } from "./jobs-list";

interface JobsPageProps {
  searchParams: Promise<{
    location?: string;
    department?: string;
    team?: string;
    job_type?: string;
    status?: string;
    company?: string;
    remote?: string;
    page?: string;
  }>;
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;

  // Fetched server-side on every page load — cheap because the route
  // is revalidated on a timer (see filters.ts), not per-request.
  const filterOptions = await getJobFilterOptions();

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
      <aside className="w-72 shrink-0">
        <JobFilters options={filterOptions} activeFilters={params} />
      </aside>

      <main className="flex-1">
        <Suspense fallback={<JobListSkeleton />}>
          <JobList filters={params} />
        </Suspense>
      </main>
    </div>
  );
}

function JobListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  );
}