"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

type ProgressEvent = {
  step: string;
  message: string;
  pct?: number;
};

type ResumeSource = {
  id: string; // "master" | "7" (profile id, raw — see toSourceRef)
  type: "master" | "profile";
  name: string;
};

const UPLOAD_OPTION = "__upload__";

// Backend wire format is "master" | "profile:{id}" | "upload:{id}" — see
// ResumeSourceRef.parse() in app/schemas/resume_ref.py. /resume/sources
// returns raw ids ("master", "7"), so this is the one place that builds
// the wire-format string the pipeline endpoint expects.
function toSourceRef(source: ResumeSource): string {
  return source.type === "master" ? "master" : `profile:${source.id}`;
}

export default function Page() {
  const { getToken } = useAuth();

  const [sources, setSources] = useState<ResumeSource[]>([]);
  const [sourcesLoading, setSourcesLoading] = useState(true);
  const [selectedSourceRef, setSelectedSourceRef] = useState<string>("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [logs, setLogs] = useState<ProgressEvent[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const addLog = (log: ProgressEvent) => setLogs((prev) => [...prev, log]);

  useEffect(() => {
    (async () => {
      const token = await getToken({ template: "fastapi" });
      if (!token) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resume/sources`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: ResumeSource[] = await res.json();
        setSources(data);
        if (data.length > 0) setSelectedSourceRef(toSourceRef(data[0]));
      } catch {
        // No sources yet (e.g. brand new account) isn't an error state —
        // just falls through to upload-only.
      } finally {
        setSourcesLoading(false);
      }
    })();
  }, [getToken]);

  const isUploadSelected = selectedSourceRef === UPLOAD_OPTION;

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]); // strip the data: URL prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const generateResume = async () => {
    const token = await getToken({ template: "fastapi" });
    if (!token) return;

    setErrorMsg(null);

    let sourceRef = selectedSourceRef;
    let uploadedPdfBase64: string | undefined;

    if (isUploadSelected) {
      if (!uploadFile) {
        setErrorMsg("Choose a PDF to upload first.");
        return;
      }
      sourceRef = `upload:${crypto.randomUUID()}`;
      uploadedPdfBase64 = await fileToBase64(uploadFile);
    }

    if (!sourceRef) {
      setErrorMsg("Select a resume source first.");
      return;
    }

    setLoading(true);
    setLogs([]);
    setPdfUrl(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cvpipeline/stream`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source_ref: sourceRef,
            company,
            role,
            job_description: jobDescription,
            uploaded_pdf_base64: uploadedPdfBase64,
          }),
        }
      );

      if (!response.body) throw new Error("No stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const chunk of events) {
          const lines = chunk.split("\n");

          let eventName = "";
          let eventData = "";

          for (const line of lines) {
            if (line.startsWith("event:"))
              eventName = line.replace("event:", "").trim();

            if (line.startsWith("data:"))
              eventData = line.replace("data:", "").trim();
          }

          if (!eventData) continue;

          const parsed = JSON.parse(eventData);

          if (eventName === "progress") {
            addLog(parsed);
          }

          if (eventName === "error") {
            setErrorMsg(parsed.message || "Pipeline failed");
          }

          if (eventName === "result") {
            setSessionId(parsed.session_id);

            const binary = atob(parsed.pdf_base64);
            const bytes = new Uint8Array(binary.length);

            for (let i = 0; i < binary.length; i++) {
              bytes[i] = binary.charCodeAt(i);
            }

            const blob = new Blob([bytes], {
              type: "application/pdf",
            });

            setPdfUrl(URL.createObjectURL(blob));

            addLog({
              step: "complete",
              message: "Resume generated successfully",
              pct: 100,
            });
          }
        }
      }
    } catch {
      addLog({
        step: "error",
        message: "Failed to generate resume",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-full bg-background text-foreground transition-colors">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.06),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_45%)]" />

      <div className="relative max-w-5xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-semibold">AI Resume Generator</h1>
          <p className="text-sm text-muted-foreground mt-1">
            ATS-optimized CV generation with AI reasoning
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 backdrop-blur p-5 space-y-4">
          {/* Source selection — required by the pipeline; not optional */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Resume Source</label>
            <select
              className="w-full rounded-md border border-border bg-background p-2 text-sm"
              value={selectedSourceRef}
              onChange={(e) => setSelectedSourceRef(e.target.value)}
              disabled={sourcesLoading}
            >
              {sources.map((s) => (
                <option key={s.id} value={toSourceRef(s)}>
                  {s.name}
                </option>
              ))}
              <option value={UPLOAD_OPTION}>Upload New Resume</option>
            </select>

            {isUploadSelected && (
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                className="text-sm"
              />
            )}
          </div>

          <div className="flex gap-4">
            <Input
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />

            <Input
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <Textarea
            placeholder="Paste Job Description..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[180px]"
          />

          {errorMsg && (
            <p className="text-sm text-destructive">{errorMsg}</p>
          )}

          <Button
            onClick={generateResume}
            disabled={
              loading ||
              !company ||
              !role ||
              !jobDescription ||
              !selectedSourceRef ||
              (isUploadSelected && !uploadFile)
            }
            className="w-full"
          >
            {loading ? "Generating..." : "Generate Resume"}
          </Button>
        </div>

        {logs.length > 0 && (
          <div className="rounded-2xl border border-border bg-card/60 backdrop-blur p-5 space-y-3">
            <div className="text-sm text-muted-foreground">AI workflow stream</div>

            {logs.map((log, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="h-2 w-2 mt-2 rounded-full bg-muted-foreground animate-pulse" />
                <div>
                  <p>{log.message}</p>
                  {log.pct !== undefined && (
                    <span className="text-xs text-muted-foreground">{log.pct}%</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {pdfUrl && (
          <div className="space-y-3">
            <iframe src={pdfUrl} className="w-full h-[800px] rounded-xl border border-border" />

            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Session: {sessionId}</span>

              <Link href={`/console/cv-builder/editor?session=${sessionId}`}>
                <Button variant="outline" size="sm">
                  Open Editor
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}