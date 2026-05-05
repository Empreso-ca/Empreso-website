
import {
    JobType as PrismaJobType,
    JobStatus as PrismaJobStatus,
    ApplicationStatus as PrismaApplicationStatus,
    PlanType as PrismaPlanType,
} from "@prisma/client";

export type JobType = PrismaJobType;
export const JobType = PrismaJobType;

export type JobStatus = PrismaJobStatus;
export const JobStatus = PrismaJobStatus;

export type ApplicationStatus = PrismaApplicationStatus;
export const ApplicationStatus = PrismaApplicationStatus;

export type PlanType = PrismaPlanType;
export const PlanType = PrismaPlanType;



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


