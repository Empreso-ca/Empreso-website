"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function CopyUserId({ userId }: { userId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(userId);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <code className="overflow-x-auto text-sm text-zinc-300">
        {userId}
      </code>

      <button
        onClick={handleCopy}
        className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm transition hover:border-zinc-600 hover:bg-zinc-700"
      >
        {copied ? (
          <>
            <Check size={16} className="text-green-400" />
            Copied
          </>
        ) : (
          <>
            <Copy size={16} />
            Copy
          </>
        )}
      </button>
    </div>
  );
}