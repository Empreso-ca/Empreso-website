"use client";

// Drop-in replacement for the StepResume function in _wizard.tsx
// Also requires a hidden input named "resume" in the parent form to carry the URL.

import { useRef, useState } from "react";
import { uploadResumeAction } from "./_upload";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-sm font-medium text-foreground">
      {children}
    </label>
  );
}

type UploadState =
  | { status: "idle" }
  | { status: "uploading"; progress: number }
  | { status: "done"; url: string; fileName: string }
  | { status: "error"; message: string };

export function StepResume({ saved }: { saved: Record<string, unknown> }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [upload, setUpload] = useState<UploadState>(
    saved.resume
      ? { status: "done", url: saved.resume as string, fileName: "Previously uploaded resume" }
      : { status: "idle" }
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUpload({ status: "uploading", progress: 0 });

    // Fake progress tick while upload runs (XHR would give real progress,
    // but server actions don't stream it — this keeps UX responsive)
    const ticker = setInterval(() => {
      setUpload((prev) =>
        prev.status === "uploading" && prev.progress < 85
          ? { status: "uploading", progress: prev.progress + 12 }
          : prev
      );
    }, 200);

    try {
      const fd = new FormData();
      fd.append("resume", file);
      const { url } = await uploadResumeAction(fd);
      clearInterval(ticker);
      setUpload({ status: "done", url, fileName: file.name });
    } catch (err) {
      clearInterval(ticker);
      setUpload({
        status: "error",
        message: err instanceof Error ? err.message : "Upload failed. Please try again.",
      });
    }
  };

  const handleRemove = () => {
    setUpload({ status: "idle" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isDone = upload.status === "done";

  return (
    <div className="space-y-4">
      {/* ── Resume Upload ── */}
      <div>
        <Label>Resume *</Label>

        {/* Hidden input carries the Supabase URL into the parent form's FormData */}
        <input
          type="hidden"
          name="resume"
          value={isDone ? upload.url : ""}
          required
        />

        {upload.status === "idle" || upload.status === "error" ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file && fileInputRef.current) {
                // Manually trigger change by setting files on input
                const dt = new DataTransfer();
                dt.items.add(file);
                fileInputRef.current.files = dt.files;
                fileInputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
              }
            }}
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/20 px-6 py-10 text-center transition-colors hover:border-foreground/40 hover:bg-muted/30"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Click to upload or drag and drop
              </p>
              <p className="mt-1 text-xs text-muted-foreground">PDF or Word document · max 5 MB</p>
            </div>
            {upload.status === "error" && (
              <p className="text-xs text-destructive">{upload.message}</p>
            )}
          </div>
        ) : upload.status === "uploading" ? (
          <div className="rounded-xl border border-border bg-muted/20 px-6 py-8">
            <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Uploading…</span>
              <span>{upload.progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-foreground transition-all duration-200"
                style={{ width: `${upload.progress}%` }}
              />
            </div>
          </div>
        ) : (
          /* done */
          <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/20 px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{upload.fileName}</p>
              <a
                href={upload.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
              >
                View uploaded file
              </a>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground"
              aria-label="Remove file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Actual file input — hidden, triggered by the drop zone */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* ── Source ── */}
      <div>
        <Label>How did you hear about us? *</Label>
        <select
          name="source"
          defaultValue={(saved.source as string) ?? ""}
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select source</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Google">Google Search</option>
          <option value="Friend / Referral">Friend / Referral</option>
          <option value="Social Media">Social Media</option>
          <option value="Job Board">Job Board</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* ── Comments ── */}
      <div>
        <Label>Anything else you'd like to share?</Label>
        <textarea
          name="comments"
          placeholder="Tell us anything that might help us match you better..."
          defaultValue={(saved.comments as string) ?? ""}
          rows={3}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      {/* ── Agreements ── */}
      <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="agreeTerms"
            defaultChecked={saved.agreeTerms as boolean}
            required
            className="mt-0.5 h-4 w-4 rounded border-border"
          />
          <span className="text-sm text-foreground">
            I agree to the{" "}
            <a href="/terms" className="underline underline-offset-2 hover:text-muted-foreground">Terms of Service</a>{" "}
            and{" "}
            <a href="/privacy" className="underline underline-offset-2 hover:text-muted-foreground">Privacy Policy</a> *
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="subscribeUpdates"
            defaultChecked={saved.subscribeUpdates as boolean}
            className="mt-0.5 h-4 w-4 rounded border-border"
          />
          <span className="text-sm text-muted-foreground">
            Send me job alerts and platform updates
          </span>
        </label>
      </div>
    </div>
  );
}