import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import FloatingButton from "@/components/AiFolatingButton";

export const metadata: Metadata = {
  title: "Empreso",
  description: "Empreso website",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <FloatingButton />
      <Footer />
    </>
  );
}
