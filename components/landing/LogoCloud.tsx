const logos = ["zapier", "GitHub", "salesforce", "circleci", "netlify", "OpenAI", "contentful", "CISCO", "FORRESTER", "Google", "databricks"];

export const LogoCloud = () => {
  return (
    <section className="relative border-y border-border/60">
      <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
        <div className="flex items-center justify-center border-r border-border/60 px-6 py-8 text-center text-xs leading-tight text-muted-foreground">
          Trusted by developers<br />at 5000+ companies
        </div>
        {logos.slice(0, 5).map((l, i) => (
          <Cell key={i} name={l} last={i === 4} />
        ))}
        {logos.slice(5).map((l, i) => (
          <Cell key={i + 5} name={l} last={i === 5} bottom />
        ))}
      </div>
    </section>
  );
};

const Cell = ({ name, last, bottom }: { name: string; last?: boolean; bottom?: boolean }) => (
  <div className={`flex items-center justify-center px-6 py-8 ${!last ? "border-r border-border/60" : ""} ${bottom ? "border-t border-border/60" : ""}`}>
    <span className="select-none text-xl font-semibold tracking-tight text-foreground/85">{name}</span>
  </div>
);
