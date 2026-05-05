"use client";

import { useTransition } from "react";
import { createApplication } from "@/app/api/applications";

export default function ApplyActions({ userId, jobId } : { userId : string, jobId : number }) {
  const [isPending, startTransition] = useTransition();

  const handleApply = () => {
    startTransition(async () => {
      await createApplication(userId, jobId);
    });
  };

  return (
    <button
      onClick={handleApply}
      disabled={isPending}
      className="w-full bg-white text-black py-2 rounded-lg font-medium"
    >
      {isPending ? "Applying..." : "Apply Now"}
    </button>
  );
}