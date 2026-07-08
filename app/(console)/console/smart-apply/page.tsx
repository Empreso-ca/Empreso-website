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
import { EmpressoLogo } from "@/components/EmpressoLogo";

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
      <div className="space-y-8 py-12">
        {/* AI Loading State */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mx-auto flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <Link href="/">
                <EmpressoLogo className="h-24 w-auto pb-1 text-foreground" />
              </Link>
              <span className="text-muted-foreground/50 text-lg font-light">
                /
              </span>
              <span className="text-sm font-medium tracking-[0.3em] pt text-muted-foreground uppercase">
                AI
              </span>
            </div>
        </div>

          <h3 className="mt-6 text-lg font-semibold">
            Optimizing Jobs openings for you
          </h3>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Matching opportunities based on your profile and preferences...
          </p>

          {/* Shimmer Loader */}
          <div className="mt-6 h-1.5 w-72 overflow-hidden rounded-full bg-muted">
            <div className="relative h-full w-full overflow-hidden">
              <div className="absolute inset-y-0 w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-primary/70 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Job Card Skeletons */}
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-lg border bg-muted/30"
            />
          ))}
        </div>
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