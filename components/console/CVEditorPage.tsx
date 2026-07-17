"use client";

import * as React from "react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Download,
  FileText,
  Copy,
  Check,
  Eye,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { compileLaTeX } from "@/lib/api-client";
import { useAuth } from "@clerk/nextjs";

const defaultLatexTemplate = ``;

function base64ToPdfBlobUrl(base64: string): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes], { type: "application/pdf" });
  return URL.createObjectURL(blob);
}

export default function CVEditorPage() {
  const { getToken } = useAuth();
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");

  const [latexCode, setLatexCode] = useState(defaultLatexTemplate);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [isCompilingPreview, setIsCompilingPreview] = useState(false);
  const [compilationError, setCompilationError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showLoadedBanner, setShowLoadedBanner] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(!!sessionId);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [atsWarning, setAtsWarning] = useState<string | null>(null);

  // Replaces the old localStorage.getItem("cvLatexCode") handoff. The
  // generator page no longer writes to localStorage at all — this fetches
  // the same data from the backend by session id instead. See
  // GET /cvpipeline/session/{session_id} — currently backed by an
  // in-memory store (won't survive a restart / multi-worker deploy, see
  // that endpoint's docstring for the real fix).
  React.useEffect(() => {
    if (!sessionId) return;

    (async () => {
      setSessionLoading(true);
      setSessionError(null);
      try {
        const token = await getToken({ template: "fastapi" });
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/cvpipeline/session/${sessionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? "This session has expired or wasn't found."
              : `Failed to load session (${res.status})`
          );
        }

        const data = await res.json();

        setLatexCode(data.latex ?? "");
        if (data.pdf_base64) setPdfUrl(base64ToPdfBlobUrl(data.pdf_base64));

        if (data.ats_validation && data.ats_validation.passed === false) {
          setAtsWarning(
            `ATS validation flagged possible issues (text coverage: ${Math.round(
              (data.ats_validation.coverage_ratio ?? 0) * 100
            )}%). Worth a manual check before sending this out.`
          );
        }

        setShowLoadedBanner(true);
        setTimeout(() => setShowLoadedBanner(false), 8000);
      } catch (err) {
        setSessionError(
          err instanceof Error ? err.message : "Failed to load session"
        );
      } finally {
        setSessionLoading(false);
      }
    })();
  }, [sessionId, getToken]);

  const handleCopy = () => {
    navigator.clipboard.writeText(latexCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTex = () => {
    const blob = new Blob([latexCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.tex";
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleCompilePreview = async () => {
    setIsCompilingPreview(true);
    setCompilationError(null);

    const token = await getToken({ template: "fastapi" });

    try {
      const blob = await compileLaTeX(latexCode, token);
      const url = URL.createObjectURL(blob);

      if (pdfUrl) URL.revokeObjectURL(pdfUrl);

      setPdfUrl(url);
    } catch (err) {
      setCompilationError(
        err instanceof Error ? err.message : "Compilation failed"
      );
      setPdfUrl(null);
    } finally {
      setIsCompilingPreview(false);
    }
  };

  return (
    <div className="h-full bg-background text-foreground transition-colors">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.06),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_45%)]" />

      <div className="relative max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">LaTeX CV Editor</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Edit, compile and preview your resume in real-time
          </p>
        </div>

        {sessionLoading && (
          <div className="rounded-lg border border-border bg-card p-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading your generated resume...
          </div>
        )}

        {sessionError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-muted-foreground">{sessionError}</p>
          </div>
        )}

        {/* TOOLBAR */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
            </Button>

            <Button variant="outline" size="sm" onClick={handleDownloadTex}>
              <Download className="h-4 w-4 mr-2" />
              .tex
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCompilePreview}
              disabled={isCompilingPreview}
            >
              {isCompilingPreview ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Compiling...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Compile
                </>
              )}
            </Button>

            <Button
              size="sm"
              className={theme === "dark" ? "bg-white text-black" : ""}
              disabled={!pdfUrl}
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        {showLoadedBanner && (
          <div className="rounded-lg border border-border bg-card p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4" />
              Resume loaded
            </div>
            <button onClick={() => setShowLoadedBanner(false)}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        )}

        {atsWarning && (
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <p className="text-sm text-muted-foreground">{atsWarning}</p>
          </div>
        )}

        {compilationError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Compilation Error</p>
              <p className="text-sm text-muted-foreground mt-1">{compilationError}</p>
            </div>
          </div>
        )}

        {/* MAIN EDITOR — hand-editing LaTeX directly here is a known
            architectural gap: edits made in this textarea are NOT
            reflected back into ResumeData, so they won't survive a future
            AI re-optimization pass, which regenerates LaTeX FROM
            ResumeData. This is a stopgap until the structured
            ResumeData-driven editor (per the original spec) replaces this
            view. */}
        <div className="h-[80vh] border border-border rounded-xl overflow-hidden bg-card/50 backdrop-blur">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            <motion.div
              className={cn("border-r border-border", !showPreview && "lg:col-span-2")}
            >
              <div className="p-3 border-b border-border flex justify-between">
                <span className="text-sm font-medium">LaTeX</span>
                <span className="text-xs text-muted-foreground">
                  {latexCode.split("\n").length} lines
                </span>
              </div>

              <Textarea
                value={latexCode}
                onChange={(e) => setLatexCode(e.target.value)}
                className="h-full w-full border-0 rounded-none font-mono text-sm p-4 focus-visible:ring-0 bg-transparent"
              />
            </motion.div>

            <motion.div className={cn(!showPreview && "hidden")}>
              <div className="p-3 border-b border-border flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Preview</span>
              </div>

              <div className="h-full flex items-center justify-center bg-muted/20">
                {pdfUrl ? (
                  <iframe src={pdfUrl} className="w-full h-full" />
                ) : (
                  <div className="text-center space-y-3">
                    <FileText className="h-10 w-10 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">Compile to preview PDF</p>
                    <Button variant="outline" onClick={handleCompilePreview}>
                      Compile
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}