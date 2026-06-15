"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
// import { profilesApi } from "@/lib/api-client";
import { UserPrefill } from "@/lib/types";
import ProfileForm from "@/components/console/profile/ProfileForm";
import "../profiles.css";
import { createProfile, profilePrefillUser } from "@/lib/api-client";


export default function NewProfilePage() {
  const router = useRouter();
  const params = useSearchParams();
  const userId = params.get("userId") ?? "";
 
  const [user, setUser] = useState<UserPrefill | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
 
  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);
 
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
 
  async function handleSubmit(
    data: Parameters<typeof createProfile>[0] | Partial<Parameters<typeof createProfile>[0]>
  ) {
    setSubmitting(true);
    try {
      const profile = await createProfile(data as Parameters<typeof createProfile>[0]);
      showToast("Profile created successfully");
      setTimeout(() => router.push(`/console/profiles`), 800);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Failed to create profile", "error");
    } finally {
      setSubmitting(false);
    }
  }
 
  return (
    <div className="page-shell">
      <Link href="/console/profiles" className="back-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        All profiles
      </Link>
      {/* Header */}
      <header className="px-5">
        <div>
            <h1 className="text-4xl font-semibold tracking-tight">
              Create New Profile
            </h1>
            <p className="mt-1 text-muted-foreground">
              This profile will be used by our AI Agents to automate your Job Applications, Please keep the Real information 
            </p>
          </div>
      </header>
 
      <main className="p-10">
 
        {loadingUser ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }} className="p-10">
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
            onSubmit={handleSubmit}
            submitLabel="Create profile"
            submitting={submitting}
            onCancel={() => router.push("/console/profiles")}
          />
        ) : null}
      </main>
 
      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === "success" ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            )}
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}