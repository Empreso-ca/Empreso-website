

export enum JobType {
    FULL_TIME = "FULL_TIME",
    PART_TIME = "PART_TIME",
    CONTRACT = "CONTRACT",
    INTERNSHIP = "INTERNSHIP",
    FREELANCE = "FREELANCE",
    REMOTE = "REMOTE",
}

export enum JobStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    CLOSED = "CLOSED",
    EXPIRED = "EXPIRED",
}

export enum ApplicationStatus {
    PENDING = "PENDING",
    REVIEWED = "REVIEWED",
    SHORTLISTED = "SHORTLISTED",
    REJECTED = "REJECTED",
    HIRED = "HIRED",
}

export enum PlanType {
    FREE = "FREE",
    BASIC = "BASIC",
    PREMIUM = "PREMIUM",
    ENTERPRISE = "ENTERPRISE",
}



export interface User {
    id: number;
    userId: string;

    firstName: string;
    lastName: string;

    email: string;
    phone: string;

    linkedin?: string | null;
    city: string;
    country: string;

    qualification: string;
    graduationYear: number;
    fieldOfStudy: string;

    experience: string;
    currentJobRole?: string | null;
    currentEmployer?: string | null;

    preferredDeveloperRole?: string | null;
    course?: string | null;

    resume: string;

    preferredJobLocation: string;
    visaStatus: string;

    source: string;
    comments?: string | null;

    agreeTerms: boolean;
    subscribeUpdates: boolean;

    applications?: Application[];

    subscription?: Subscription | null;
}


export interface Job {
    id: number;
    title: string;
    description: string;
    location?: string | null;
    jobType: JobType;
    salaryRange?: string | null;
    postedAt: string;
    expiryDate?: Date | null;
    status: JobStatus;
    companyLogo: string;
    companyName: string;
    applications?: Application[];
}

export interface Application {
    id: number;
    job?: Job; 
    jobId: number;
    applicant?: User; 
    userId: string;
    resume?: string;
    status: ApplicationStatus;
    appliedAt: string | Date;
}

export interface Subscription {
    id: number;
    user?: User;
    userId: string;
    plan: PlanType;
    trialsLeft: number;
    isActive: boolean;
    startDate?: Date | null;
    endDate?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}



export interface Profile {
  id: number;
  userId: string;
  name: string;
  isActive: boolean;
  dateOfBirth?: string;
  resume?: string;
  extractedResumeText?: string;
  preferredRole?: string;
  experience?: string;
  currentJobRole?: string;
  currentEmployer?: string;
  skills?: string;
  qualification?: string;
  graduationYear?: number;
  fieldOfStudy?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  visaStatus?: string;
  workAuthorization?: string;
  requiresSponsorship?: boolean;
  preferredJobLocation?: string;
  preferredWorkMode?: string;
  willingToRelocate?: boolean;
  currentCTC?: string;
  expectedCTC?: string;
  salaryExpectation?: string;
  noticePeriod?: string;
  gender?: string;
  disabilityStatus?: string;
  veteranStatus?: string;
  ethnicity?: string;
  citizenship?: string;
  source?: string;
  agreeTerms?: boolean;
  createdAt: string;
  updatedAt: string;
}
 
export interface UserPrefill {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedin?: string;
  qualification?: string;
  graduationYear?: number;
  fieldOfStudy?: string;
  experience?: string;
  currentJobRole?: string;
  currentEmployer?: string;
  preferredJobLocation?: string;
  visaStatus?: string;
  preferredRole?: string;
  resume?: string;
}


export interface ProfileCreate {
  userId: string;
  name: string;
}

export type ProfileUpdate = Partial<
  Omit<Profile, "id" | "userId" | "isActive" | "createdAt" | "updatedAt">
>;






// ─── Constants ─────────────────────────────────────────────
// INPUT OPTIONS

export const QUALIFICATION_OPTIONS = [
  "High School",
  "Diploma",
  "Bachelor's",
  "Master's",
  "PhD",
  "Other",
];


export const EXPERIENCE_OPTIONS = [
  "0–1 years",
  "1–2 years",
  "2–4 years",
  "4–6 years",
  "6–10 years",
  "10+ years",
];

export const WORK_MODE_OPTIONS = [
  "Remote",
  "Hybrid",
  "Onsite",
];

export const NOTICE_OPTIONS = [
  "Immediate",
  "2 weeks",
  "1 month",
  "2 months",
  "3 months",
  "Negotiable",
];

export const GENDER_OPTIONS = [
  "Male",
  "Female",
  "Non-binary",
  "Prefer not to say",
];

export const DISABILITY_OPTIONS = [
  "Yes, I have a disability",
  "No",
  "Prefer not to say",
];

export const VETERAN_OPTIONS = [
  "Yes",
  "No",
  "Prefer not to say",
];

export const VISA_OPTIONS = [
  "Citizen",
  "Permanent Resident",
  "Work Permit",
  "Open Work Permit",
  "Student Visa",
  "Requires Sponsorship",
  "Other",
];

export const SOURCE_OPTIONS = [
  "LinkedIn",
  "Referral",
  "Job Board",
  "Website",
  "Other",
];


export const DEVELOPER_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile Developer",
  "DevOps Engineer",
  "Data Engineer",
  "Machine Learning Engineer",
  "Other",
];
