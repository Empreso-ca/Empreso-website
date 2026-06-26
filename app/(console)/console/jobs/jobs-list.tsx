"use client";

import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { useJobs } from "./hooks/useJobs";
import Filters from "./filters";

export default function JobsList() {
  const [filters, setFilters] = useState({
    q: "",
    location: "",
    company: "",
    source: "",
    jobType: "",
    remote: "",
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useJobs(filters);

  const { ref } = useInView({
    threshold: 0,
  });

  const jobs =
    data?.pages.flatMap((page) => page.items) ?? [];

  console.log(jobs);
  

  if (hasNextPage) {
    fetchNextPage();
  }

  return (
    <div className="space-y-6">
      <Filters
        filters={filters}
        setFilters={setFilters}
      />

      <div className="rounded border">
        <table className="w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Type</th>
              <th>Source</th>
              <th>Posted</th>
            </tr>
          </thead>

          <tbody>
            {jobs
              .filter(Boolean)
              .map((job: any) => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.company}</td>
                  <td>{job.remote ? "Remote" : job.location}</td>
                  <td>{job.job_type}</td>
                  <td>{job.source}</td>
                  <td>{new Date(job.posted_at).toLocaleDateString()}</td>
                </tr>
              ))}
          </tbody>
        </table>

        {isLoading && (
          <div className="p-4">
            Loading...
          </div>
        )}

        <div ref={ref} />

        {isFetchingNextPage && (
          <div className="p-4">
            Loading more jobs...
          </div>
        )}
      </div>
    </div>
  );
}