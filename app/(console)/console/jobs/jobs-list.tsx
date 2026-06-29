import Link from "next/link";
import Image from "next/image";
import { getFilteredJobs, getJobs } from "@/lib/api-client";
import { JobListPagination } from "@/components/console/jobs/pagination";
import { JobFilterParams } from "@/lib/types";

interface JobListProps {
  filters: JobFilterParams;
}

export async function JobList({ filters }: JobListProps) {
  const { items, total, page, total_pages } = await getFilteredJobs(filters);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
        <p className="text-sm font-medium text-foreground">No jobs match these filters</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try removing a filter to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {total.toLocaleString()} {total === 1 ? "job" : "jobs"} found
      </p>

      <ul className="space-y-3">
        {items.map((job) => (
          <li key={job.id}>
            <JobCard job={job} />
          </li>
        ))}
      </ul>

      <JobListPagination currentPage={page} totalPages={total_pages} />
    </div>
  );
}

function JobCard({ job }: { job: ReturnType<typeof Object> extends never ? never : import("@/lib/types").Job }) {
  return (
    <Link
      href={job.application_url ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary/50 hover:bg-muted/50"
    >
      <div className="flex items-start gap-4">
        {job.company?.logo_url && (
          <Image
            src={job.company.logo_url}
            alt={`${job.company.name} logo`}
            width={40}
            height={40}
            className="rounded-md border border-border object-contain"
          />
        )}

        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-foreground">{job.title}</h3>
            {job.posted_at && (
              <time
                dateTime={job.posted_at}
                className="shrink-0 text-xs text-muted-foreground"
              >
                {formatRelativeDate(job.posted_at)}
              </time>
            )}
          </div>

          {job.company?.name && (
            <p className="text-sm text-muted-foreground">{job.company.name}</p>
          )}

          <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-xs text-muted-foreground">
            {job.location && <span>{job.location}</span>}
            {job.remote && <span className="text-primary">Remote</span>}
            {job.job_type && <span>{formatJobType(job.job_type)}</span>}
            {job.salary_range && <span>{job.salary_range}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

function formatJobType(jobType: string): string {
  return jobType
    .toLowerCase()
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}