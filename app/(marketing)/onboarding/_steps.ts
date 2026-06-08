export const STEPS = [
  {
    id: 1,
    key: "personal",
    title: "Personal Info",
    subtitle: "Tell us who you are",
    fields: ["firstName", "lastName", "email", "phone", "city", "country"],
  },
  {
    id: 2,
    key: "professional",
    title: "Professional Links",
    subtitle: "Your online presence",
    fields: ["linkedin"],
  },
  {
    id: 3,
    key: "education",
    title: "Education",
    subtitle: "Your academic background",
    fields: ["qualification", "graduationYear", "fieldOfStudy"],
  },
  {
    id: 4,
    key: "experience",
    title: "Work Experience",
    subtitle: "Where you've been",
    fields: ["experience", "currentJobRole", "currentEmployer"],
  },
  {
    id: 5,
    key: "preferences",
    title: "Career Goals",
    subtitle: "Where you're headed",
    fields: ["preferredDeveloperRole", "course", "preferredJobLocation", "visaStatus"],
  },
  {
    id: 6,
    key: "resume",
    title: "Resume & Finish",
    subtitle: "Upload your resume and agree to terms",
    fields: ["resume", "source", "comments", "agreeTerms", "subscribeUpdates"],
  },
] as const;

export type StepKey = (typeof STEPS)[number]["key"];
export const TOTAL_STEPS = STEPS.length;