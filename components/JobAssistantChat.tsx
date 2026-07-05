"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EmpressoLogo } from "./EmpressoLogo";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import "highlight.js/styles/github-dark.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Stage = "understanding" | "search_jobs" | "get_company_info" | "career_advice" | "answer_faq" | "ranking" | null;

interface JobCard {
  job_id: string;
  title: string | null;
  company_name: string | null;
  location: string | null;
  remote: boolean | null;
  job_type: string | null;
  application_url: string | null;
  relevance_score: number | null;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  jobs?: JobCard[];
  isStreaming?: boolean;
}

const PIPELINE_STAGES: { key: Exclude<Stage, null>; label: string }[] = [
  { key: "understanding", label: "Understanding" },
  { key: "search_jobs", label: "Searching" },
  { key: "ranking", label: "Ranking" },
];

function humanizeJobType(jobType: string | null): string | null {
  if (!jobType) return null;
  return jobType
    .toLowerCase()
    .split("_")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

function JobResultCard({ job }: { job: JobCard }) {
  return (
    <div className="job-card">
      <div className="job-card__header">
        <span className="job-card__title">{job.title || "Untitled role"}</span>
        {job.relevance_score != null && (
          <span className="job-card__score" title="Relevance score">
            {Math.round(job.relevance_score * 10) / 10}
          </span>
        )}
      </div>
      {job.company_name && (
        <div className="job-card__company">{job.company_name}</div>
      )}
      <div className="job-card__tags">
        {job.location && <span className="tag">{job.location}</span>}
        {job.remote != null && (
          <span className="tag tag--accent">
            {job.remote ? "Remote" : "On-site"}
          </span>
        )}
        {job.job_type && <span className="tag">{humanizeJobType(job.job_type)}</span>}
      </div>
      {job.application_url ? (
        <a
          href={job.application_url}
          target="_blank"
          rel="noopener noreferrer"
          className="job-card__apply"
        >
          Apply
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 17L17 7M17 7H8M17 7V16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      ) : (
        <span className="job-card__apply job-card__apply--disabled">
          Link unavailable
        </span>
      )}
    </div>
  );
}

function PipelineTracker({ activeStage }: { activeStage: Stage }) {
  const activeIndex = PIPELINE_STAGES.findIndex((s) => s.key === activeStage);
  const isSearchVariant = activeStage && !["understanding", "ranking", null].includes(activeStage);

  return (
    <div className="pipeline" aria-live="polite">
      {PIPELINE_STAGES.map((stage, i) => {
        const isDone = activeIndex > i || activeIndex === -1;
        const isActive =
          i === 1
            ? isSearchVariant || activeStage === "search_jobs"
            : activeStage === stage.key;
        const isPast = activeIndex > i && activeIndex !== -1;
        return (
          <div className="pipeline__step" key={stage.key}>
            <div
              className={`pipeline__node ${isActive ? "pipeline__node--active" : ""} ${
                isPast ? "pipeline__node--done" : ""
              }`}
            />
            <span
              className={`pipeline__label ${
                isActive ? "pipeline__label--active" : ""
              }`}
            >
              {stage.label}
            </span>
            {i < PIPELINE_STAGES.length - 1 && (
              <div
                className={`pipeline__connector ${
                  isPast ? "pipeline__connector--done" : ""
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function JobAssistantChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [activeStage, setActiveStage] = useState<Stage>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, activeStage]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        text: trimmed,
      };
      const assistantId = crypto.randomUUID();
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: "assistant",
        text: "",
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput("");
      setIsStreaming(true);
      setActiveStage("understanding");

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(`${API_BASE}/assistant/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, message: trimmed }),
          signal: controller.signal,
        });

        const returnedSession = res.headers.get("X-Session-Id");
        if (returnedSession) setSessionId(returnedSession);

        if (!res.body) throw new Error("No response body");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() || "";

          for (const part of parts) {
            const line = part.trim();
            if (!line.startsWith("data:")) continue;
            const jsonStr = line.slice(5).trim();
            if (!jsonStr) continue;

            let event: any;
            try {
              event = JSON.parse(jsonStr);
            } catch {
              continue;
            }

            if (event.type === "progress") {
              setActiveStage(event.stage);
            } else if (event.type === "token") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, text: m.text + event.content } : m
                )
              );
            } else if (event.type === "job_results") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, jobs: event.jobs } : m
                )
              );
            } else if (event.type === "error") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, text: event.message, isStreaming: false }
                    : m
                )
              );
            } else if (event.type === "done") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, isStreaming: false } : m
                )
              );
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    text: "Connection lost. Please try again.",
                    isStreaming: false,
                  }
                : m
            )
          );
        }
      } finally {
        setIsStreaming(false);
        setActiveStage(null);
        abortRef.current = null;
      }
    },
    [isStreaming, sessionId]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
