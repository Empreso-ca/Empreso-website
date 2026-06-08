'use client'
import { getUserId, getUserResume } from '@/lib/user';
import NewResume from '@/components/NewResume';
import { Card } from '@/components/ui/Card';
import { getJobById } from '@/lib/jobs';
import { getApplication } from '@/lib/applications';
import ApplyActions from './ApplyAction';
import { OpenResumeButton } from '@/components/OpenResumeButton';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { use, useState, useEffect } from 'react';

type PageProps = {
  params: Promise<{
    jobId: string;
  }>;
};


const Page = ({ params }: PageProps) => {
  const { jobId } = use(params);
  const jobIdNumber = Number(jobId);
  const [newResumeFile, setNewResumeFile] = useState<File | null>(null);
  const [job, setJob] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userResumeUrl, setUserResumeUrl] = useState<string | null>(null);
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPageData = async () => {
    try {
      setLoading(true);

      const [jobData, fetchedUserId] =
        await Promise.all([
          getJobById(jobIdNumber),
          getUserId(),
        ]);

      if (!fetchedUserId) {
        setError('Unauthorized');
        setLoading(false);
        return;
      }

      setJob(jobData);
      setUserId(fetchedUserId);

      const [resumeUrl, applicationData] = await Promise.all([
        getUserResume(fetchedUserId),
        getApplication(fetchedUserId, jobIdNumber),
      ]);

      setUserResumeUrl(resumeUrl);
      setApplication(applicationData);

    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!jobIdNumber) {
      setError('Invalid job ID');
      setLoading(false);
      return;
    }
    loadPageData();
  }, [jobIdNumber]);

  // Loading UI
  if (!userId || loading) {
    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="p-10 text-center">
        {error}
      </div>
    );
  }

  const alreadyApplied = !!application;

  return (
    <div className="min-h-screen bg-neutral-950 border-t border-white/[0.1]">
      <div className="mx-auto max-w-5xl px-6 py-16">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-semibold">{job.title}</h1>
          <p className="text-muted-foreground mt-2">{job.companyName}</p>
        </div>

        {/* Already Applied */}
        {alreadyApplied && (
          <Card className="mt-10 p-6">
            <h2 className="text-green-400 font-semibold text-lg">
              Application Submitted
            </h2>

            <p className="text-sm text-muted-foreground mt-2">
              Status:{" "}
              <span className="text-white">{application.status}</span>
            </p>

            {application.resume && (
              <div className="mt-6 flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium">Your Resume</p>
                  <p className="text-xs text-muted-foreground">
                    Uploaded document
                  </p>
                </div>

                <OpenResumeButton url={application.resume} />
              </div>
            )}
          </Card>
        )}

        {/* APPLY FLOW */}
        {!alreadyApplied && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Existing Resume */}
            {userResumeUrl && (
              <Card className="p-6 flex flex-col gap-4">
                <h3 className="text-lg font-semibold">
                  Use existing resume
                </h3>

                <p className="text-sm text-muted-foreground">
                  Apply using your uploaded resume.
                </p>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Resume.pdf</p>
                    <p className="text-xs text-muted-foreground">
                      Ready to use
                    </p>
                  </div>

                  <OpenResumeButton url={userResumeUrl} />
                </div>

                <ApplyActions userId={userId} jobId={jobIdNumber} refresh={loadPageData}/>
              </Card>
            )}

            {/* Upload new resume */}
            <Card className="p-6 flex flex-col gap-4">
              <h3 className="text-lg font-semibold">
                Upload new resume
              </h3>

              <p className="text-sm text-muted-foreground">
                Use a fresh resume for better chances.
              </p>
              <NewResume onFileSelect={setNewResumeFile} />

              {newResumeFile && (
                <ApplyActions
                  userId={userId}
                  jobId={jobIdNumber}
                  newResume={newResumeFile}
                  refresh={loadPageData}
                />
              )}
            </Card>
          </div>
        )}

        <p>Job Description: </p>
        <div className="text-center my-10">
          <div className="px-6 pb-6 max-h-[40vh] overflow-y-auto text-sm sm:text-base">
            <MarkdownRenderer
              markdown={job.description}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Page;