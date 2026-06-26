"use client";

type Props = {
  filters: any;
  setFilters: any;
};

export default function Filters({
  filters,
  setFilters,
}: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-6">
      <input
        placeholder="Search jobs..."
        className="border rounded p-2"
        value={filters.q}
        onChange={(e) =>
          setFilters((p: any) => ({
            ...p,
            q: e.target.value,
          }))
        }
      />

      <input
        placeholder="Location"
        className="border rounded p-2"
        value={filters.location}
        onChange={(e) =>
          setFilters((p: any) => ({
            ...p,
            location: e.target.value,
          }))
        }
      />

      <input
        placeholder="Company"
        className="border rounded p-2"
        value={filters.company}
        onChange={(e) =>
          setFilters((p: any) => ({
            ...p,
            company: e.target.value,
          }))
        }
      />

      <select
        className="border rounded p-2"
        value={filters.jobType}
        onChange={(e) =>
          setFilters((p: any) => ({
            ...p,
            jobType: e.target.value,
          }))
        }
      >
        <option value="">All Types</option>
        <option value="FULL_TIME">Full Time</option>
        <option value="PART_TIME">Part Time</option>
        <option value="CONTRACT">Contract</option>
        <option value="INTERNSHIP">Internship</option>
      </select>

      <select
        className="border rounded p-2"
        value={filters.remote}
        onChange={(e) =>
          setFilters((p: any) => ({
            ...p,
            remote: e.target.value,
          }))
        }
      >
        <option value="">All</option>
        <option value="true">Remote</option>
        <option value="false">Onsite</option>
      </select>

      <select
        className="border rounded p-2"
        value={filters.source}
        onChange={(e) =>
          setFilters((p: any) => ({
            ...p,
            source: e.target.value,
          }))
        }
      >
        <option value="">All Sources</option>
        <option value="LINKEDIN">LinkedIn</option>
        <option value="GREENHOUSE">Greenhouse</option>
        <option value="LEVER">Lever</option>
        <option value="WORKDAY">Workday</option>
      </select>
    </div>
  );
}