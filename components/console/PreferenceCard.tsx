export function PreferenceCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card/80 p-6 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
      <div className="mb-6 flex items-center gap-3">
        <div >
          {icon}
        </div>

        <div>
          <h2 className="font-semibold">{title}</h2>

          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>

      {children}
    </div>
  );
}