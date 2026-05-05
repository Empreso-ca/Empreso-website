"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Pricing", href: "/pricing" },
  { label: "Training", href: "/training" },
  { label: "Jobs", href: "/jobs" },
  { label: "ATS-Checker", href: "/ats-check"},
  { label: "Contact", href: "/contact" },
];


function NavbarAuthButtons({mobile = false,onAction,}: {mobile?: boolean;onAction?: () => void;}) {
  const { isSignedIn, isLoaded } = useUser();

    if (!isLoaded) return null;

    if (isSignedIn) {
        return (
            <SignOutButton>
            <button
                onClick={onAction}
                className="w-full rounded-full bg-foreground px-5 py-2 text-sm text-background hover:opacity-90"
            >
                Sign out
            </button>
            </SignOutButton>
        );
    }

    return (
        <div className={`flex ${mobile ? "flex-col gap-3 mt-4" : "items-center gap-4"}`}>
            <Link
                href="/sign-in"
                onClick={onAction}
                className="text-sm text-foreground/80 hover:text-foreground"
                >
                Sign in
            </Link>

            <Link
                href="/sign-up"
                onClick={onAction}
                className="rounded-full bg-foreground px-5 py-2 text-sm text-background hover:opacity-90 text-center"
                >
                Sign up
            </Link>
        </div>
    );
}

export const NavbarClient = () => {
  const [isOpen, setIsOpen] = useState(false);

  // 🔒 Lock scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Desktop Nav */}
      <nav className="hidden lg:flex items-center gap-7">
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
        <div className="hidden sm:block">
          <NavbarAuthButtons />
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(true)} className="lg:hidden">
          <Menu size={24} />
        </button>
      </div>

      {/* BACKDROP */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={closeMenu}
        />
      )}

      {/* MOBILE DRAWER */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[80%] max-w-sm bg-background shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-end px-6 h-16 border-b">
          <button onClick={closeMenu}>
            <ArrowRight size={22} />
          </button>
        </div>

        {/* Nav Items */}
        <div className="flex flex-col px-6 py-6 gap-5">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={closeMenu}
              className="text-base text-foreground/90 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}

          {/* Divider */}
          <div className="border-t pt-4">
            <NavbarAuthButtons mobile onAction={closeMenu}/>
          </div>
        </div>
      </div>
    </>
  );
};