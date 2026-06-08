

export default function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-muted-foreground">
        {label}
      </label>

      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          rounded-xl
          h-10
          border
          border-border
          bg-background
          px-4
          py-1
          my-1
          text-foreground
          outline-none
          transition-all
          focus:border-primary
          focus:ring-2
          focus:ring-primary/20
        "
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}