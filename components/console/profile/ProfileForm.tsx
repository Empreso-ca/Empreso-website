"use client";

import React, { useEffect, useState } from "react";
import { DISABILITY_OPTIONS, EXPERIENCE_OPTIONS, GENDER_OPTIONS, NOTICE_OPTIONS, ProfileCreate, ProfileUpdate, SOURCE_OPTIONS, VETERAN_OPTIONS, VISA_OPTIONS, WORK_MODE_OPTIONS } from "@/lib/types";
import { UserPrefill, Profile } from "@/lib/types";
import { FormField, FormSection, ToggleField } from "./FormField";
import { PreferenceCard, Field } from "../PreferenceCard";
import { Input } from "@/components/ui/Input";
import { Briefcase, DollarSign, FileText, GraduationCap, InfoIcon, LinkIcon, MapPin, Pencil } from "lucide-react";
import SelectField from "@/components/ui/selectField";
import { QUALIFICATION_OPTIONS,  } from "@/lib/types";
import { Textarea } from "@/components/ui/Textarea";
import { useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { uploadProfileResume } from "@/lib/api-client";


// ─── Types ──────────────────────────────────────────────────
interface FormValues {
  name: string;
  dateOfBirth: string;
  preferredRole: string;
  experience: string;
  currentJobRole: string;
  currentEmployer: string;
  skills: string;
  qualification: string;
  graduationYear: string;
  fieldOfStudy: string;
  linkedin: string;
  github: string;
  portfolio: string;
  resume: string;
  visaStatus: string;
  workAuthorization: string;
  requiresSponsorship: boolean;
  preferredJobLocation: string;
  preferredWorkMode: string;
  willingToRelocate: boolean;
  currentCTC: string;
  expectedCTC: string;
  salaryExpectation: string;
  noticePeriod: string;
  gender: string;
  disabilityStatus: string;
  veteranStatus: string;
  ethnicity: string;
  citizenship: string;
  source: string;
  agreeTerms: boolean;
}

type FieldErrors = Partial<Record<keyof FormValues, string>>;

interface Props {
  userId: string;
  user: UserPrefill;
  initial?: Profile | null;               // present when editing
  onSubmit: (data: ProfileCreate | ProfileUpdate) => Promise<void>;
  submitLabel: string;
  submitting: boolean;
  onCancel: () => void;
}

function toValues(profile?: Profile | null, user?: UserPrefill): FormValues {
  const base: FormValues = {
    name: "",
    dateOfBirth: "",
    preferredRole: "",
    experience: "",
    currentJobRole: "",
    currentEmployer: "",
    skills: "",
    qualification: "",
    graduationYear: "",
    fieldOfStudy: "",
    linkedin: "",
    github: "",
    portfolio: "",
    resume: "",
    visaStatus: "",
    workAuthorization: "",
    requiresSponsorship: false,
    preferredJobLocation: "",
    preferredWorkMode: "",
    willingToRelocate: false,
    currentCTC: "",
    expectedCTC: "",
    salaryExpectation: "",
    noticePeriod: "",
    gender: "",
    disabilityStatus: "",
    veteranStatus: "",
    ethnicity: "",
    citizenship: "",
    source: "",
    agreeTerms: false,
  };

  const fromUser: Partial<FormValues> = user
    ? {
        preferredRole: user.preferredRole ?? "",
        experience: user.experience ?? "",
        currentJobRole: user.currentJobRole ?? "",
        currentEmployer: user.currentEmployer ?? "",
        qualification: user.qualification ?? "",
        graduationYear: String(user.graduationYear ?? ""),
        fieldOfStudy: user.fieldOfStudy ?? "",
        linkedin: user.linkedin ?? "",
        resume: user.resume ?? "",
        visaStatus: user.visaStatus ?? "",
        preferredJobLocation: user.preferredJobLocation ?? "",
      }
    : {};

  const fromProfile: Partial<FormValues> = profile
    ? {
        name: profile.name ?? "",
        dateOfBirth: profile.dateOfBirth ?? "",
        preferredRole: profile.preferredRole ?? "",
        experience: profile.experience ?? "",
        currentJobRole: profile.currentJobRole ?? "",
        currentEmployer: profile.currentEmployer ?? "",
        skills: profile.skills?? "",
        qualification: profile.qualification ?? "",
        graduationYear: String(profile.graduationYear ?? ""),
        fieldOfStudy: profile.fieldOfStudy ?? "",
        linkedin: profile.linkedin ?? "",
        github: profile.github ?? "",
        portfolio: profile.portfolio ?? "",
        resume: profile.resume ?? "",
        visaStatus: profile.visaStatus ?? "",
        workAuthorization: profile.workAuthorization ?? "",
        requiresSponsorship: profile.requiresSponsorship ?? false,
        preferredJobLocation: profile.preferredJobLocation ?? "",
        preferredWorkMode: profile.preferredWorkMode ?? "",
        willingToRelocate: profile.willingToRelocate ?? false,
        currentCTC: profile.currentCTC ?? "",
        expectedCTC: profile.expectedCTC ?? "",
        salaryExpectation: profile.salaryExpectation ?? "",
        noticePeriod: profile.noticePeriod ?? "",
        gender: profile.gender ?? "",
        disabilityStatus: profile.disabilityStatus ?? "",
        veteranStatus: profile.veteranStatus ?? "",
        ethnicity: profile.ethnicity ?? "",
        citizenship: profile.citizenship ?? "",
        source: profile.source ?? "",
        agreeTerms: profile.agreeTerms ?? false,
      }
    : {};

  return {
    ...base,
    ...fromUser,
    ...fromProfile, // profile overrides user safely
  };
}

// ─── Main component ─────────────────────────────────────────
export default function ProfileForm({
  userId,
  user,
  initial,
  onSubmit,
  submitLabel,
  submitting,
  onCancel,
}: Props) {
  const [values, setValues] = useState<FormValues>(() =>
    toValues(undefined, user)
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  useEffect(() => {
    return setValues(toValues(initial, user));
  }, [initial, user]);
  
  const [errors, setErrors] = useState<FieldErrors>({});
  const { getToken } = useAuth();

  function set<K extends keyof FormValues>(key: K, val: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const errs: FieldErrors = {};
    if (!values.name.trim()) errs.name = "Profile name is required";
    if (!values.agreeTerms) errs.agreeTerms = "You must agree to the terms";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleResumeUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const token = await getToken({ template: "fastapi" });
    const file = e.target.files?.[0];
    if (!token || !file) return;

    try {
      setUploadingResume(true);

      const formData = new FormData();
      formData.append("resume", file);

      const res = await uploadProfileResume(initial?.id, formData, token);

      set("resume", res.resumeUrl);
      
    } finally {
      setUploadingResume(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const payload: ProfileCreate | ProfileUpdate = {
      ...(!initial && { userId }),
      name: values.name,
      dateOfBirth: values.dateOfBirth || undefined,
      preferredRole: values.preferredRole || undefined,
      experience: values.experience || undefined,
      currentJobRole: values.currentJobRole || undefined,
      currentEmployer: values.currentEmployer || undefined,
      skills: values.skills || undefined,
      qualification: values.qualification || undefined,
      graduationYear: values.graduationYear ? Number(values.graduationYear) : undefined,
      fieldOfStudy: values.fieldOfStudy || undefined,
      linkedin: values.linkedin || undefined,
      github: values.github || undefined,
      portfolio: values.portfolio || undefined,
      resume: values.resume || undefined,
      visaStatus: values.visaStatus || undefined,
      workAuthorization: values.workAuthorization || undefined,
      requiresSponsorship: values.requiresSponsorship,
      preferredJobLocation: values.preferredJobLocation || undefined,
      preferredWorkMode: values.preferredWorkMode || undefined,
      willingToRelocate: values.willingToRelocate,
      currentCTC: values.currentCTC || undefined,
      expectedCTC: values.expectedCTC || undefined,
      salaryExpectation: values.salaryExpectation || undefined,
      noticePeriod: values.noticePeriod || undefined,
      gender: values.gender || undefined,
      disabilityStatus: values.disabilityStatus || undefined,
      veteranStatus: values.veteranStatus || undefined,
      ethnicity: values.ethnicity || undefined,
      citizenship: values.citizenship || undefined,
      source: values.source || undefined,
      agreeTerms: values.agreeTerms,
    };

    await onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="px-5 pt-6">
          <div className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            <label className="text-sm font-medium text-muted-foreground">
              Profile Name
            </label>
          </div>
          <Input
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Untitled (eg. SDE Profile / ML Profile)"
            className="h-auto border-none bg-transparent p-0 text-5xl font-bold leading-tight
            shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 placeholder:opacity-20"
            />
      </div>

      <div className="m-10">
        {/* ── Fixed user banner ── */}
        <div className="user-info-banner rounded-t-3xl">
          <div style={{ flex: 1 }}>
            <p className="user-info-banner-label">Account info · read-only</p>
            <div className="user-info-grid justify-between">
              <div className="user-info-item">
                <span className="user-info-item-label">Name</span>
                <span className="user-info-item-value">
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <div className="user-info-item">
                <span className="user-info-item-label">Email</span>
                <span className="user-info-item-value">{user.email}</span>
              </div>
              <div className="user-info-item">
                <span className="user-info-item-label">Phone</span>
                <span className="user-info-item-value">{user.phone}</span>
              </div>
              <div className="user-info-item">
                <span className="user-info-item-label">Date of Birth
                  <Input className="h-6"
                    type="date"
                    value={values.dateOfBirth}
                    onChange={(e) => set("dateOfBirth", e.target.value)}
                    />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Form body ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start m-5">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">

            {/* EDUCATION */}
            <PreferenceCard
              title="Education"
              icon={<GraduationCap size={18} />}
            >
              <div className="space-y-4">

                <SelectField
                  label="Qualification"
                  value={values.qualification}
                  options={QUALIFICATION_OPTIONS}
                  onChange={(v) => set("qualification", v)}
                />

                <div className="grid gap-4 md:grid-cols-2">

                  <Field label="Graduation Year">
                    <Input
                      type="text" placeholder="e.g. 2026"
                      value={values.graduationYear}
                      onChange={(e) =>
                        set("graduationYear", e.target.value)
                      }
                    />
                  </Field>

                  <Field label="Field Of Study">
                    <Input placeholder="e.g. Computer Science Engineering"
                      value={values.fieldOfStudy}
                      onChange={(e) =>
                        set("fieldOfStudy", e.target.value)
                      }
                    />
                  </Field>

                </div>

              </div>
            </PreferenceCard>

            
            {/* RESUME */}
            <PreferenceCard
              title="Resume"
              icon={<FileText size={18} />}
            >
              <div className="rounded-xl border p-4 flex items-center justify-between">

                <div>
                  <p className="font-medium">
                    {values.resume ? "Resume Uploaded" : "No Resume Uploaded"}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {values.resume
                      ? "View or replace your latest resume"
                      : "Upload your resume in PDF format"}
                  </p>
                </div>

                <div className="flex gap-2">
                  {values.resume && (
                    <a
                      href={values.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border px-3 py-2 text-sm"
                    >
                      View
                    </a>
                  )}

                  <button
                    type="button"
                    disabled={uploadingResume}
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
                  >
                    {uploadingResume
                      ? "Uploading..."
                      : values.resume
                      ? "Replace"
                      : "Upload Resume"}
                  </button>
                </div>

              </div>

              <input
                hidden
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleResumeUpload}
              />
            </PreferenceCard>

            {/* LINKS */}
            <PreferenceCard
              title="Professional Links"
              icon={<LinkIcon size={18} />}
            >
              <div className="space-y-4">

                <Field label="LinkedIn profile URL">
                  <Input placeholder="e.g. https://linkedin.com/in/username"
                    value={values.linkedin}
                    onChange={(e) =>
                      set("linkedin", e.target.value)
                    }
                  />
                </Field>

                <Field label="GitHub profile URL">
                  <Input placeholder="e.g. https://github.com/username"
                    value={values.github}
                    onChange={(e) =>
                      set("github", e.target.value)
                    }
                  />
                </Field>

                <Field label="Portfolio link">
                  <Input placeholder="Personal Website"
                    value={values.portfolio}
                    onChange={(e) =>
                      set("portfolio", e.target.value)
                    }
                  />
                </Field>

              </div>
            </PreferenceCard>
            

            <PreferenceCard title="Diversity & Inclusion">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <SelectField
                    label="Gender"
                    value={values.gender}
                    options={GENDER_OPTIONS}
                    onChange={(v) => set("gender", v)}
                    />
                  
                  <SelectField
                    label="Veteran Status"
                    value={values.veteranStatus}
                    options={VETERAN_OPTIONS}
                    onChange={(v) => set("veteranStatus", v)}
                  />
                </div>

                <SelectField
                  label="Disability Status"
                  value={values.disabilityStatus}
                  options={DISABILITY_OPTIONS}
                  onChange={(v) => set("disabilityStatus", v)}
                />
                
                <Field label="Ethnicity">
                  <Input
                    placeholder="e.g. Asian, Hispanic, White…"
                    value={values.ethnicity}
                    onChange={(e) => set("ethnicity", (e.target as HTMLInputElement).value)}
                    >
                  </Input>
                </Field>

                <Field label="Citizenship">
                  <Input
                  placeholder="e.g. US Citizen, Indian National"
                    value={values.citizenship}
                    onChange={(e) => set("citizenship", (e.target as HTMLInputElement).value)}
                    >
                  </Input>
                </Field>
                
              </div>
            </PreferenceCard>

          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">

            {/* PROFESSIONAL */}
            <PreferenceCard
              title="Professional"
              icon={<Briefcase size={18} />}
            >
              <div className="space-y-4">

                <Field label="Preferred Role">
                  <Input placeholder="e.g. Full Stack Developer"
                    value={values.preferredRole}
                    onChange={(e) =>
                      set("preferredRole", e.target.value)
                    }
                  />
                </Field>

                <SelectField
                  label="Experience"
                  value={values.experience}
                  options={EXPERIENCE_OPTIONS}
                  onChange={(v) => set("experience", v)}
                />

                <div className="grid gap-4 md:grid-cols-2">

                  <Field label="Current Role">
                    <Input placeholder="N/A if not applicable"
                      value={values.currentJobRole}
                      onChange={(e) =>
                        set("currentJobRole", e.target.value)
                      }
                    />
                  </Field>

                  <Field label="Current Employer">
                    <Input placeholder="Current Company name"
                      value={values.currentEmployer}
                      onChange={(e) =>
                        set("currentEmployer", e.target.value)
                      }
                    />
                  </Field>

                </div>

                <Field label="Skills">
                  <Textarea placeholder="e.g. Java, Python, Spring Boot... etc"
                    value={values.skills}
                    onChange={(e) =>
                      set("skills", e.target.value)
                    }
                  />
                </Field>

              </div>
            </PreferenceCard>

            {/* JOB PREFERENCES */}
            <PreferenceCard
              title="Job Preferences"
              icon={<MapPin size={18} />}
            >
              <div className="space-y-4">

                <Field label="Preferred Location">
                  <Input placeholder="Canada, Toronto"
                    value={values.preferredJobLocation}
                    onChange={(e) =>
                      set("preferredJobLocation", e.target.value)
                    }
                  />
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <SelectField
                    label="Work Mode"
                    value={values.preferredWorkMode}
                    options={WORK_MODE_OPTIONS}
                    onChange={(v) =>
                      set("preferredWorkMode", v)
                    }
                    />

                  <SelectField
                    label="Visa Status"
                    value={values.visaStatus}
                    options={VISA_OPTIONS}
                    onChange={(v) => set("visaStatus", v)}
                  />
                </div>

                <ToggleField
                  label="Do you now or will you in the future Require Visa Sponsorship?"
                  checked={values.requiresSponsorship}
                  onChange={(v) =>
                    set("requiresSponsorship", v)
                  }
                />

                <ToggleField
                  label="Are you willing To Relocate?"
                  checked={values.willingToRelocate}
                  onChange={(v) =>
                    set("willingToRelocate", v)
                  }
                />

              </div>
            </PreferenceCard>

            {/* COMPENSATION */}
            <PreferenceCard
              title="Compensation"
              icon={<DollarSign size={18} />}
            >
              <div className="grid gap-4 md:grid-cols-2">

                <Field label="Current CTC">
                  <Input
                    value={values.currentCTC}
                    onChange={(e) =>
                      set("currentCTC", e.target.value)
                    }
                  />
                </Field>

                <Field label="Expected CTC">
                  <Input
                    value={values.expectedCTC}
                    onChange={(e) =>
                      set("expectedCTC", e.target.value)
                    }
                  />
                </Field>

                <Field label="Salary Range">
                  <Input
                    value={values.salaryExpectation}
                    onChange={(e) =>
                      set("salaryExpectation", e.target.value)
                    }
                  />
                </Field>

                <SelectField
                  label="Notice Period"
                  value={values.noticePeriod}
                  options={NOTICE_OPTIONS}
                  onChange={(v) =>
                    set("noticePeriod", v)
                  }
                />

              </div>
            </PreferenceCard>

            <PreferenceCard title="Application Details" icon={<InfoIcon size={18} />}>
              <div className="space-y-4">

                <SelectField
                  label="How did you hear about the job"
                  value={values.source}
                  options={SOURCE_OPTIONS}
                  onChange={(v) => set("source", v)}
                />

                <ToggleField
                  label="I agree to the terms and conditions"
                  checked={values.agreeTerms}
                  onChange={(v) =>
                    set("agreeTerms", v)
                  }
                />

              </div>
            </PreferenceCard>

          </div>
        </div>

        {/* Footer */}
        <div className="form-footer">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Saving…
              </>
            ) : submitLabel}
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}