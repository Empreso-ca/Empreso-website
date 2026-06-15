"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  activateProfile,
  deleteProfile,
  loadProfiles,
} from "@/lib/api-client";
import { Profile } from "@/lib/types";
import "./profiles.css";
import { useAuth } from "@clerk/nextjs";
import { useProfile } from "@/context/ProfileContext";

// ─── Toast helper ──────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState<
    { id: number; msg: string; type: "success" | "error" }[]
  >([]);

  const add = useCallback(
    (msg: string, type: "success" | "error" = "success") => {
      const id = Date.now();
      setToasts((t) => [...t, { id, msg, type }]);
      setTimeout(
        () => setToasts((t) => t.filter((x) => x.id !== id)),
        3500
      );
    },
    []
  );

  return { toasts, add };
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [activating, setActivating] = useState<number | null>(null);

  const { toasts, add } = useToast();
  const { userId, isLoaded } = useAuth();

  // ✅ GLOBAL CONTEXT
  const { activeProfile, setActiveProfile } = useProfile();

  const hasLoadedRef = useRef(false);

  // ─── Load profiles ───────────────────────────────────────
  const load = useCallback(async () => {
    if (!userId) return;
    if (hasLoadedRef.current) return; // 🚨 prevents repeated calls

    hasLoadedRef.current = true;

    try {
      setLoading(true);

      const data = await loadProfiles(userId);

      setProfiles(data);

      const active = data.find((p) => p.isActive);
      setActiveProfile(active ?? null);

    } catch (err) {
      add(
        err instanceof Error ? err.message : "Failed to load profiles",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [userId, add]);

  useEffect(() => {
    if (!isLoaded || !userId) return;
    load();
  }, [isLoaded, userId, load]);

  // ─── Delete ───────────────────────────────────────────────
  async function handleDelete(id: number, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    try {
      await deleteProfile(id);

      const updated = profiles.filter((p) => p.id !== id);
      setProfiles(updated);

      if (activeProfile?.id === id) {
        setActiveProfile(null);
      }

      add("Profile deleted", "success");
    } catch (err) {
      add(
        err instanceof Error ? err.message : "Failed to delete",
        "error"
      );
    }
  }

  // ─── Activate ─────────────────────────────────────────────
  async function handleActivate(id: number, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await activateProfile(id);

      const updated = profiles.map((p) => ({
        ...p,
        isActive: p.id === id,
      }));

      setProfiles(updated);

      const active = updated.find((p) => p.id === id);

      setActiveProfile(active ?? null);

      add("Active profile updated", "success");
    } catch (err) {
      add(
        err instanceof Error ? err.message : "Failed to activate",
        "error"
      );
    }
  }

  useEffect(() => {
    if (!profiles.length) return;

    const match = profiles.find(
      (p) => p.id === activeProfile?.id
    );

    if (match && !match.isActive) {
      setProfiles((prev) =>
        prev.map((p) => ({
          ...p,
          isActive: p.id === activeProfile?.id,
        }))
      );
    }
  }, [activeProfile]);

  // ─── UI ───────────────────────────────────────────────────
  return (
    <div className="page-shell">
      <header className="px-5">
        <h1 className="text-4xl font-semibold tracking-tight">
          Profiles
        </h1>
        <p className="mt-1 text-muted-foreground">
          {profiles.length} profile
          {profiles.length !== 1 ? "s" : ""}
        </p>
      </header>

      <main className="p-10">
        {loading ? (
          <div className="profiles-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="profile-skeleton" />
            ))}
          </div>
        ) : (
          <div className="profiles-grid">
            {/* Add new */}
            <Link
              href={`/console/profiles/new?userId=${userId}`}
              className="profile-card add-new-card"
            >
              <div className="add-plus">＋</div>
              <div>Create New Profile</div>
            </Link>

            {/* Profiles */}
            {profiles.map((p) => (
              <Link
                key={p.id}
                href={`/console/profiles/${p.id}?userId=${userId}`}
                className={`profile-card ${p.isActive ? "active-card" : ""}`}
              >
                {/* Avatar */}
                <div className="profile-avatar">{initials(p.name)}</div>
 
                {/* Body */}
                <div className="profile-card-body">
                  <div className="profile-card-header">
                    <span className="profile-name">{p.name}</span>
                    {p.isActive && <span className="badge-active">Active</span>}
                  </div>
                  <div className="profile-meta">
                    {p.preferredRole && (
                      <span className="profile-meta-item">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                        </svg>
                        {p.preferredRole}
                      </span>
                    )}
                    {p.experience && (
                      <span className="profile-meta-item">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                        </svg>
                        {p.experience} exp
                      </span>
                    )}
                    {p.preferredJobLocation && (
                      <span className="profile-meta-item">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7z" /><circle cx="12" cy="9" r="2.5" />
                        </svg>
                        {p.preferredJobLocation}
                      </span>
                    )}
                    <span className="profile-meta-item" style={{ color: "var(--text-muted)" }}>
                      Updated {formatDate(p.updatedAt)}
                    </span>
                  </div>
                </div>
 
                {/* Actions */}
                <div
                  className="profile-card-actions"
                  onClick={(e) => e.preventDefault()}
                >
                  {!p.isActive && (
                    <div
                      className="w-full flex items-center justify-between"
                    >
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={(e) => handleActivate(p.id, e)}
                        disabled={activating === p.id}
                        title="Set as active"
                      >
                        {activating === p.id ? "…" : "Set active"}
                      </button>

                      <button
                        className="btn-icon"
                        onClick={(e) => handleDelete(p.id, e)}
                        disabled={deleting === p.id}
                        title="Delete profile"
                        aria-label="Delete profile"
                      >
                        {deleting === p.id ? (
                          <span style={{ fontSize: 12 }}>…</span>
                        ) : (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}