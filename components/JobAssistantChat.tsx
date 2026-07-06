"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { EmpressoLogo } from "./EmpressoLogo";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

const API_BASE =
  process.env.NEXT_PUBLIC_ASSISTANT_API_URL || "http://localhost:8000";

type Stage =
  | "understanding"
  | "search_jobs"
  | "get_company_info"
  | "career_advice"
  | "answer_faq"
  | "ranking"
  | null;

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

const STAGE_LABELS: Record<Exclude<Stage, null>, string> = {
  understanding: "Understanding your request",
  search_jobs: "Searching jobs",
  get_company_info: "Looking up company info",
  career_advice: "Gathering market context",
  answer_faq: "Checking help articles",
  ranking: "Ranking results",
};

function humanizeJobType(jobType: string | null): string | null {
  if (!jobType) return null;
  return jobType
    .toLowerCase()
    .split("_")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

function StatusChip({ stage }: { stage: Stage }) {
  if (!stage) return null;
  return (
    <div className="status-chip">
      <span className="status-chip__dot" />
      <span>{STAGE_LABELS[stage]}</span>
    </div>
  );
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
          <span className="tag">{job.remote ? "Remote" : "On-site"}</span>
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
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
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

function AssistantAvatar() {
  return (
    <div className="avatar avatar--assistant">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export default function JobAssistantChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sessionId] = useState<string>(() => crypto.randomUUID());
  const [activeStage, setActiveStage] = useState<Stage>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
              setActiveStage(null);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const autoGrow = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  return (
    <div className="assistant-shell">
      <header className="assistant-header">
          <div className="mx-auto flex w-full">
            <div className="flex items-center gap-2">
              <Link href="/">
                <EmpressoLogo className="h-20 pb-1 w-auto text-foreground" />
              </Link>
              <span className="text-muted-foreground/30">/</span>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                AI
              </span>
            </div>
          </div>
      </header>

      <div className="assistant-body" ref={scrollRef}>
        <div className="thread">
          {messages.length === 0 && (
            <div className="empty-state">
              <p className="empty-state__title tracking-tighter">What are you looking for?</p>
              <div className="empty-state__suggestions">
                {[
                  "Remote backend engineer jobs",
                  "What's Stripe hiring for right now?",
                  "How do I negotiate a job offer?",
                ].map((s) => (
                  <button
                    key={s}
                    className="suggestion-chip"
                    onClick={() => sendMessage(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`message message--${msg.role}`}>
              {msg.role === "assistant" && <AssistantAvatar />}

              <div className="message__content">
                {msg.role === "user" ? (
                  <div className="message__bubble">{msg.text}</div>
                ) : (
                  <>
                    {msg.isStreaming && !msg.text && (
                      <StatusChip stage={activeStage} />
                    )}
                    {msg.text && (
                      <div className="message__text">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                        >
                          {msg.text}
                        </ReactMarkdown>
                        {msg.isStreaming && (
                          <span className="cursor-blink" aria-hidden="true" />
                        )}
                      </div>
                    )}
                    {msg.jobs && msg.jobs.length > 0 && (
                      <div className="job-grid">
                        {msg.jobs.map((job) => (
                          <JobResultCard key={job.job_id} job={job} />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="composer-area">
        <form className="composer" onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            className="composer__input"
            value={input}
            onChange={autoGrow}
            onKeyDown={handleKeyDown}
            placeholder="Ask about jobs, companies, or your career..."
            disabled={isStreaming}
            rows={1}
          />
          <button
            type="submit"
            className="composer__send"
            disabled={isStreaming || !input.trim()}
            aria-label="Send message"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 19V5M12 5L5 12M12 5L19 12"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
        <p className="composer__hint">
          Empreso AI can make mistakes. Verify important details before applying.
        </p>
      </div>
    </div>
  );
}