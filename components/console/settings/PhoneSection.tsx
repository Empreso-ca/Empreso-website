"use client";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

type Props = {
  initialPhone: string | null;
  initialVerified: boolean;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export default function PhoneSection({ initialPhone, initialVerified }: Props) {
  const { getToken } = useAuth();

  const [phone, setPhone] = useState(initialPhone ?? "");
  const [verified, setVerified] = useState(initialVerified);
  const [step, setStep] = useState<"view" | "edit" | "otp">("view");
  const [newPhone, setNewPhone] = useState(initialPhone ?? "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function authedFetch(path: string, body: object) {
    const token = await getToken();
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Something went wrong");
    return data;
  }

  async function handleSendOtp() {
    setLoading(true);
    setError(null);
    try {
      await authedFetch("/api/phone/send-otp", { phone: newPhone });
      setStep("otp");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    setLoading(true);
    setError(null);
    try {
      await authedFetch("/api/phone/verify-otp", { phone: newPhone, otp });
      setPhone(newPhone);
      setVerified(true);
      setStep("view");
      setOtp("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <p className="mb-2 text-sm text-zinc-400">Phone Number</p>

      <div className="rounded-xl border border-zinc-800 bg-[#111111] p-4">
        {step === "view" && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>{phone || "No phone number added"}</span>
              {phone && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    verified
                      ? "bg-green-500/10 text-green-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {verified ? "Verified" : "Unverified"}
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setStep("edit");
                setError(null);
              }}
              className="text-sm text-zinc-400 underline hover:text-white"
            >
              {phone ? "Change" : "Add"}
            </button>
          </div>
        )}

        {step === "edit" && (
          <div className="space-y-3">
            <input
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="+919876543210"
              className="w-full rounded-lg border border-zinc-700 bg-[#0A0A0A] px-3 py-2 text-sm"
            />
            <p className="text-xs text-zinc-500">
              We'll send a verification code to this number on WhatsApp — make
              sure it has WhatsApp installed.
            </p>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={handleSendOtp}
                disabled={loading || !newPhone}
                className="rounded-lg bg-white px-3 py-1.5 text-sm text-black disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send code via WhatsApp"}
              </button>
              <button
                onClick={() => setStep("view")}
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {step === "otp" && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-400">
              Enter the code sent to {newPhone} on WhatsApp
            </p>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
              className="w-full rounded-lg border border-zinc-700 bg-[#0A0A0A] px-3 py-2 text-sm tracking-widest"
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="rounded-lg bg-white px-3 py-1.5 text-sm text-black disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="text-sm text-zinc-400 underline"
              >
                Resend
              </button>
              <button
                onClick={() => setStep("view")}
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}