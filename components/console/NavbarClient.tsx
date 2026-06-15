"use client";

import { useUser, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Menu, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import ProfileSwitcher from "./ProfileSwitcher";
import { Profile } from "./ProfileSwitcher";
import { useProfile } from "@/context/ProfileContext";

function NavbarAuthButtons({
  mobile = false,
  onAction,
}: {
  mobile?: boolean;
  onAction?: () => void;
}) {
  const { isSignedIn, isLoaded } = useUser();
  const [isProUser, setIsProUser] = useState<boolean | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const { getToken, userId } = useAuth();
  const { activeProfile, setActiveProfile } = useProfile();

  useEffect(() => {
    if (!isSignedIn) return;

    let cancelled = false;

    async function fetchData() {
      const token = await getToken({ template: "fastapi" });

      const [proRes, profileRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/is-pro`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/labels`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const proData = await proRes.json();
      const profileData = await profileRes.json();

      if (cancelled) return;

      setIsProUser(proData.isPro);
      setProfiles(profileData.profiles);

      const active = profileData.profiles.find(
        (p: Profile) => p.id === profileData.activeProfileId
      );

      setActiveProfile(active ?? null);
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [isSignedIn, getToken]); // ✅ FIXED (removed setActiveProfile)

  const switchProfile = async (profileId: number) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/activate`,
      { method: "POST" }
    );

    const data = await res.json();

    const updated = { id: data.id, name: data.name };

    setActiveProfile(updated);

    setProfiles((prev) =>
      prev.map((p) => ({
        ...p,
        isActive: p.id === data.id,
      }))
    );
  };

  if (!isLoaded) return null;

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-3">
        {userId && (
          <ProfileSwitcher
            profiles={profiles}
            activeProfileId={activeProfile?.id ?? null}
            onProfileChange={switchProfile}
            userId={userId}
          />
        )}

        {isProUser !== null && (
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border ${
              isProUser
                ? "bg-yellow-500/10 text-yellow-600"
                : "bg-neutral-900 text-gray-400"
            }`}
          >
            {isProUser ? "PRO" : "FREE"}
          </span>
        )}

        <UserButton />
      </div>
    );
  }

  return (
    <div className={`flex ${mobile ? "flex-col" : "items-center"} gap-4`}>
      <Link href="/sign-in" onClick={onAction}>
        Sign in
      </Link>
      <Link href="/sign-up" onClick={onAction}>
        Sign up
      </Link>
    </div>
  );
}

export const NavbarClient = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="hidden sm:block">
          <NavbarAuthButtons />
        </div>

        <button onClick={() => setIsOpen(true)} className="lg:hidden">
          <Menu size={24} />
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed right-0 top-0 h-full w-[80%] bg-background transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setIsOpen(false)}>
            <ArrowRight />
          </button>
        </div>

        <div className="p-6">
          <NavbarAuthButtons mobile onAction={() => setIsOpen(false)} />
        </div>
      </div>
    </>
  );
};