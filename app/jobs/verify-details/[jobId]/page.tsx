import { getResumeFromSupabase } from '@/app/api/resumeService';
import { getUserId } from '../../_actions';
import NewResume from '@/components/NewResume';
import { Card } from '@/components/ui/Card';
import { getJobById } from '@/app/api/Jobs';
import { getApplication } from '@/app/api/applications';
import ApplyActions from '@/components/ApplyAction';
import { OpenResumeButton } from '@/components/OpenResumeButton';
import MarkdownRenderer from '@/components/MarkdownRenderer';

const Page = async ({ params }: { params: { jobId: string } }) => {
  const { jobId } = await params;
  const jobIdNumber = Number(jobId);

  if (!jobIdNumber) {
    return <div className="p-10 text-center">Invalid job ID</div>;
  }
  
  
  const [job, userId] = await Promise.all([
    getJobById(jobIdNumber),
    getUserId(),
  ]);

  if (!userId) {
    return <div className="p-10 text-center">Unauthorized</div>;
  }

  const [application, resumeUrl] = await Promise.all([
    getApplication(userId, jobIdNumber),
    getResumeFromSupabase(userId).catch(() => null),
  ]);

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

            {resumeUrl && (
              <div className="mt-6 flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium">Your Resume</p>
                  <p className="text-xs text-muted-foreground">
                    Uploaded document
                  </p>
                </div>

                <OpenResumeButton url={resumeUrl} />
              </div>
            )}
          </Card>
        )}

        {/* APPLY FLOW */}
        {!alreadyApplied && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Existing Resume */}
            {resumeUrl && (
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

                  <OpenResumeButton url={resumeUrl} />
                </div>

                <ApplyActions userId={userId} jobId={jobIdNumber} />
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

              <NewResume
                userId={userId}
                jobId={jobIdNumber.toString()}
              />
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