"use server";

import { currentUser, clerkClient } from "@clerk/nextjs/server";

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
//   await resend.emails.send({
//     from: "Empreso <noreply@empreso.ca>",
//     to: ["empreso.dev@gmail.com", "contact@empreso.ca"],
//     subject: `New User Onboarding ${user.firstName} ${user.lastName}`,
//     html: `
//     <!DOCTYPE html>
// <html>
// <head>
// <meta charset="utf-8">
// <meta name="viewport" content="width=device-width, initial-scale=1">
// <title>Empreso Notification</title>

// <style>
//   body {
//     margin: 0;
//     padding: 0;
//     background-color: #0b0b0c;
//     font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
//   }

//   table {
//     border-collapse: collapse;
//   }

//   @media only screen and (max-width: 600px) {
//     .container {
//       width: 100% !important;
//     }

//     .padding {
//       padding: 20px !important;
//     }

//     .stack {
//       display: block !important;
//       width: 100% !important;
//       text-align: left !important;
//     }
//   }
// </style>
// </head>

// <body>

// <table width="100%" bgcolor="#0b0b0c">
// <tr>
// <td align="center">

// <!-- CONTAINER -->
// <table width="600" class="container" style="max-width:600px; background:#121214; border:1px solid rgba(255,255,255,0.06); border-radius:12px; overflow:hidden;">

//   <!-- HEADER -->
//   <tr>
//     <td align="center" style="padding:30px 20px; border-bottom:1px solid rgba(255,255,255,0.05); background: radial-gradient(circle at top, rgba(0,192,127,0.15), transparent);">
//       <div style="color:#00c07f; font-weight:700; font-size:18px; letter-spacing:1px;">
//         EMPRESO
//       </div>
//       <div style="color:#ffffff; font-size:22px; font-weight:600; margin-top:8px;">
//         New User Onboarded
//       </div>
//     </td>
//   </tr>

//   <!-- CONTENT -->
//   <tr>
//     <td class="padding" style="padding:28px;">

//       <div style="text-align:center; color:#a1a1aa; font-size:14px; margin-bottom:24px;">
//         A new user has successfully completed onboarding.
//       </div>

//       <!-- CARD -->
//       <table width="100%" style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:20px;">
        
//         <tr>
//           <td style="color:#ffffff; font-size:16px; font-weight:600; padding-bottom:12px;">
//             User Details
//           </td>
//         </tr>

//         <!-- ROW -->
//         <tr>
//           <td>
//             <table width="100%" style="padding:10px 0; border-bottom:1px dashed rgba(255,255,255,0.05);">
//               <tr>
//                 <td style="color:#71717a; font-size:13px;">User ID</td>
//                 <td align="right" style="color:#e4e4e7; font-size:13px; font-weight:500;">
//                   ${user.userId}
//                 </td>
//               </tr>
//             </table>
//           </td>
//         </tr>

//         <!-- ROW -->
//         <tr>
//           <td>
//             <table width="100%" style="padding:10px 0; border-bottom:1px dashed rgba(255,255,255,0.05);">
//               <tr>
//                 <td style="color:#71717a; font-size:13px;">Name</td>
//                 <td align="right" style="color:#e4e4e7; font-size:13px; font-weight:500;">
//                   ${user.firstName} ${user.lastName}
//                 </td>
//               </tr>
//             </table>
//           </td>
//         </tr>

//         <!-- ROW -->
//         <tr>
//           <td>
//             <table width="100%" style="padding:10px 0; border-bottom:1px dashed rgba(255,255,255,0.05);">
//               <tr>
//                 <td style="color:#71717a; font-size:13px;">Email</td>
//                 <td align="right" style="color:#e4e4e7; font-size:13px; font-weight:500;">
//                   ${user.email}
//                 </td>
//               </tr>
//             </table>
//           </td>
//         </tr>

