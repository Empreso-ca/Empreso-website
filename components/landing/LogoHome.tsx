// const logos = ["zapier","GitHub","salesforce","circleci","netlify","OpenAI","contentful","CISCO","FORRESTER","Google","databricks"];

export const LogoHome = ({logos} : {logos: string[]}) => {
  return (
    <section className="relative border-y border-white/[0.1]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-3 md:grid-cols-6 border border-white/[0.1]">
        {/* Header cell */}
        <div className="flex items-center justify-center px-6 py-8 text-center text-xs leading-tight text-muted-foreground border border-white/[0.1]">
          {/* Trusted by developers */}
          Built for Modern
          <br />
          {/* at 5000+ companies */}
          Hiring Ecosystem
        </div>

        {logos.map((name, i) => (
          <Cell key={i} name={name} />
        ))}
      </div>
    </section>
  );
};

const Cell = ({ name }: { name: string }) => {
  return (
    <div
      className="flex items-center justify-center px-6 py-8 border border-white/[0.1] text-center"
    >
      <span className="select-none text-xl font-semibold tracking-tight text-foreground/85">
        {name}
      </span>
    </div>
  );
};