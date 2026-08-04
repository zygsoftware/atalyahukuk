import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  light = false,
  level = 2,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  level?: 1 | 2;
  className?: string;
}) {
  const Heading = level === 1 ? "h1" : "h2";

  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "text-sm font-semibold uppercase tracking-[0.2em]",
            light ? "text-gold-300" : "text-gold-600",
          )}
        >
          {eyebrow}
        </p>
      )}
      <Heading
        className={cn(
          "mt-3 font-serif text-3xl sm:text-4xl",
          light ? "text-cream" : "text-bordo-950",
        )}
      >
        {title}
      </Heading>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed",
            light ? "text-cream/75" : "text-ink/70",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
