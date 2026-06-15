// whihch will used by console components 
import Link from "next/link";
import { EmpressoLogo } from "@/components/EmpressoLogo";
import { NavbarClient } from "./NavbarClient";

/* SERVER COMPONENT - Renders fast, no auth calls in render */
export const Navbar = async () => {
  return (
    <nav className="sticky top-0 z-50 bg-white">
      <header className="relative z-50 w-full border-b bg-background">
        <div className="mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link href="/">
              {/* Logo */}
              <EmpressoLogo className="h-28 w-auto text-foreground" />
            </Link>
            <span className="text-muted-foreground/50 text-lg font-light">
              /
            </span>
            <Link href={"/console"}>
              <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
                Console
              </span>
            </Link>
          </div>
          
          <NavbarClient />
        </div>
      </header>
    </nav>
  );
};