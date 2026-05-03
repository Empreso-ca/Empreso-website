import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Pricing — empreso" };

const plans = [
  {
    name: "Free",
    price: "$0",
    cta: "Get Started",
    features: ["500 Empreso Credits", "5 Public Pipes", "0 Private Pipes", "500 Agent Runs", "5 MB Memory", "2 Memory Files", "Community support", "Threads, Parser, and tools"],
  },
  {
    name: "Individual",
    price: "$100",
    cta: "Get Started",
    features: ["20K Empreso Credits", "Unlimited Public Pipes", "10 Private Pipes", "Unlimited Runs", "20 MB Memory", "20 Memory Files", "Community support", "1 Week Logs Retention", "Threads, Parser, and tools", "Unlimited Memory Retrieval"],
  },
  {
    name: "Growth",
    price: "$250",
    cta: "Get Started",
    highlighted: true,
    features: ["75K Empreso Credits", "Unlimited Public Pipes", "30 Private Pipes", "Unlimited Runs", "50 MB Memory", "50 Memory Files", "Community support", "1 Week Logs Retention", "5 Org Seats ($30/seat)", "Threads, Parser, and tools", "Unlimited Memory Retrieval"],
  },
  {
    name: "Custom",
    price: "Talk to us",
    cta: "Contact us",
    features: ["Unlimited Pipes", "Unlimited Runs", "Unlimited RAG Memory", "High-Performance RAG", "Discount on usage runs", "Unlimited vector storage", "Unlimited logs retention", "Dedicated FDE Engineers", "Account Analytics, Fwds", "SAML / Single Sign-On", "Enterprise Context Engine", "RBAC & Access Controls", "Advanced rate limiting", "SOC 2, HIPAA & GDPR"],
  },
];

export default function PricingPage() {
  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <section className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Pricing Plans</h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            From indie developers, early-stage startups to growing enterprises, ⌘ empreso offers most competitive pricing to make AI accessible to everyone.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`flex flex-col rounded-2xl border p-6 transition-colors ${
                p.highlighted ? "border-foreground/30 bg-card/60" : "border-border/70 bg-card/30"
              }`}
            >
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{p.name}</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-mono-display text-3xl font-bold">{p.price}</span>
                {p.price.startsWith("$") && <span className="text-xs text-muted-foreground">/ month</span>}
              </div>
              <Button className="mt-5 w-full" variant={p.highlighted ? "default" : "outline"}>
                {p.cta}
              </Button>
              <ul className="mt-8 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-foreground/70" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
