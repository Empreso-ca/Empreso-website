export const Community = () => (
  <section className="relative border-t border-white/[0.1]">
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-24 lg:grid-cols-2">
      <div className="max-w-md">
        <p className="text-base leading-relaxed text-muted-foreground">
          "Empreso is transforming the AI market.{" "}
          <span className="font-semibold text-foreground">Easy to use, handy integrations, and serverless AI agents infra</span>. What else could we ask for."
        </p>
        <div className="mt-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-400" />
          <div>
            <p className="text-sm font-semibold">Zeno Rocha</p>
            <p className="text-xs text-muted-foreground">Founder · Resend</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <h2 className="font-mono-display text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          <span className="text-muted-foreground">//</span> community
        </h2>
      </div>
    </div>
  </section>
);
