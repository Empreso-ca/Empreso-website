"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { MultiSelectDropdown } from "@/components/console/jobs/multi-select-dropdown";
import { JobFilterOptions } from "@/lib/types";

interface JobFiltersProps {
  options: JobFilterOptions;
  activeFilters: Record<string, string | undefined>;
}

const CHIP_GROUPS: { key: keyof JobFilterOptions; param: string; label: string }[] = [
  { key: "job_types", param: "job_type", label: "Job Type" },
  { key: "statuses", param: "status", label: "Status" },
  { key: "remote_options", param: "remote", label: "Work Mode" },
];

const DROPDOWN_GROUPS: { key: keyof JobFilterOptions; param: string; label: string }[] = [
  { key: "departments", param: "department", label: "Department" },
  { key: "teams", param: "team", label: "Team" },
  { key: "locations", param: "location", label: "Location" },
  { key: "companies", param: "company", label: "Company" },
];

const ALL_PARAMS = [...CHIP_GROUPS, ...DROPDOWN_GROUPS].map((g) => g.param);

function parseMultiValue(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw.split(",").filter(Boolean);
}

function serializeMultiValue(values: string[]): string | null {
  return values.length > 0 ? values.join(",") : null;
}

/** Build a draft object {param: value} from whatever's currently in the URL. */
function draftFromActiveFilters(
  activeFilters: Record<string, string | undefined>
): Record<string, string | null> {
  const draft: Record<string, string | null> = {};
  for (const param of ALL_PARAMS) {
    draft[param] = activeFilters[param] ?? null;
  }
  return draft;
}

export function JobFilters({ options, activeFilters }: JobFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Local draft state — mutated freely by chips/dropdowns, only pushed to
  // the URL (and therefore only triggers a fetch) when "Apply" is clicked.
  const [draft, setDraft] = useState<Record<string, string | null>>(() =>
    draftFromActiveFilters(activeFilters)
  );

  // Re-sync the draft if the URL changes from outside this component
  // (back/forward navigation, a shared link, pagination elsewhere on the page).
  useEffect(() => {
    setDraft(draftFromActiveFilters(activeFilters));
  }, [activeFilters]);

  const setDraftParam = useCallback((param: string, value: string | null) => {
    setDraft((prev) => ({ ...prev, [param]: value }));
  }, []);

  const setDraftMultiSelect = useCallback(
    (param: string, values: string[]) => {
      setDraftParam(param, serializeMultiValue(values));
    },
    [setDraftParam]
  );

  const pushToUrl = useCallback(
    (nextDraft: Record<string, string | null>) => {
      const next = new URLSearchParams();
      for (const [param, value] of Object.entries(nextDraft)) {
        if (value) next.set(param, value);
      }
      // Any filter change resets pagination back to page 1.
      next.delete("page");

      startTransition(() => {
        router.push(`${pathname}?${next.toString()}`);
      });
    },
    [pathname, router]
  );

  const applyFilters = useCallback(() => {
    pushToUrl(draft);
  }, [draft, pushToUrl]);

  const clearAll = useCallback(() => {
    const cleared = draftFromActiveFilters({});
    setDraft(cleared);
    pushToUrl(cleared); // Clearing is decisive — apply immediately, no extra click.
  }, [pushToUrl]);

  const isDirty = ALL_PARAMS.some(
    (param) => (draft[param] ?? null) !== (activeFilters[param] ?? null)
  );
  const hasActiveFilters = ALL_PARAMS.some((param) => activeFilters[param]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-foreground hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div className={`space-y-6 transition-opacity ${isPending ? "opacity-60" : ""}`}>
        {DROPDOWN_GROUPS.map((group) => {
          const groupOptions = options[group.key];
          if (!groupOptions || groupOptions.length === 0) return null;

          return (
            <MultiSelectDropdown
              key={group.param}
              label={group.label}
              options={groupOptions}
              selectedValues={parseMultiValue(draft[group.param] ?? undefined)}
              onChange={(values) => setDraftMultiSelect(group.param, values)}
            />
          );
        })}

        {CHIP_GROUPS.map((group) => {
          const groupOptions = options[group.key];
          if (!groupOptions || groupOptions.length === 0) return null;

          return (
            <ChipFilterSection
              key={group.param}
              label={group.label}
              options={groupOptions}
              activeValue={draft[group.param] ?? null}
              onSelect={(value) => setDraftParam(group.param, value)}
            />
          );
        })}
      </div>

      <div className="sticky bottom-0 border-border bg-background pt-4">
        <button
          type="button"
          onClick={applyFilters}
          disabled={!isDirty || isPending}
          className={`relative w-full rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            isDirty && !isPending
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {isPending ? "Applying..." : isDirty ? "Apply filters" : "Filters applied"}
        </button>
      </div>
    </div>
  );
}

function ChipFilterSection({
  label,
  options,
  activeValue,
  onSelect,
}: {
  label: string;
  options: { value: string; label: string }[];
  activeValue: string | null;
  onSelect: (value: string | null) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isActive = activeValue === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(isActive ? null : opt.value)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-muted"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}