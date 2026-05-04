import { Hero } from "@/components/landing/Hero";
import { LogoHome } from "@/components/landing/LogoHome";
import { Careers } from "@/components/landing/Careers";
import { Community } from "@/components/landing/Community";
import Body from "@/components/HomeBody";

// SERVER COMPONENT - No "use client" directive
// This significantly improves FCP (First Contentful Paint) and reduces hydration time
export default function HomePage() {
  return (
    <main>
      <Hero />
      <LogoHome logos={["LinkedIn", "Indeed", "Glassdoor", "Workday", "Greenhouse"]}/>
      <div className="h-2 diagonal-bg opacity-60 border-white/[0.1]" />
      <Body />
      {/* <Careers /> */}
      <Community />
    </main>
  );
}
