"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check, UserCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/Button";

export type Profile = {
  id: number;
  name: string;
  preferredRole?: string;
};

type Props = {
  profiles: Profile[];
  activeProfileId: number | null;
  onProfileChange: (profileId: number) => void;
  userId: string;
};

export default function ProfileSwitcher({
  profiles,
  activeProfileId,
  onProfileChange,
  userId
}: Props) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeProfile = profiles.find(
    (p) => p.id === activeProfileId
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="
          flex items-center gap-2
          h-9
          px-3
          rounded-full
          border border-neutral-800
          bg-neutral-950/70
          hover:bg-neutral-900
          transition-all
          backdrop-blur-sm
        "
      >
        {activeProfile? <>
            <UserCircle2
              size={16}
              className="text-neutral-400"
            />
            <span className="max-w-[140px] truncate text-sm text-neutral-200">
              {activeProfile?.name || "No Active Profile"}
            </span>
          </> : <>
            <AlertCircle
              size={16}
              className="text-neutral-500"
            />
            <span className="max-w-[140px] truncate text-sm text-neutral-500">
              No Active Profile
            </span>
          </>
        }
        <ChevronDown
          size={14}
          className={`text-neutral-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Menu */}
      {open && (
        <div
          className="
            absolute right-0 mt-2
            w-72
            overflow-hidden
            rounded-2xl
            border border-neutral-800
            bg-neutral-950
            shadow-2xl
            z-50
            animate-in fade-in zoom-in-95
          "
        >
          {/* Empty State */}
          {profiles.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-neutral-500">
              No profiles found
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto py-2">
              {profiles.map((profile) => {
                const isActive =
                  profile.id === activeProfileId;

                return (
                  <button
                    key={profile.id}
                    onClick={() => {
                      onProfileChange(profile.id);
                      setOpen(false);
                    }}
                    className="
                      flex w-full items-center justify-between
                      px-4 py-1
                      hover:bg-neutral-900
                      transition-colors
                    "
                  >
                    <div className="text-left">
                      <div className="text-sm text-white">
                        {profile.name}
                      </div>

                      {profile.preferredRole && (
                        <div className="text-xs text-neutral-500">
                          {profile.preferredRole}
                        </div>
                      )}
                    </div>

                    {isActive && (
                      <div
                        className="
                          flex items-center justify-center
                          h-6 w-6
                          rounded-full
                          bg-emerald-500/15
                        "
                      >
                        <Check
                          size={14}
                          className="text-emerald-400"
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <div className="border-neutral-800 p-2">
            <Link href={`/console/profiles?create=true`}>
              <Button variant="outline"
                className="
                w-full
                rounded-full
                  py-2
                  text-sm
                  text-neutral-300
                  hover:bg-neutral-900
                  transition
                  "
                  >
                + Create New Profile
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}