"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { saveStepAction } from "./_action";
import { STEPS, TOTAL_STEPS } from "./_steps";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StepResume } from "./_step-resume";

// ─── Tiny helper components ───────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-sm font-medium text-foreground">
      {children}
    </label>
  );
}

function Textarea({
  name,
  placeholder,
  defaultValue,
  required,
}: {
  name: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
      required={required}
      rows={3}
      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
    />
  );
}

function Select({
  name,
  defaultValue,
  required,
  children,
}: {
  name: string;
  defaultValue?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue ?? ""}
      required={required}
      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
    >
      {children}
    </select>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round(((current - 1) / (total - 1)) * 100);
  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Step {current} of {total}</span>
        <span>{pct}% complete</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-foreground transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-3 flex justify-between">
        {STEPS.map((s) => (
          <div
            key={s.id}
            className={`flex flex-col items-center gap-1 ${s.id <= current ? "text-foreground" : "text-muted-foreground"}`}
          >
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-all duration-300 ${
                s.id < current
                  ? "bg-foreground text-background"
                  : s.id === current
                    ? "border-2 border-foreground bg-background"
                    : "border border-border bg-background"
              }`}
            >
              {s.id < current ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                s.id
              )}
            </div>
            <span className="hidden text-[10px] sm:block">{s.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step Forms ───────────────────────────────────────────────────────────────

function StepPersonal({ saved }: { saved: Record<string, unknown> }) {
  const { user } = useUser();
  const defaultEmail = user?.primaryEmailAddress?.emailAddress ?? (saved.email as string);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label>First Name *</Label>
        <Input name="firstName" placeholder="Jane" defaultValue={saved.firstName as string} required />
      </div>
      <div>
        <Label>Last Name *</Label>
        <Input name="lastName" placeholder="Doe" defaultValue={saved.lastName as string} required />
      </div>
      <div>
        <Label>Email *</Label>
        <Input name="email" type="email" placeholder="jane@example.com" defaultValue={defaultEmail} readOnly required disabled />
      </div>
      <div>
        <Label>Phone *</Label>
        <Input name="phone" placeholder="+1 555 000 0000" defaultValue={saved.phone as string} required />
      </div>
      <div>
        <Label>City *</Label>
        <Input name="city" placeholder="Toronto" defaultValue={saved.city as string} required />
      </div>
      <div>
        <Label>Country *</Label>
        <Input name="country" placeholder="Canada" defaultValue={saved.country as string} required />
      </div>
    </div>
  );
}

function StepProfessional({ saved }: { saved: Record<string, unknown> }) {
  return (
    <div className="space-y-4">
      <div>
        <Label>LinkedIn Profile</Label>
        <Input name="linkedin" placeholder="https://linkedin.com/in/yourprofile" defaultValue={saved.linkedin as string} />
        <p className="mt-1.5 text-xs text-muted-foreground">Optional — helps employers find you</p>
      </div>
    </div>
  );
}

function StepEducation({ saved }: { saved: Record<string, unknown> }) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Highest Qualification *</Label>
        <Select name="qualification" defaultValue={saved.qualification as string} required>
          <option value="">Select qualification</option>
          <option value="High School">High School</option>
          <option value="Diploma">Diploma</option>
          <option value="Bachelor's">Bachelor's Degree</option>
          <option value="Master's">Master's Degree</option>
          <option value="PhD">PhD</option>
          <option value="Other">Other</option>
        </Select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Graduation Year *</Label>
          <Input
            name="graduationYear"
            type="number"
            placeholder="2022"
            min="1950"
            max="2030"
            defaultValue={saved.graduationYear ? String(saved.graduationYear) : ""}
            required
          />
        </div>
        <div>
          <Label>Field of Study *</Label>
          <Input name="fieldOfStudy" placeholder="Computer Science" defaultValue={saved.fieldOfStudy as string} required />
        </div>
      </div>
    </div>
  );
}

function StepExperience({ saved }: { saved: Record<string, unknown> }) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Years of Experience *</Label>
        <Select name="experience" defaultValue={saved.experience as string} required>
          <option value="">Select experience</option>
          <option value="0-1 years">0–1 years (Entry level)</option>
          <option value="1-3 years">1–3 years</option>
          <option value="3-5 years">3–5 years</option>
          <option value="5-10 years">5–10 years</option>
          <option value="10+ years">10+ years</option>
        </Select>
      </div>
      <div>
        <Label>Current Job Role</Label>
        <Input name="currentJobRole" placeholder="Software Engineer" defaultValue={saved.currentJobRole as string} />
      </div>
      <div>
        <Label>Current Employer</Label>
        <Input name="currentEmployer" placeholder="Acme Corp" defaultValue={saved.currentEmployer as string} />
      </div>
    </div>
  );
}

function StepPreferences({ saved }: { saved: Record<string, unknown> }) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Preferred Developer Role</Label>
        <Select name="preferredDeveloperRole" defaultValue={saved.preferredDeveloperRole as string}>
          <option value="">Select role</option>
          <option value="Frontend Developer">Frontend Developer</option>
          <option value="Backend Developer">Backend Developer</option>
          <option value="Full Stack Developer">Full Stack Developer</option>
          <option value="Mobile Developer">Mobile Developer</option>
          <option value="DevOps Engineer">DevOps Engineer</option>
          <option value="Data Engineer">Data Engineer</option>
          <option value="Machine Learning Engineer">Machine Learning Engineer</option>
          <option value="Other">Other</option>
        </Select>
      </div>
      <div>
        <Label>Course / Bootcamp (if any)</Label>
        <Input name="course" placeholder="e.g. Full Stack Bootcamp" defaultValue={saved.course as string} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Preferred Job Location *</Label>
          <Input name="preferredJobLocation" placeholder="Remote, Toronto, etc." defaultValue={saved.preferredJobLocation as string} required />
        </div>
        <div>
          <Label>Visa / Work Status *</Label>
          <Select name="visaStatus" defaultValue={saved.visaStatus as string} required>
            <option value="">Select status</option>
            <option value="Citizen">Citizen</option>
            <option value="Permanent Resident">Permanent Resident</option>
            <option value="Work Permit">Work Permit</option>
            <option value="Open Work Permit">Open Work Permit</option>
            <option value="Student Visa">Student Visa</option>
            <option value="Requires Sponsorship">Requires Sponsorship</option>
          </Select>
        </div>
      </div>
    </div>
  );
}

// function StepResume({ saved }: { saved: Record<string, unknown> }) {
//   return (
//     <div className="space-y-4">
//       <div>
//         <Label>Resume URL *</Label>
//         <Input
//           name="resume"
//           placeholder="https://drive.google.com/... or https://yoursite.com/resume.pdf"
//           defaultValue={saved.resume as string}
//           required
//         />
//         <p className="mt-1.5 text-xs text-muted-foreground">
//           Paste a link to your resume (Google Drive, Dropbox, personal site, etc.)
//         </p>
//       </div>
//       <div>
//         <Label>How did you hear about us? *</Label>
//         <Select name="source" defaultValue={saved.source as string} required>
//           <option value="">Select source</option>
//           <option value="LinkedIn">LinkedIn</option>
//           <option value="Google">Google Search</option>
//           <option value="Friend / Referral">Friend / Referral</option>
//           <option value="Social Media">Social Media</option>
//           <option value="Job Board">Job Board</option>
//           <option value="Other">Other</option>
//         </Select>
//       </div>
//       <div>
//         <Label>Anything else you'd like to share?</Label>
//         <Textarea name="comments" placeholder="Tell us anything that might help us match you better..." defaultValue={saved.comments as string} />
//       </div>
//       <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
//         <label className="flex cursor-pointer items-start gap-3">
//           <input
//             type="checkbox"
//             name="agreeTerms"
//             defaultChecked={saved.agreeTerms as boolean}
//             required
//             className="mt-0.5 h-4 w-4 rounded border-border"
//           />
//           <span className="text-sm text-foreground">
//             I agree to the{" "}
//             <a href="/terms" className="underline underline-offset-2 hover:text-muted-foreground">Terms of Service</a>{" "}
//             and{" "}
//             <a href="/privacy" className="underline underline-offset-2 hover:text-muted-foreground">Privacy Policy</a> *
//           </span>
//         </label>
//         <label className="flex cursor-pointer items-start gap-3">
//           <input
//             type="checkbox"
//             name="subscribeUpdates"
//             defaultChecked={saved.subscribeUpdates as boolean}
//             className="mt-0.5 h-4 w-4 rounded border-border"
//           />
//           <span className="text-sm text-muted-foreground">
//             Send me job alerts and platform updates
//           </span>
//         </label>
//       </div>
//     </div>
//   );
// }

const STEP_COMPONENTS = [
  StepPersonal,
  StepProfessional,
  StepEducation,
  StepExperience,
  StepPreferences,
  StepResume,
];

// ─── Wizard (client shell) ────────────────────────────────────────────────────

interface OnboardingWizardProps {
  initialStep: number;
  initialData: Record<string, unknown>;
}

export function OnboardingWizard({ initialStep, initialData }: OnboardingWizardProps) {
  const router = useRouter();
  const { user } = useUser();

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [savedData, setSavedData] = useState<Record<string, unknown>>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setError("");
    setIsSaving(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Capture current form values into savedData so Back shows them
      const stepValues: Record<string, unknown> = {};
      formData.forEach((value, key) => {
        stepValues[key] = value;
      });
      // Handle checkboxes (unchecked boxes don't appear in FormData)
      const form = e.currentTarget;
      form.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((cb) => {
        stepValues[cb.name] = cb.checked;
      });

      const { nextStep, message } = await saveStepAction(currentStep, formData);
      console.log(message);

      // Merge into accumulated data after successful save
      setSavedData((prev) => ({ ...prev, ...stepValues }));

      if (currentStep === TOTAL_STEPS) {
        await new Promise((r) => setTimeout(r, 500));
        await user.reload();
        router.replace("/");
      } else {
        setCurrentStep(nextStep);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save your details. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const step = STEPS[currentStep - 1];
  const StepForm = STEP_COMPONENTS[currentStep - 1];

  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <div className="rounded-3xl border border-border bg-card/40 p-10 shadow-sm">
        {/* Header */}
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
            Complete your profile
          </p>
          <h1 className="text-4xl font-semibold">{step.title}</h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {step.subtitle}
          </p>
        </div>

        {/* Progress */}
        <ProgressBar current={currentStep} total={TOTAL_STEPS} />

        {/* Form */}
        <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
          <StepForm saved={savedData} />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button type="button" variant="outline" size="lg" onClick={handleBack}>
                  Back
                </Button>
              )}
              <Button type="submit" disabled={isSaving} size="lg">
                {isSaving
                  ? "Saving..."
                  : currentStep === TOTAL_STEPS
                    ? "Finish onboarding"
                    : "Continue"}
              </Button>
            </div>
            <SignOutButton>
              <Button type="button" variant="outline" size="lg">
                Sign out
              </Button>
            </SignOutButton>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Your progress is saved automatically — you can safely close and come back.
        </p>
      </div>
    </main>
  );
}