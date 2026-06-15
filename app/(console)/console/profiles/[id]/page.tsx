"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { getProfile, profilePrefillUser, updateProfile } from "@/lib/api-client";
import Link from "next/link";
import ProfileForm from "@/components/console/profile/ProfileForm";
import { Profile, ProfileUpdate, UserPrefill } from "@/lib/types";
import "../profiles.css"

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const profileId = Number(params.id);
  const userId = searchParams.get("userId") ?? "";
  const [user, setUser] = useState<UserPrefill | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [userError, setUserError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = useCallback(
    (msg: string, type: "success" | "error" = "success") => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 3000);
    },
    []
  );

  // -----------------------------
  // Load profile
  // -----------------------------
  useEffect(() => {
    if (!profileId || Number.isNaN(profileId)) {
      setError("Invalid profile id");
      setLoading(false);
      return;
    }

    let mounted = true;

    getProfile(profileId)
      .then((data) => {
        if (mounted) setProfile(data);
        console.log(data);
        
      })
      .catch((e: unknown) => {
        if (mounted)
          setError(
            e instanceof Error ? e.message : "Failed to load profile"
          );
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [profileId]);

  useEffect(() => {
      if (!userId) {
        setUserError("No userId provided in URL query.");
        setLoadingUser(false);
        return;
      }
      profilePrefillUser(userId)
        .then(setUser)
        .catch((e: unknown) => setUserError(e instanceof Error ? e.message : "Failed to load user"))
        .finally(() => setLoadingUser(false));
    }, [userId]);

  // -----------------------------
  // Update handler
  // -----------------------------
  async function handleSubmit(data: ProfileUpdate) {
    if (!profileId || Number.isNaN(profileId)) return;

    setSubmitting(true);

    try {
      const updated = await updateProfile(profileId, data);

      showToast("Profile updated successfully");

      router.replace(
        `/console/profiles`
      );
    } catch (e: unknown) {
      showToast(
        e instanceof Error ? e.message : "Failed to update profile",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="page-shell">
      <Link href="/console/profiles" className="back-link">
        ← All profiles
      </Link>

      <header className="px-5">
        <h1 className="text-4xl font-semibold tracking-tight">
          Edit Profile
        </h1>
        <p className="mt-1 text-muted-foreground">
          Update profile information used by AI agents.
        </p>
      </header>

      <main className="p-10">
        {loadingUser ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[80, 200, 180, 160].map((h, i) => (
              <div key={i} style={{ height: h, borderRadius: 14 }} className="skeleton" />
            ))}
          </div>
        ) : userError ? (
          <div
            style={{
              background: "var(--danger-dim)",
              border: "1px solid var(--danger)",
              borderRadius: "var(--radius)",
              padding: "16px 20px",
              color: "var(--danger)",
              fontSize: 13,
            }}
          >
            {userError}
          </div>
        ) : user ? (
          <ProfileForm
            userId={userId}
            user={user}
            initial={profile}
            onSubmit={handleSubmit}
            submitLabel="Save profile"
            submitting={submitting}
            onCancel={() => router.push("/console/profiles")}
          />
        ) : null}
      </main>

      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}