"use server";

import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma"; // adjust to your prisma client path

// import { Resend } from "resend";
// const resend = new Resend(process.env.RESEND_API_KEY);

// async function sendSignupEmail(toEmail: string, displayName: string) {
//   if (!process.env.RESEND_API_KEY) {
//     console.warn("RESEND_API_KEY is not configured. Skipping signup email.");
//     return;
//   }
//   await resend.emails.send({
//     from: "Empreso <noreply@empreso.ca>",
//     to: [toEmail],
//     subject: "Welcome to Empreso",
//     text: `Hello ${displayName || "there"},\n\nThank you for completing onboarding with Empreso. Your account is now ready.\n\nWelcome aboard!\nEmpreso Team`,
//   });
// }

/** Save a step's data to Prisma and update Clerk publicMetadata */
export async function saveStepAction(
  step: number,
  formData: FormData
): Promise<{ message: string; nextStep: number }> {
  const user = await currentUser();
  if (!user) throw new Error("Authentication required.");

  const userId = user.id;
  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses?.[0]?.emailAddress ??
    "";

  const existingMeta = (user.publicMetadata as Record<string, unknown>) ?? {};
  const existingData = (existingMeta.onboardingData as Record<string, unknown>) ?? {};

  const str = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" && v.trim() ? v.trim() : null;
  };
  const bool = (key: string) =>
    formData.get(key) === "on" || formData.get(key) === "true";

  let newData: Record<string, unknown> = {};
  // OPTIMIZATION: Get client once instead of per request
  const client = await clerkClient();

  switch (step) {
    case 1: {
      newData = {
        firstName: str("firstName") ?? "",
        lastName: str("lastName") ?? "",
        email: str("email") ?? email,
        phone: str("phone") ?? "",
        city: str("city") ?? "",
        country: str("country") ?? "",
      };
      // OPTIMIZATION: Single upsert instead of separate create/update
      await prisma.user.upsert({
        where: { userId },
        create: {
          userId,
          firstName: newData.firstName as string,
          lastName: newData.lastName as string,
          email: newData.email as string,
          phone: newData.phone as string,
          city: newData.city as string,
          country: newData.country as string,
          // required non-null fields with placeholder defaults
          qualification: "",
          graduationYear: 0,
          fieldOfStudy: "",
          experience: "",
          resume: "",
          preferredJobLocation: "",
          visaStatus: "",
          source: "",
          agreeTerms: false,
        },
        update: {
          firstName: newData.firstName as string,
          lastName: newData.lastName as string,
          email: newData.email as string,
          phone: newData.phone as string,
          city: newData.city as string,
          country: newData.country as string,
        },
      });
      break;
    }
    case 2: {
      newData = { linkedin: str("linkedin") };
      await prisma.user.update({
        where: { userId },
        data: { linkedin: newData.linkedin as string | null },
      });
      break;
    }
    case 3: {
      newData = {
        qualification: str("qualification") ?? "",
        graduationYear: parseInt(str("graduationYear") ?? "0", 10),
        fieldOfStudy: str("fieldOfStudy") ?? "",
      };
      await prisma.user.update({
        where: { userId },
        data: {
          qualification: newData.qualification as string,
          graduationYear: newData.graduationYear as number,
          fieldOfStudy: newData.fieldOfStudy as string,
        },
      });
      break;
    }
    case 4: {
      newData = {
        experience: str("experience") ?? "",
        currentJobRole: str("currentJobRole"),
        currentEmployer: str("currentEmployer"),
      };
      await prisma.user.update({
        where: { userId },
        data: {
          experience: newData.experience as string,
          currentJobRole: newData.currentJobRole as string | null,
          currentEmployer: newData.currentEmployer as string | null,
        },
      });
      break;
    }
    case 5: {
      newData = {
        preferredDeveloperRole: str("preferredDeveloperRole"),
        course: str("course"),
        preferredJobLocation: str("preferredJobLocation") ?? "",
        visaStatus: str("visaStatus") ?? "",
      };
      await prisma.user.update({
        where: { userId },
        data: {
          preferredDeveloperRole: newData.preferredDeveloperRole as string | null,
          course: newData.course as string | null,
          preferredJobLocation: newData.preferredJobLocation as string,
          visaStatus: newData.visaStatus as string,
        },
      });
      break;
    }
    case 6: {
      const agreeTerms = bool("agreeTerms");
      const subscribeUpdates = bool("subscribeUpdates");
      newData = {
        resume: str("resume") ?? "",
        source: str("source") ?? "",
        comments: str("comments"),
        agreeTerms,
        subscribeUpdates,
      };
      await prisma.user.update({
        where: { userId },
        data: {
          resume: newData.resume as string,
          source: newData.source as string,
          comments: newData.comments as string | null,
          agreeTerms,
          subscribeUpdates,
        },
      });

      // Mark onboarding complete in Clerk
      await client.users.updateUser(userId, {
        publicMetadata: {
          ...existingMeta,
          onboardingComplete: true,
          onboardingStep: 6,
          onboardingData: { ...existingData, ...newData },
        },
      });

    //   const displayName =
    //     (existingData.firstName as string) ?? user.firstName ?? user.fullName ?? "there";
    //   if (email) await sendSignupEmail(email, displayName);

      return { message: "Onboarding complete!", nextStep: 6 };
    }
    default:
      throw new Error("Invalid step");
  }

  // Save progress so reload resumes at the right step
  const nextStep = step + 1;
  const mergedData = { ...existingData, ...newData };
  await client.users.updateUser(userId, {
    publicMetadata: {
      ...existingMeta,
      onboardingStep: nextStep,
      onboardingData: mergedData,
    },
  });

  return { message: `Step ${step} saved.`, nextStep };
}