'use client'
import { Command } from "lucide-react";
import { Button } from "@/components/ui/Button";
import EmpresoTerminal from "./Terminal";
import { EmpressoLogo } from "@/components/EmpressoLogo";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-70" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-20 pt-4">
        
        <div className="mb-10 sm:mb-12 flex justify-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-pill border border-border/60 bg-card/40 px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs text-foreground/80 backdrop-blur transition-colors hover:border-border text-center"
          >
            <Command className="h-3 w-3" />
            <span>Empreso AI is live now.</span>
            <span className="text-foreground underline decoration-dotted underline-offset-4">
              Try the first AI agent with taste.
            </span>
          </a>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          
          {/* LEFT */}
          <div className="relative z-10 max-w-xl flex flex-col gap-8 sm:gap-10 items-center lg:items-start text-center lg:text-left">
            
            <div className="mt-6 sm:mt-8 max-w-xs sm:max-w-md">
            <EmpressoLogo className="w-full h-auto max-w-[300px] md:max-w-full" />
            </div>

          <div className="font-mono-display text-lg sm:text-2xl md:text-4xl dark:text-neutral-200">
            Stop Applying. Start Getting Hired!
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3">
            <Button>Get Started</Button>
            <Button variant="outline">Contact us</Button>
          </div>

        </div>

        {/* RIGHT */}
        <div className="relative h-[260px] sm:h-[340px] md:h-[420px] lg:h-[520px] w-full">
          <GradientMosaic />

          {/* Terminal Overlay */}
          <div className="absolute inset-0 flex items-center justify-center lg:justify-end z-20 px-4">
            <div className="w-full max-w-sm sm:max-w-md">
              <EmpresoTerminal />
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

const GradientMosaic = () => {
  const blocks = [
    { top: "4%", left: "78%", w: "18%", h: "8%" },
    { top: "16%", left: "62%", w: "30%", h: "8%" },
    { top: "30%", left: "55%", w: "23%", h: "8%" },
    { top: "30%", left: "83%", w: "13%", h: "8%" },
    { top: "44%", left: "40%", w: "16%", h: "8%" },
    { top: "44%", left: "60%", w: "32%", h: "8%" },
    { top: "58%", left: "55%", w: "16%", h: "8%" },
    { top: "58%", left: "75%", w: "20%", h: "8%" },
    { top: "72%", left: "65%", w: "28%", h: "8%" },
    { top: "86%", left: "78%", w: "18%", h: "8%" },
    { top: "88%", left: "25%", w: "35%", h: "4%" },
  ];

  return (
    <div className="absolute inset-0">
      {blocks.map((b, i) => (
        <div
          key={i}
          className="gradient-block absolute rounded-[3px] animate-fadeUp"
          style={{
            top: b.top,
            left: b.left,
            width: b.w,
            height: b.h,
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
};