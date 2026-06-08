"use client";

import * as React from "react";
import { useState } from "react";
import {
  Download,
  FileText,
  Copy,
  Check,
  Eye,
  Code,
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

export default function CVEditorPage() {
  const { getToken } = useAuth();
  const { theme } = useTheme();

  const [latexCode, setLatexCode] = useState(defaultLatexTemplate);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [isCompilingPreview, setIsCompilingPreview] = useState(false);
  const [compilationError, setCompilationError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showLoadedBanner, setShowLoadedBanner] = useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem("cvLatexCode");
    if (saved) {
      setLatexCode(saved);
      localStorage.removeItem("cvLatexCode");
      setShowLoadedBanner(true);
      setTimeout(() => setShowLoadedBanner(false), 8000);
    }
  }, []);

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
      {/* subtle glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.06),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_45%)]" />

      <div className="relative max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold">
            LaTeX CV Editor
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Edit, compile and preview your resume in real-time
          </p>
        </div>

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

        {/* LOADED BANNER */}
        {showLoadedBanner && (
          <div className="rounded-lg border border-border bg-card p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4" />
              LaTeX loaded from previous session
            </div>
            <button onClick={() => setShowLoadedBanner(false)}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        )}

        {/* ERROR */}
        {compilationError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div>
              <p className="font-medium text-destructive">
                Compilation Error
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {compilationError}
              </p>
            </div>
          </div>
        )}

        {/* MAIN EDITOR */}
        <div className="h-[80vh] border border-border rounded-xl overflow-hidden bg-card/50 backdrop-blur">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">

            {/* EDITOR */}
            <motion.div
              className={cn(
                "border-r border-border",
                !showPreview && "lg:col-span-2"
              )}
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

            {/* PREVIEW */}
            <motion.div className={cn(!showPreview && "hidden")}>
              <div className="p-3 border-b border-border flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Preview</span>
              </div>

              <div className="h-full flex items-center justify-center bg-muted/20">
                {pdfUrl ? (
                  <iframe
                    src={pdfUrl}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="text-center space-y-3">
                    <FileText className="h-10 w-10 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Compile to preview PDF
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleCompilePreview}
                    >
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