<div className="flex h-screen flex-col bg-background">
  {/* Header */}
  <header className="shrink-0 px-6">
    <div className="mx-auto flex w-full max-w-5xl items-center">
      <div className="flex items-center gap-2">
        <Link href="/">
          <EmpressoLogo className="h-24 w-auto text-foreground" />
        </Link>

        <span className="text-muted-foreground/30">/</span>

        <span className="text-md font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          AI
        </span>
      </div>
    </div>
  </header>

  {/* Chat */}
  <div ref={scrollRef} className="flex-1 overflow-y-auto">
    <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-6">

      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center pb-32 text-center">

          <h1 className="text-5xl font-semibold tracking-tight">
            What are you looking for?
          </h1>

          <p className="mt-4 max-w-xl text-muted-foreground">
            Search jobs, ask about companies, prepare for interviews, or get
            career advice.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {[
              "Remote backend engineer jobs",
              "What's Stripe hiring for right now?",
              "How do I negotiate a job offer?",
            ].map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="rounded-full border border-border bg-card px-5 py-3 text-sm transition-all hover:border-white/20 hover:bg-accent hover:scale-[1.02]"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6 pb-10">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              } animate-fade`}
            >
              <div
                className={`max-w-[80%] rounded-3xl px-5 py-4 ${
                  msg.role === "user"
                    ? "bg-white text-black"
                    : "bg-card border border-border"
                }`}
              >
                {msg.text && (
                  <div className="proseprose-invertmax-w-noneprose-headings:font-semiboldprose-headings:tracking-tightprose-p:text-foregroundprose-p:leading-7prose-strong:text-whiteprose-li:marker:text-muted-foregroundprose-blockquote:border-l-borderprose-code:text-fuchsia-300prose-code:before:hiddenprose-code:after:hiddenprose-pre:borderprose-pre:border-borderprose-pre:bg-black/40">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                )}

                {msg.isStreaming && (
                  <div className="mt-4 space-y-3">
                    <div className="shimmer h-3 w-full rounded-full" />
                    <div className="shimmer h-3 w-4/5 rounded-full" />
                    <div className="shimmer h-3 w-3/5 rounded-full" />
                  </div>
                )}

                {msg.isStreaming &&
                  msg.text && (
                    <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-current" />
                  )}

                {msg.jobs && msg.jobs?.length > 0 && (
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {msg.jobs.map((job) => (
                      <JobResultCard
                        key={job.job_id}
                        job={job}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>

  {/* Composer */}
  <div className="shrink-0 px-6 pb-6">
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-4xl"
    >
      <div className="flex items-center gap-3 rounded-[28px] border border-border bg-card px-4 py-3 shadow-xl">

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isStreaming}
          placeholder="Ask about jobs, companies, or your career..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />

        <button
          type="submit"
          disabled={isStreaming || !input.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 disabled:opacity-40"
        >
          <svg 
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M5 12H19M19 12L13 6M19 12L13 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

      </div>
    </form>
  </div>
</div>
);
}