'use client';

import { applyToJob } from '@/app/jobs/_actions';
import { Button } from '@/components/ui/Button';

export default function ApplyActions({
  userId,
  jobId,
}: {
  userId: string;
  jobId: number;
}) {
  return (
    <form action={applyToJob} className="w-full">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="jobId" value={jobId} />

      <Button className="w-full mt-4">
        Apply Now
      </Button>
    </form>
  );
}