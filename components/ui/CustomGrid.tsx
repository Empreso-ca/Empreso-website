import React from "react";
import { cn } from "@/lib/utils";

export type StatItem = {
  v: string;
  l: string;
};

export type CustomGridProps = {
  stats: StatItem[];
  cols?: number;
  className?: string;
};

export function CustomGrid({ stats, cols, className }: CustomGridProps) {
  return (
    <section
      className={cn(
        "relative mx-auto max-w-7xl border border-white/[0.1]",
        className
      )}
    >
      <div className="absolute left-1/2 -translate-x-1/2 w-screen border-t border-white/[0.1]" /> 
      <div className="grid grid-cols-2 md:grid-cols-3">
        {stats.map((s, i) => (
          <div
            key={i}
            className={cn(
              "p-8 text-center border-white/[0.1]",
              "border-r border-b",

              "[&:nth-child(2n)]:border-r-0",
              "[&:nth-last-child(-n+2)]:border-b-0",

              "md:[&:nth-child(2n)]:border-r md:[&:nth-child(3n)]:border-r-0",
              "md:[&:nth-last-child(-n+2)]:border-b md:[&:nth-last-child(-n+3)]:border-b-0"
            )}
          >
            <p className="font-mono-display text-3xl font-bold sm:text-4xl">
              {s.v}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}