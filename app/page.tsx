import { Hero } from "@/components/landing/Hero";
import { LogoCloud } from "@/components/landing/LogoCloud";
import { Careers } from "@/components/landing/Careers";
import { Community } from "@/components/landing/Community";

// SERVER COMPONENT - No "use client" directive
// This significantly improves FCP (First Contentful Paint) and reduces hydration time
export default function HomePage() {
  return (
    <main>
      <Hero />
      <LogoCloud />
      <Careers />
      <Community />
    </main>
  );
}
