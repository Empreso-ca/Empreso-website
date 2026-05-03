import Link from "next/link";
import { Command, Github, Linkedin, Twitter, Youtube } from "lucide-react";

const cols = [
  ["Login", "About", "Pricing", "Changelog"],
  ["Guides", "Docs", "Solutions", "Careers"],
  ["Terms", "Privacy", "Security", "Blog"],
];

export const Footer = () => (
  <footer className="relative border-t border-white/[0.1]">
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
        {cols.map((col, i) => (
          <ul key={i} className="space-y-3">
            {col.map((l) => (
              <li key={l}>
                <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">{l}</Link>
              </li>
            ))}
          </ul>
        ))}
        <div className="flex items-center md:justify-center">
          <div className="flex items-center gap-2">
            <Command className="h-5 w-5" />
            <span className="text-base font-semibold">Empreso</span>
          </div>
        </div>
        <div className="flex gap-4 md:justify-end">
          {[Twitter, Github, Linkedin, Youtube].map((Icon, i) => (
            <a key={i} href="#" className="p-1 text-muted-foreground transition-colors hover:text-foreground">
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
      <p className="mt-12 text-center text-xs text-muted-foreground">
        © 2026 Empreso, Inc. 2261 Market St #5556, San Francisco, CA 94114. All rights reserved.
      </p>
    </div>
  </footer>
);
