"use client";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import {
  IconBriefcase,
  IconFileText,
  IconMessageCircle2,
  IconShield,
  IconSchool,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { CustomGrid } from "./ui/CustomGrid";

const stats_1 = [
  { v: "82%", l: "Placement Success Rate" },
  { v: "421+", l: "Professionals Trained" },
  { v: "76%", l: "Secure Jobs Within 60 Days" },
];

const stats_2 = [
  { v: "98%", l: "Placement Success" },
  { v: "100+", l: "Hiring Partners" },
  { v: "AI-Powered Job Matching", l: "" },
];

export function EMPRESOBentoGrid() {
  // Create state to store generated widths
  const [isClient, setIsClient] = useState(false);

  // Only run useEffect on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <section className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Services</p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              Empreso Career Acceleration
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Transform Your Job Search with Proven Strategies! Your dream job is just one step away! Our expert-driven services, combined with smart AI automation, ensure you stand out, apply smartly, and get hired faster.
            </p>
          </div>
        </section>

        <CustomGrid stats={stats_1} cols={3}/>

        <div className="absolute left-1/2 -translate-x-1/2 w-screen border-t border-white/[0.1]" /> 
        <BentoGrid className="mx-auto max-w-7xl h-auto md:auto-rows-[20rem] gap-0">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={isClient ? item.header : null} // Only render animated components on client
              className={cn("[&>p:text-lg]", item.className, "rounded-none")}
              icon={item.icon}
            />
          ))}
        </BentoGrid>
        <div className="absolute left-1/2 -translate-x-1/2 w-screen border-t border-white/[0.1]" /> 

        <CustomGrid stats={stats_2} cols={3}/>
    </main>
  );
}

const ResumeLinkedInSkeleton = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] bg-dot-white/[0.2]  flex-col space-y-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-white/[0.1] p-2 items-center space-x-2 bg-black"
      >
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 shrink-0" />
        <div className="w-full h-4 rounded-full bg-neutral-900" />
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full border :border-white/[0.1] p-2 items-center space-x-2 w-3/4 ml-auto bg-black"
      >
        <div className="w-full  h-4 rounded-full bg-neutral-900" />
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 shrink-0" />
      </motion.div>
      <div className="bg-black p-3 rounded-lg border border-white/[0.1]">
        <p className="text-sm font-bold">ATS-Optimized Resume</p>
        <div className="flex items-center mt-2">
          <div className="h-3 w-3/4 bg-gradient-to-r from-green-500 to-green-300 rounded-full" />
          <span className="text-xs ml-2">70%</span>
        </div>
      </div>
    </motion.div>
  );
};

