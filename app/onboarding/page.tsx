// app/onboarding/page.tsx  ← SERVER COMPONENT (no "use client")
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "./_wizard";
import { TOTAL_STEPS } from "./_steps";

export default async function OnboardingPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (user.publicMetadata?.onboardingComplete === true) {
    redirect("/");
  }

  const meta = user.publicMetadata as Record<string, unknown>;
  const currentStep =
    typeof meta.onboardingStep === "number"
      ? Math.min(meta.onboardingStep, TOTAL_STEPS)
      : 1;
  const savedData = (meta.onboardingData as Record<string, unknown>) ?? {};

  return <OnboardingWizard initialStep={currentStep} initialData={savedData} />;
}