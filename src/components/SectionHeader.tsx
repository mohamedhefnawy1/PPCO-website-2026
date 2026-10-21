import { tc } from "@/lib/text";

/** Shared header grammar: eyebrow + title on the left, intro on the right. */
export default function SectionHeader({
  eyebrow,
  title,
  children,
  action,
  dark = false,
  stacked = false,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  dark?: boolean;
  stacked?: boolean;
}) {
  return (
    <div className={`grid gap-6 ${stacked ? "" : "lg:grid-cols-12 lg:gap-8"}`}>
      <div className={stacked ? "" : "lg:col-span-6"}>
        {eyebrow && <p className={`eyebrow ${dark ? "!text-white/80" : ""}`}>{tc(eyebrow)}</p>}
        <h2 className={`heading h2 max-w-[20ch] ${eyebrow ? "mt-4" : ""} ${dark ? "text-white" : ""}`}>{tc(title)}</h2>
      </div>
      {(children || action) && (
        <div className={`${stacked ? "" : "lg:col-span-5 lg:col-start-8 lg:self-end"} ${dark ? "text-white/75" : "text-muted"}`}>
          {children && <div className="lead max-w-[56ch]">{children}</div>}
          {action && <div className="mt-6">{action}</div>}
        </div>
      )}
    </div>
  );
}
