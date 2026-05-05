import { ArrowUpRight, Bot, Brain, Cloud, Code2, Database, Workflow, FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LogoProds } from "@/components/landing/LogoProducts";

const solutions = [
  { icon: Bot, t: "Empreso AI", d: "AI Chat assistant with memory, optimized responses, and real-time interaction handling." },
  { icon: Brain, t: "ATS Optimization", d: "AI-powered resume tailoring that optimizes content to match job requirements and improve compatibility with applicant tracking systems (ATS)." },
  { icon: FileText, t: "AI Resume Generator", d: "An AI agent that creates ATS-friendly resumes from job descriptions and exports them as downloadable LaTeX-based PDFs using reusable templates." },
  { icon: Workflow, t: "Agentic Workflows", d: "Orchestrates multi-step AI pipelines across LLMs and tools to automate personalized job recommendations and end-to-end application workflows." },
  { icon: Code2, t: "Coding Platform", d: "A premium platform offering curated coding questions to help you crack online assessments, with detailed progress tracking and performance monitoring." },
  // { icon: Database, t: "Enterprise Context", d: "Connect company data securely with RBAC and audit trails." },
];

const useCases = [
  { tag: "Customer Support", t: "Tier-1 deflection agents", d: "Resolve 60% of tickets before a human ever sees them." },
  { tag: "Sales", t: "Outbound research agents", d: "Enrich, qualify, and personalize at thousands of accounts a day." },
  { tag: "Engineering", t: "Internal copilots", d: "Ship agents that understand your codebase and ship PRs." },
];

export default function SolutionsPage() {
  return (
    // <main className="relative">
    //   <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />

    //   <section className="relative mx-auto max-w-7xl px-6 py-24">
    //     <div className="max-w-3xl">
    //       <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Products</p>
    //       <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
    //         One platform. Every Solution with AI use case.
    //       </h1>
    //       <p className="mt-5 text-base leading-relaxed text-muted-foreground">
    //         From applications to offers - AI-driven Empreso accelerates your career growth.
    //       </p>
    //     </div>
        
    //     <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Tools we work</h2>
    //     <br />
    
    //   </section>
    
    //   <section className="relative mx-auto max-w-7xl border-white/[0.1] px-6 py-24">

    //     <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-border/70 bg-card/40 p-12 text-center">
    //       <h3 className="font-mono-display text-3xl font-bold sm:text-4xl">Ready to try Empreso Products</h3>
    //       <p className="max-w-xl text-sm text-muted-foreground">
    //         Build your profile, improve your skills, and land better opportunities faster.
    //       </p>
    //       <Button size="lg" className="mt-2">Get Started</Button>
    //     </div>
    //   </section>
    // </main>
    
    <>
      <main className="relative bg-background text-foreground">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
          <section className="relative mx-auto max-w-7xl px-6 py-24">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Products</p>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
                One platform. Every Solution with AI use case.
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                From applications to offers - AI-driven Empreso accelerates your career growth.
              </p>
            </div>
          </section>
      </main>

      <main className="relative bg-background text-foreground">
        <div className="w-full h-5 opacity-90 border-b border-white/[0.2]" />
          <p className="font-mono text-center py-5 diagonal-bg">TOOLS THAT WE WORK WITH</p>
          <LogoProds logos={["zapier","GitHub","n8n","Vercel","OpenAI","Gemini","supabase","FORRESTER","Google","databricks", "Clerk", "NEON"]}/>
      </main>

      <main className="relative mx-auto max-w-7xl px-6 pb-10">
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s) => (
              <Card key={s.t} className="p-6">
              <div className="inline-flex rounded-lg bg-secondary p-3">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              <a href="#" className="mt-5 inline-flex items-center gap-1 text-sm text-foreground hover:underline">
                Learn more <ArrowUpRight className="h-4 w-4" />
              </a>
            </Card>
          ))}
        </div>
      </main>

    </>
  );
}
