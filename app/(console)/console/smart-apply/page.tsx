"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Table,
  THead,
  TH,
  TR,
  TD,
  EmptyState,
} from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { getSmartRecommendedJobs } from "@/lib/api-client";
import { useProfile } from "@/context/ProfileContext";

type RecommendedJob = {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  remote: boolean;
  job_type: string | null;
  salary: string | null;
  posted_at: string;
  application_url: string;
  score: number;
  matched_skills: string[];
};

export type RecommendedResponse = {
  count: number;
  jobs: RecommendedJob[];
};

export default function RecommendedJobsPage() {
  const { user, isLoaded } = useUser();
  const { activeProfile } = useProfile();
  const [jobs, setJobs] = useState<RecommendedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecommendedJobs = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError("");

      const data: RecommendedResponse = await getSmartRecommendedJobs(user.id);

      setJobs(data.jobs || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load recommended jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user?.id) {
      fetchRecommendedJobs();
    }
  }, [isLoaded, user?.id, activeProfile]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const scoreVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "outline";
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center py-10">
        <p className="text-sm text-muted-foreground">
          Loading recommendations...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Recommended Jobs</h1>
        <p className="text-sm text-muted-foreground">
          {jobs.length} jobs matched to your profile
        </p>
      </header>

      {jobs.length === 0 ? (
        <EmptyState title="No recommendations found" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Title</TH>
              <TH>Company</TH>
              <TH>Location</TH>
              <TH>Type</TH>
              <TH>Match</TH>
              <TH>Skills</TH>
              <TH>Salary</TH>
              <TH>Posted</TH>
              <TH></TH>
            </TR>
          </THead>

          <tbody>
            {jobs.map((job) => (
              <TR key={job.id}>
                <TD className="font-medium">{job.title}</TD>

                <TD className="text-muted-foreground">
                  {job.company ?? "—"}
                </TD>

                <TD className="text-muted-foreground">
                  {job.location ?? (job.remote ? "Remote" : "—")}
                </TD>

                <TD>{job.job_type ?? "—"}</TD>

                <TD>
                  <Badge variant={scoreVariant(job.score)}>
                    {Math.round(job.score)}%
                  </Badge>
                </TD>

                <TD>
                  <div className="flex flex-wrap gap-1">
                    {job.matched_skills?.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}

                    {job.matched_skills?.length > 3 && (
                      <Badge variant="outline">
                        +{job.matched_skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </TD>

                <TD>{job.salary ?? "—"}</TD>

                <TD className="text-muted-foreground">
                  {formatDate(job.posted_at)}
                </TD>

                <TD className="text-right">
                  <a
                    href={job.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium hover:underline"
                  >
                    Apply
                  </a>
                </TD>
              </TR>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}