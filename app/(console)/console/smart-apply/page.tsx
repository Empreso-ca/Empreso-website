"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

import {
  Table,
  THead,
  TH,
  TR,
  TD,
  EmptyState,
  Badge,
} from "@/components/ui/primitives";

import { fmtDate } from "@/lib/utils";
import { Job } from "@/lib/types";
import { loadSmartApplyJobs } from "@/lib/api-client";
import { useProfile } from "@/context/ProfileContext";

export default function Page() {
  const { userId, isLoaded } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const {activeProfile} = useProfile();

  useEffect(() => {
    if (!isLoaded || !userId) return;

    async function loadJobs() {
      try {
        setLoading(true);
        const data = await loadSmartApplyJobs(userId as string);
        const rows: Job[] = data.jobs ?? data;
        setJobs(rows);
        setTotal(data.total ?? rows.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, [userId, isLoaded, activeProfile]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 w-72 rounded bg-muted" />
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-lg border bg-muted/30"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-3 m-5">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Smart Apply Jobs
          </h2>
          <p className="text-sm text-muted-foreground">
            {total.toLocaleString()} total
          </p>
        </div>
      </header>

      {jobs.length === 0 ? (
        <EmptyState title="No jobs" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Title</TH>
              <TH>Company</TH>
              <TH>Location</TH>
              <TH>Type</TH>
              <TH>Source</TH>
              <TH>Posted</TH>
              {/* <TH></TH> */}
            </TR>
          </THead>

          <tbody>
            {jobs.map((job) => (
              <TR key={job.id}>
                <TD className="font-medium">{job.title}</TD>

                <TD className="text-muted-foreground">
                  {job.company?.name ?? "—"}
                </TD>

                <TD className="text-muted-foreground">
                  {job.location ?? (job.remote ? "Remote" : "—")}
                </TD>

                <TD>
                  {job.job_type ? <Badge>{job.job_type}</Badge> : "—"}
                </TD>

                <TD className="text-xs text-muted-foreground">
                  {job.source ?? "—"}
                </TD>

                <TD className="text-muted-foreground">
                  {fmtDate(job.posted_at)}
                </TD>

                {/* <TD className="text-right">
                  <Link
                    href={`/admin/jobs/${job.id}`}
                    className="text-xs hover:underline"
                  >
                    View
                  </Link>
                </TD> */}
              </TR>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
// 6304132234