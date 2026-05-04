import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

const jobs = [
  { title: "Full-Stack Software Engineer", type: "Full Time", body: "We are hiring several phenomenal Full Stack TypeScript Developers with experience writing high-quality TypeScript code and additional knowledge of cloud deployment like serverless architectures (Cloudflare/AWS/Azure)." },
  { title: "Sr. DevOps Engineer", type: "Full Time", body: "Be part of our backend team to design and implement enterprise-grade BYOC solutions, address latency challenges, automate deployments, and ensure seamless system performance for advanced AI solutions." },
  { title: "AI/ML Engineer", type: "Full Time", body: "empreso is redefining how developers build AI Agents with Memory. Join our AI/ML Research team to explore, experiment, and develop advanced solutions that drive the next generation of AI agents." },
  { title: "Design Engineer (Frontend, UI/UX)", type: "Full Time", body: "We place a strong emphasis on UX, DX, and design. We are seeking a talented frontend developer who can leverage TypeScript React, Next.js, Tailwind CSS, and modern web standards." },
  { title: "Catch All / Open Role", type: "Full Time", body: "Unsure where you fit? Let us know your skills and passions, and we'll find the perfect role for you. We're always excited to meet talented individuals who bring unique expertise to the table." },
];

export const Careers = () => (
  <section className="relative border-t border-white/[0.1] bg-neutral-950">
    <div className="mx-auto max-w-7xl px-6 py-5">
      {/* <div className="max-w-3xl">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">We're hiring!</h2>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          We're building the most powerful serverless AI platform that puts developers first. We're a fully remote team of engineers who sweat the details.
        </p>
      </div> */}
      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((j) => (
          <Card key={j.title} className="flex flex-col p-6">
            <h3 className="text-lg font-semibold">{j.title}</h3>
            <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{j.type}</p>
            <p className="mt-5 flex-1 text-sm leading-relaxed text-muted-foreground">{j.body}</p>
            <a href="#" className="mt-6 inline-flex w-fit items-center gap-2 rounded-pill border border-border bg-background/60 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-card">
              Apply now <ArrowUpRight className="h-4 w-4" />
            </a>
          </Card>
        ))}
      </div>
    </div>
  </section>
);
