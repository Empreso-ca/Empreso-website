import { Card } from "@/components/ui/Card";
import { CustomGrid } from "@/components/ui/CustomGrid";

export const metadata = { title: "About — Empreso" };

const stats = [
  { v: "5,000+", l: "Companies" },
  { v: "30+", l: "AI models" },
  { v: "100M+", l: "Agent runs" },
  { v: "99.99%", l: "Uptime" },
];

const values = [
  { t: "Developer-first", d: "Every API, doc and dashboard is designed for the engineer who has to ship on Monday." },
  { t: "Composable", d: "Build agents from small, composable primitives — Pipes, Memory, Tools, Workflows." },
  { t: "Serverless", d: "Zero infra. Global edge. Predictable pricing. From hello-world to enterprise scale." },
];

export default function AboutPage() {
  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <section className="relative mx-auto max-w-5xl px-6 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">About empreso</p>
        <h1 className="mt-6 font-mono-display text-5xl font-bold leading-tight sm:text-6xl">
          Building the AI infrastructure of the next decade.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Empreso is a fully remote team of engineers and researchers building the most powerful serverless platform for composable AI agents.
        </p>
      </section>

      <CustomGrid stats={stats} cols={4}/>
      <div className="absolute left-1/2 -translate-x-1/2 w-screen border-t border-white/[0.1]" /> 


      <section className="relative mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Our values</h2>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {values.map((v) => (
            <Card key={v.t} className="p-6">
              <h3 className="text-lg font-semibold">{v.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.d}</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
