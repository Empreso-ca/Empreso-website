"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, Suspense } from "react";

const navItems = [
  { label: "Products", href: "#" },
  { label: "Docs", href: "#" },
  { label: "Solutions", href: "/solutions" },
  { label: "Customers", href: "#" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "/contact" },
];

function NavbarAuthButtons() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return (
      <SignOutButton>
        <button className="rounded-full bg-foreground px-5 py-2 text-sm text-background hover:opacity-90">
          Sign out
        </button>
      </SignOutButton>
    );
  }

  return (
    <>
      <Link
        href="/sign-in"
        className="hidden sm:block text-sm text-foreground/80 hover:text-foreground"
      >
        Sign in
      </Link>
      <Link
        href="/sign-up"
        className="hidden sm:block rounded-full bg-foreground px-5 py-2 text-sm text-background hover:opacity-90"
      >
        Sign up
      </Link>
    </>
  );
}

export const NavbarClient = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Nav */}
      <nav className="hidden items-center gap-7 lg:flex">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="text-sm text-foreground/80 hover:text-foreground transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <Suspense fallback={null}>
          <NavbarAuthButtons />
        </Suspense>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t px-6 py-4">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};
