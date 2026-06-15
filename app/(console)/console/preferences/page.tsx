"use client";

import { useEffect, useState, useRef } from "react";
import {
  User,
  Briefcase,
  Crown,
  MapPin,
  Bell,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import SelectField from "@/components/ui/selectField";
import { Input } from "@/components/ui/Input";
import { Field, PreferenceCard } from "@/components/console/PreferenceCard";
import { DEVELOPER_ROLES, EXPERIENCE_OPTIONS, QUALIFICATION_OPTIONS, VISA_OPTIONS } from "@/lib/types";

interface PreferencesData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedin: string;

  city: string;
  country: string;

  qualification: string;
  graduationYear: number;
  fieldOfStudy: string;

  experience: string;
  currentJobRole: string;
  currentEmployer: string;

  preferredDeveloperRole: string;
  preferredJobLocation: string;
  visaStatus: string;

  course: string;
  resume: string;
  source: string;
  comments: string;

  subscribeUpdates: boolean;

  plan: string;
  trialsLeft: number;
  isActive: boolean;
}



export default function PreferencesPage() {
  const [data, setData] = useState<PreferencesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { getToken } = useAuth();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchPreferences();
  }, []);

  async function fetchPreferences() {
    const token = await getToken({ template : "fastapi" })
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/preferences/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function savePreferences(updatedData: PreferencesData) {
    const token = await getToken({ template : "fastapi" })
    try {
      setSaving(true);

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/preferences/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  function updateField(field: string, value: any) {
    if (!data) return;

    const updated = {
      ...data,
      [field]: value,
    };

    setData(updated);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      savePreferences(updated);
    }, 1000);
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        Loading Preferences...
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl p-8">

        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between border-border/50 pb-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">
              Preferences
            </h1>
            <p className="mt-1 text-muted-foreground">
              Manage your profile and career settings
            </p>
          </div>

          <div className="flex items-center gap-3">
            {saving && (
              <div className="rounded-full border px-4 py-2 text-sm">
                Saving changes...
              </div>
            )}

            {saved && (
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-500">
                <CheckCircle size={16} />
                All changes saved
              </div>
            )}
          </div>
        </div>

        {/* ✅ TWO COLUMN FIXED STACK LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">

            {/* PROFILE */}
            <PreferenceCard title="Profile" icon={<User size={18} />}>
              <div className="grid gap-4 md:grid-cols-2">

                <Field label="First Name">
                  <Input value={data.firstName}
                    onChange={(v) => updateField("firstName", v.target.value)} />
                </Field>

                <Field label="Last Name">
                  <Input value={data.lastName}
                    onChange={(v) => updateField("lastName", v.target.value)} />
                </Field>

                <Field label="Phone">
                  <Input value={data.phone}
                    onChange={(v) => updateField("phone", v.target.value)} />
                </Field>

                <Field label="LinkedIn">
                  <Input value={data.linkedin}
                    onChange={(v) => updateField("linkedin", v.target.value)} />
                </Field>

                <Field label="City">
                  <Input value={data.city}
                    onChange={(v) => updateField("city", v.target.value)} />
                </Field>

                <Field label="Country">
                  <Input value={data.country}
                    onChange={(v) => updateField("country", v.target.value)} />
                </Field>

                <div className="md:col-span-2">
                  <Field label="Email">
                    <Input value={data.email} disabled />
                  </Field>
                </div>

              </div>
            </PreferenceCard>

            {/* EDUCATION */}
            <PreferenceCard title="Education" icon={<User size={18} />}>
              <div className="space-y-4">

                <SelectField
                  label="Qualification"
                  value={data.qualification}
                  options={QUALIFICATION_OPTIONS}
                  onChange={(v) => updateField("qualification", v)}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Graduation Year">
                    <Input
                      type="number"
                      value={data.graduationYear}
                      onChange={(v) => updateField("graduationYear", Number(v.target.value))}
                    />
                  </Field>

                  <Field label="Field Of Study">
                    <Input
                      value={data.fieldOfStudy}
                      onChange={(v) => updateField("fieldOfStudy", v.target.value)}
                    />
                  </Field>
                </div>

              </div>
            </PreferenceCard>

            {/* NOTIFICATIONS */}
            <PreferenceCard title="Notifications" icon={<Bell size={18} />}>
              <label className="flex items-center justify-between rounded-xl border p-4">
                <div>
                  <p className="font-medium">Product Updates</p>
                  <p className="text-sm text-muted-foreground">
                    Receive updates and announcements
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={data.subscribeUpdates}
                  onChange={(e) =>
                    updateField("subscribeUpdates", e.target.checked)
                  }
                />
              </label>
            </PreferenceCard>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">

            {/* CAREER */}
            <PreferenceCard title="Career" icon={<Briefcase size={18} />}>
              <div className="space-y-4">

                <SelectField
                  label="Experience"
                  value={data.experience}
                  options={EXPERIENCE_OPTIONS}
                  onChange={(v) => updateField("experience", v)}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Current Role">
                    <Input
                      value={data.currentJobRole}
                      onChange={(v) => updateField("currentJobRole", v.target.value)}
                    />
                  </Field>

                  <Field label="Current Employer">
                    <Input
                      value={data.currentEmployer}
                      onChange={(v) => updateField("currentEmployer", v.target.value)}
                      />
                  </Field>
                </div>
              </div>
            </PreferenceCard>
            
            {/* SUBSCRIPTION */}
            <PreferenceCard title="Subscription" icon={<Crown size={18} />}>
              <div className="grid grid-cols-3 gap-3">

                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">Plan</p>
                  <p className="font-semibold">{data.plan}</p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-semibold text-emerald-500">
                    {data.isActive ? "Active" : "Inactive"}
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">Trials</p>
                  <p className="font-semibold">{data.trialsLeft}</p>
                </div>

              </div>
            </PreferenceCard>

            {/* JOB PREFERENCES */}
            <PreferenceCard title="Job Preferences" icon={<MapPin size={18} />}>
              <div className="space-y-4">

                <SelectField
                  label="Preferred Developer Role"
                  value={data.preferredDeveloperRole}
                  options={DEVELOPER_ROLES}
                  onChange={(v) => updateField("preferredDeveloperRole", v)}
                />

                <Field label="Course / Bootcamp">
                  <Input
                    value={data.course}
                    onChange={(v) => updateField("course", v.target.value)}
                  />
                </Field>

                <Field label="Preferred Job Location">
                  <Input
                    value={data.preferredJobLocation}
                    onChange={(v) => updateField("preferredJobLocation", v.target.value)}
                  />
                </Field>

                <SelectField
                  label="Visa Status"
                  value={data.visaStatus}
                  options={VISA_OPTIONS}
                  onChange={(v) => updateField("visaStatus", v)}
                />

                {/* Resume UI */}
                <div className="rounded-xl border p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">Resume</p>
                    <p className="text-xs text-muted-foreground">
                      Current resume uploaded
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={data.resume}
                      target="_blank"
                      className="px-3 py-1.5 text-sm border rounded-lg"
                    >
                      View
                    </a>
                    <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg">
                      Replace
                    </button>
                  </div>
                </div>

              </div>
            </PreferenceCard>

          </div>
        </div>
      </div>
    </div>
  );
}

