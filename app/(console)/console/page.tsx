'use client'
import { useTheme } from "next-themes"
import Image from "next/image"
import { Bot, FileText, Brain, Workflow, Code2, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";


const solutions = [
  { icon: Bot, t: "Empreso AI", d: "AI Chat assistant with memory, optimized responses, and real-time interaction handling." },
  { icon: Brain, t: "ATS Optimization", d: "AI-powered resume tailoring that optimizes content to match job requirements and improve compatibility with applicant tracking systems (ATS)." },
  { icon: FileText, t: "AI CV Builder", d: "An AI agent that creates ATS-friendly resumes from job descriptions and exports them as downloadable LaTeX-based PDFs using reusable templates." },
  { icon: Workflow, t: "Agentic Workflows", d: "Orchestrates multi-step AI pipelines across LLMs and tools to automate personalized job recommendations and end-to-end application workflows." },
  { icon: Code2, t: "Coding Platform", d: "A premium platform offering curated coding questions to help you crack online assessments, with detailed progress tracking and performance monitoring." },
  // { icon: Database, t: "Enterprise Context", d: "Connect company data securely with RBAC and audit trails." },
];


export default function Home() {
  const { theme } = useTheme();

  return (
    <>
      <main className="relative bg-background text-foreground">
        <section className="relative mx-auto max-w-7xl px-6 py-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Empreso Products</p>
        </section>
      </main>
      <main className="relative mx-auto max-w-7xl px-6 pb-10">
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s) => (
            <Card key={s.t} className="p-6">
              <div className="inline-flex rounded-lg p-3">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-mono">{s.t.toUpperCase()}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              <a href="#" className="mt-5 inline-flex items-center gap-1 text-sm text-foreground hover:underline">
                Learn more <ArrowUpRight className="h-4 w-4" />
              </a>
            </Card>
          ))}
        </div>
      </main>
    </>
  )
}
