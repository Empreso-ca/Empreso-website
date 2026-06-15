"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";

export type Profile = {
  id: number | null;
  name: string | null;
};

type ProfileContextType = {
  activeProfile: Profile | null;
  setActiveProfile: Dispatch<SetStateAction<Profile | null>>;
};

const ProfileContext = createContext<ProfileContextType | null>(null);

const STORAGE_KEY = "active_profile";
const CHANNEL_NAME = "profile-sync";

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [activeProfile, setActiveProfileState] = useState<Profile | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  // init broadcast channel
  useEffect(() => {
    if (typeof window === "undefined") return;

    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (event) => {
      setActiveProfileState(event.data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(event.data));
    };

    return () => channel.close();
  }, []);

  // init from storage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setActiveProfileState(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const setActiveProfile: Dispatch<SetStateAction<Profile | null>> =
    useCallback((value) => {
      setActiveProfileState((prev) => {
        const profile =
          typeof value === "function"
            ? (value as (p: Profile | null) => Profile | null)(prev)
            : value;

        if (typeof window !== "undefined") {
          if (profile) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }

          channelRef.current?.postMessage(profile);
        }

        return profile;
      });
    }, []);

  const value = useMemo(
    () => ({
      activeProfile,
      setActiveProfile,
    }),
    [activeProfile, setActiveProfile]
  );

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }

  return context;
}