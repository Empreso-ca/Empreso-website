import { ArrowUpRight, Bot, Brain, Cloud, Code2, Database, Workflow } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Solutions — Empreso" };

const solutions = [
  { icon: Bot, t: "AI Agents", d: "Compose autonomous agents with memory, tools, and multi-step reasoning." },
  { icon: Brain, t: "RAG & Memory", d: "Production-grade vector memory with semantic search at any scale." },
  { icon: Workflow, t: "Workflows", d: "Orchestrate multi-step pipelines across LLMs, tools, and APIs." },
  { icon: Code2, t: "Coding Agents", d: "Ship coding agents with taste — Command Code, Pipes, and Tools." },
  { icon: Database, t: "Enterprise Context", d: "Connect company data securely with RBAC and audit trails." },
  { icon: Cloud, t: "BYOC", d: "Bring your own cloud. Deploy on AWS, GCP, Azure, or Cloudflare." },
];

const useCases = [
  { tag: "Customer Support", t: "Tier-1 deflection agents", d: "Resolve 60% of tickets before a human ever sees them." },
  { tag: "Sales", t: "Outbound research agents", d: "Enrich, qualify, and personalize at thousands of accounts a day." },
  { tag: "Engineering", t: "Internal copilots", d: "Ship agents that understand your codebase and ship PRs." },
];

export default function SolutionsPage() {
  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />

      <section className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Solutions</p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            One platform. Every AI agent use case.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            From hobby projects to mission-critical enterprise systems — Empreso scales with you.
          </p>
        </div>

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
      </section>

      <section className="relative mx-auto max-w-7xl border-t border-border/60 px-6 py-24">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">By use case</h2>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {useCases.map((u) => (
            <Card key={u.t} className="p-6">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{u.tag}</p>
              <h3 className="mt-3 text-lg font-semibold">{u.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{u.d}</p>
            </Card>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-border/70 bg-card/40 p-12 text-center">
          <h3 className="font-mono-display text-3xl font-bold sm:text-4xl">Ready to ship AI Agents?</h3>
          <p className="max-w-xl text-sm text-muted-foreground">
            Build, test, and deploy in minutes. Scale your agents instantly with built-in memory and tooling.
          </p>
          <Button size="lg" className="mt-2">Start deploying</Button>
        </div>
      </section>
    </main>
  );
}
