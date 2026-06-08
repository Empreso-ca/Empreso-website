import { Careers } from "@/components/Careers";
import { getJobs } from "@/lib/jobs";

export const dynamic = "force-dynamic";

export default async function JobsPage () {
    const jobs = await getJobs();

    return (
        <main className="relative">
            <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
            <section className="relative mx-auto max-w-5xl px-6 py-24 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Jobs</p>
                <h1 className="mt-6 font-mono-display text-5xl leading-tight sm:text-6xl">
                    Find Your Next Chapter
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
                    {jobs.length} transformative opportunities waiting
                </p>
            </section>
            <Careers jobs={jobs}/>
        </main>
    )
}