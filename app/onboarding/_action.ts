"use server";

import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma"; // adjust to your prisma client path

import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);


type SignupEmailData = {
  userId    : string;
  firstName : string;
  lastName  : string;
  email     : string;
  phone     : string;
  file      : string;
};
async function sendSignupEmail(user : SignupEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not configured. Skipping signup email.");
    return;
  }
  await resend.emails.send({
    from: "Empreso <noreply@empreso.ca>",
    to: ["empreso.dev@gmail.com", "contact@empreso.ca"],
    subject: `New User Onboarding ${user.firstName} ${user.lastName}`,
    html: `
    <!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Empreso Notification</title>

<style>
  body {
    margin: 0;
    padding: 0;
    background-color: #0b0b0c;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  table {
    border-collapse: collapse;
  }

  @media only screen and (max-width: 600px) {
    .container {
      width: 100% !important;
    }

    .padding {
      padding: 20px !important;
    }

    .stack {
      display: block !important;
      width: 100% !important;
      text-align: left !important;
    }
  }
</style>
</head>

<body>

<table width="100%" bgcolor="#0b0b0c">
<tr>
<td align="center">

<!-- CONTAINER -->
<table width="600" class="container" style="max-width:600px; background:#121214; border:1px solid rgba(255,255,255,0.06); border-radius:12px; overflow:hidden;">

  <!-- HEADER -->
  <tr>
    <td align="center" style="padding:30px 20px; border-bottom:1px solid rgba(255,255,255,0.05); background: radial-gradient(circle at top, rgba(0,192,127,0.15), transparent);">
      <div style="color:#00c07f; font-weight:700; font-size:18px; letter-spacing:1px;">
        EMPRESO
      </div>
      <div style="color:#ffffff; font-size:22px; font-weight:600; margin-top:8px;">
        New User Onboarded
      </div>
    </td>
  </tr>

  <!-- CONTENT -->
  <tr>
    <td class="padding" style="padding:28px;">

      <div style="text-align:center; color:#a1a1aa; font-size:14px; margin-bottom:24px;">
        A new user has successfully completed onboarding.
      </div>

      <!-- CARD -->
      <table width="100%" style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:20px;">
        
        <tr>
          <td style="color:#ffffff; font-size:16px; font-weight:600; padding-bottom:12px;">
            User Details
          </td>
        </tr>

        <!-- ROW -->
        <tr>
          <td>
            <table width="100%" style="padding:10px 0; border-bottom:1px dashed rgba(255,255,255,0.05);">
              <tr>
                <td style="color:#71717a; font-size:13px;">User ID</td>
                <td align="right" style="color:#e4e4e7; font-size:13px; font-weight:500;">
                  ${user.userId}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ROW -->
        <tr>
          <td>
            <table width="100%" style="padding:10px 0; border-bottom:1px dashed rgba(255,255,255,0.05);">
              <tr>
                <td style="color:#71717a; font-size:13px;">Name</td>
                <td align="right" style="color:#e4e4e7; font-size:13px; font-weight:500;">
                  ${user.firstName} ${user.lastName}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ROW -->
        <tr>
          <td>
            <table width="100%" style="padding:10px 0; border-bottom:1px dashed rgba(255,255,255,0.05);">
              <tr>
                <td style="color:#71717a; font-size:13px;">Email</td>
                <td align="right" style="color:#e4e4e7; font-size:13px; font-weight:500;">
                  ${user.email}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ROW -->
        <tr>
          <td>
            <table width="100%" style="padding:10px 0; border-bottom:1px dashed rgba(255,255,255,0.05);">
              <tr>
                <td style="color:#71717a; font-size:13px;">Phone</td>
                <td align="right" style="color:#e4e4e7; font-size:13px; font-weight:500;">
                  ${user.phone}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ROW -->
        <tr>
          <td>
            <table width="100%" style="padding:10px 0; border-bottom:1px dashed rgba(255,255,255,0.05);">
              <tr>
                <td style="color:#71717a; font-size:13px;">Time</td>
                <td align="right" style="color:#e4e4e7; font-size:13px; font-weight:500;">
                  ${new Date().toLocaleString()}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FILE ROW -->
        <tr>
          <td>
            <table width="100%" style="padding:10px 0;">
              <tr>
                <td style="color:#71717a; font-size:13px;">File</td>
                <td align="right" style="font-size:13px;">
                  <a href="${user.file}" target="_blank" style="color:#00c07f; text-decoration:none; font-weight:500;">
                    View File ↗
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>


      </table>

    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td align="center" style="padding:20px; font-size:12px; color:#71717a; border-top:1px solid rgba(255,255,255,0.05);">
      This is an automated message from Empreso.<br/>
      © ${new Date().getFullYear()} Empreso. All rights reserved.
    </td>
  </tr>

</table>

</td>
</tr>
</table>

</body>
</html>
    `
  });
}

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

      const mergedData = { ...existingData, ...newData };

      const finalUserData = {
        userId,
        firstName: (mergedData.firstName as string) ?? "",
        lastName: (mergedData.lastName as string) ?? "",
        email:
          (mergedData.email as string) ||
          user.primaryEmailAddress?.emailAddress ||
          "",
        phone: (mergedData.phone as string) ?? "",
        file: (mergedData.resume as string) ?? "",
      };
      
      await sendSignupEmail(finalUserData);

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