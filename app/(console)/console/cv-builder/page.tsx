"use client";

import { useState } from "react";
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

export default function Page() {
  const { getToken } = useAuth();

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [logs, setLogs] = useState<ProgressEvent[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const addLog = (log: ProgressEvent) =>
    setLogs((prev) => [...prev, log]);

  const generateResume = async () => {
    const token = await getToken({ template: "fastapi" });
    if (!token) return;

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
            company,
            role,
            job_description: jobDescription,
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

            if (parsed.latex) {
              localStorage.setItem("cvLatexCode", parsed.latex);
            }

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
      {/* subtle glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.06),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_45%)]" />

      <div className="relative max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold">
            AI Resume Generator
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            ATS-optimized CV generation with AI reasoning
          </p>
        </div>

        {/* Input Card */}
        <div className="rounded-2xl border border-border bg-card/60 backdrop-blur p-5 space-y-4">
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

          <Button
            onClick={generateResume}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Generating..." : "Generate Resume"}
          </Button>
        </div>

        {/* Logs */}
        {logs.length > 0 && (
          <div className="rounded-2xl border border-border bg-card/60 backdrop-blur p-5 space-y-3">
            <div className="text-sm text-muted-foreground">
              AI workflow stream
            </div>

            {logs.map((log, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="h-2 w-2 mt-2 rounded-full bg-muted-foreground animate-pulse" />
                <div>
                  <p>{log.message}</p>
                  {log.pct !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      {log.pct}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PDF */}
        {pdfUrl && (
          <div className="space-y-3">
            <iframe
              src={pdfUrl}
              className="w-full h-[800px] rounded-xl border border-border"
            />

            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Session: {sessionId}</span>

              <Link href="/cv-builder/editor">
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