const JobMarketingSkeleton = () => {
  const widths = ["40%", "65%", "85%", "50%", "70%"];
  
  const variants = {
    initial: {
      width: 0,
    },
    animate: {
      width: "100%",
      transition: {
        duration: 0.2,
      },
    },
    hover: {
      width: ["0%", "100%"],
      transition: {
        duration: 2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
    >
      {widths.map((width, i) => (
        <motion.div
          key={"job-marketing" + i}
          variants={variants}
          style={{
            maxWidth: width,
          }}
          className="flex flex-row rounded-full border border-neutral-100 border-white/[0.1] p-2 items-center space-x-2  bg-black w-full h-4"
        ></motion.div>
      ))}
      <div className="flex justify-between mt-4">
        <div className="bg-black p-2 rounded-lg border  border-white/[0.1]">
          <p className="text-xs">Indeed</p>
        </div>
        <div className="bg-black p-2 rounded-lg border border-white/[0.1]">
          <p className="text-xs">LinkedIn</p>
        </div>
        <div className="bg-black p-2 rounded-lg border border-white/[0.1]">
          <p className="text-xs">Monster</p>
        </div>
      </div>
    </motion.div>
  );
};

const InterviewCoachingSkeleton = () => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="flex flex-1 w-full h-full min-h-[6rem] bg-dot-white/[0.2] rounded-lg  flex-col space-y-2"
      style={{
        background:
          "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
        backgroundSize: "400% 400%",
      }}
    >
      <div className="h-full w-full rounded-lg flex flex-col justify-center items-center text-white p-4">
        <div className="text-center mb-4 backdrop-blur-sm bg-black/20 p-3 rounded-lg">
          <p className="font-bold">76% higher confidence</p>
          <p className="text-sm">after mock interviews</p>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg text-center">
            <p className="text-sm">Behavioral</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg text-center">
            <p className="text-sm">Technical</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const VerificationSkeleton = () => {
  const first = {
    initial: {
      x: 20,
      rotate: -5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  const second = {
    initial: {
      x: -20,
      rotate: 5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] bg-dot-white/[0.2]  flex-row space-x-2"
    >
      <motion.div
        variants={first}
        className="h-full w-1/3 rounded-2xl  p-4 bg-black border-white/[0.1] border  flex flex-col items-center justify-center"
      >
        <div className="h-10 w-10 flex items-center justify-center  bg-red-900/20 rounded-full">
          <IconShield className="h-6 w-6 text-red-500" />
        </div>
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          Pre-checks
        </p>
        <p className="border border-red-500 bg-red-900/20 text-red-600 text-xs rounded-full px-2 py-0.5 mt-4">
          Essential
        </p>
      </motion.div>
      <motion.div className="h-full relative z-20 w-1/3 rounded-2xl  p-4 bg-black border-white/[0.1] border  flex flex-col items-center justify-center">
        <div className="h-10 w-10 flex items-center justify-center  bg-green-900/20 rounded-full">
          <IconShield className="h-6 w-6 text-green-500" />
        </div>
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          Verification
        </p>
        <p className="border border-green-500  bg-green-900/20 text-green-600 text-xs rounded-full px-2 py-0.5 mt-4">
          In Progress
        </p>
      </motion.div>
      <motion.div
        variants={second}
        className="h-full w-1/3 rounded-2xl p-4 bg-black border-white/[0.1] border  flex flex-col items-center justify-center"
      >
        <div className="h-10 w-10 flex items-center justify-center  bg-blue-900/20 rounded-full">
          <IconShield className="h-6 w-6 text-blue-500" />
        </div>
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          Cleared
        </p>
        <p className="border border-blue-500  bg-blue-900/20 text-blue-600 text-xs rounded-full px-2 py-0.5 mt-4">
          Complete
        </p>
      </motion.div>
    </motion.div>
  );
};

const TrainingSkeleton = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] bg-dot-white/[0.2]  flex-col space-y-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-2xl border border-white/[0.1] p-2 items-start space-x-2 bg-black"
      >
        <div className="h-8 w-8 flex items-center justify-center  bg-violet-900/20 rounded-full shrink-0">
          <IconSchool className="h-5 w-5 text-violet-500" />
        </div>
        <p className="text-xs text-neutral-500">
          Join 87% of professionals who upskill and see a salary increase within 6 months!
        </p>
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-2xl border  border-white/[0.1] p-2 items-center space-x-2 w-3/4 ml-auto bg-black"
      >
        <p className="text-xs text-neutral-500">40+ Career Training Programs Available</p>
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 shrink-0" />
      </motion.div>
    </motion.div>
  );
};

const items = [
  {
    title: "Resume & LinkedIn Optimization",
    description: (
      <span className="text-sm">
        ATS-Optimized Resume Formatting & LinkedIn Profile Makeover. 70% of recruiters reject resumes due to poor formatting.
      </span>
    ),
    header: <ResumeLinkedInSkeleton />,
    className: "md:col-span-1",
    icon: <IconFileText className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Job Marketing & Auto-Applications",
    description: (
      <span className="text-sm">
        AI-Powered Job Matching & Profile Marketing. 80% of jobs are filled through networking & direct referrals.
      </span>
    ),
    header: <JobMarketingSkeleton />,
    className: "md:col-span-1",
    icon: <IconBriefcase className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Interview Coaching & Mock Practice",
    description: (
      <span className="text-sm">
        1-on-1 Expert Interview Coaching & AI-Powered Mock Interviews. Candidates who prepare with mock interviews perform 60% better.
      </span>
    ),
    header: <InterviewCoachingSkeleton />,
    className: "md:col-span-1",
    icon: <IconMessageCircle2 className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Background Verification & Job Readiness",
    description: (
      <span className="text-sm">
        Fast & Secure Background Checks. 85% of employers conduct background checks before hiring. Candidates with pre-verified backgrounds get hired 2X faster.
      </span>
    ),
    header: <VerificationSkeleton />,
    className: "md:col-span-2",
    icon: <IconShield className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Training & Career Growth",
    description: (
      <span className="text-sm">
        Industry-Relevant Training in Full-Stack, Cloud, Data Science & Cybersecurity. Tech & cloud jobs are expected to grow 22% by 2025.
      </span>
    ),
    header: <TrainingSkeleton />,
    className: "md:col-span-1",
    icon: <IconSchool className="h-4 w-4 text-neutral-500" />,
  },
];