//         <!-- ROW -->
//         <tr>
//           <td>
//             <table width="100%" style="padding:10px 0; border-bottom:1px dashed rgba(255,255,255,0.05);">
//               <tr>
//                 <td style="color:#71717a; font-size:13px;">Phone</td>
//                 <td align="right" style="color:#e4e4e7; font-size:13px; font-weight:500;">
//                   ${user.phone}
//                 </td>
//               </tr>
//             </table>
//           </td>
//         </tr>

//         <!-- ROW -->
//         <tr>
//           <td>
//             <table width="100%" style="padding:10px 0; border-bottom:1px dashed rgba(255,255,255,0.05);">
//               <tr>
//                 <td style="color:#71717a; font-size:13px;">Time</td>
//                 <td align="right" style="color:#e4e4e7; font-size:13px; font-weight:500;">
//                   ${new Date().toLocaleString()}
//                 </td>
//               </tr>
//             </table>
//           </td>
//         </tr>

//         <!-- FILE ROW -->
//         <tr>
//           <td>
//             <table width="100%" style="padding:10px 0;">
//               <tr>
//                 <td style="color:#71717a; font-size:13px;">File</td>
//                 <td align="right" style="font-size:13px;">
//                   <a href="${user.file}" target="_blank" style="color:#00c07f; text-decoration:none; font-weight:500;">
//                     View File ↗
//                   </a>
//                 </td>
//               </tr>
//             </table>
//           </td>
//         </tr>


//       </table>

//     </td>
//   </tr>

//   <!-- FOOTER -->
//   <tr>
//     <td align="center" style="padding:20px; font-size:12px; color:#71717a; border-top:1px solid rgba(255,255,255,0.05);">
//       This is an automated message from Empreso.<br/>
//       © ${new Date().getFullYear()} Empreso. All rights reserved.
//     </td>
//   </tr>

// </table>

// </td>
// </tr>
// </table>

// </body>
// </html>
//     `
//   });
}

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

  const str = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" && v.trim() ? v.trim() : null;
  };

  const bool = (key: string) =>
    formData.get(key) === "on" || formData.get(key) === "true";

  let payload: Record<string, any> = {
    step,
    userId,
  };

  // STEP 1
  if (step === 1) {
    payload = {
      ...payload,
      firstName: str("firstName") ?? "",
      lastName: str("lastName") ?? "",
      email: str("email") ?? email,
      phone: str("phone") ?? "",
      city: str("city") ?? "",
      country: str("country") ?? "",
    };
  }

  // STEP 2
  if (step === 2) {
    payload.linkedin = str("linkedin");
  }

  // STEP 3
  if (step === 3) {
    payload = {
      ...payload,
      qualification: str("qualification") ?? "",
      graduationYear: parseInt(str("graduationYear") ?? "0", 10),
      fieldOfStudy: str("fieldOfStudy") ?? "",
    };
  }

  // STEP 4
  if (step === 4) {
    payload = {
      ...payload,
      experience: str("experience") ?? "",
      currentJobRole: str("currentJobRole"),
      currentEmployer: str("currentEmployer"),
    };
  }

  // STEP 5
  if (step === 5) {
    payload = {
      ...payload,
      preferredDeveloperRole: str("preferredDeveloperRole"),
      course: str("course"),
      preferredJobLocation: str("preferredJobLocation") ?? "",
      visaStatus: str("visaStatus") ?? "",
    };
  }

  // STEP 6
  if (step === 6) {
    payload = {
      ...payload,
      resume: str("resume") ?? "",
      source: str("source") ?? "",
      comments: str("comments"),
      agreeTerms: bool("agreeTerms"),
      subscribeUpdates: bool("subscribeUpdates"),
    };
  }

  // CALL FASTAPI
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/onboarding/save-step`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to save onboarding step");
  }

  const data = await res.json();

  return {
    message: data.message,
    nextStep: data.nextStep,
  };
}