import type { AppLocale } from "@/i18n/routing";

const FLAGS: Record<AppLocale, React.ReactNode> = {
  tr: (
    <svg viewBox="0 0 24 16" className="h-full w-full">
      <rect width="24" height="16" fill="#E30A17" />
      <circle cx="9.5" cy="8" r="4" fill="#fff" />
      <circle cx="10.7" cy="8" r="3.2" fill="#E30A17" />
      <path
        fill="#fff"
        d="M14.2 8l3.4-1.1-2.1 2.9v-3.6l2.1 2.9-3.4-1.1z"
      />
    </svg>
  ),
  en: (
    <svg viewBox="0 0 24 16" className="h-full w-full">
      <rect width="24" height="16" fill="#00247D" />
      <path d="M0 0L24 16M24 0L0 16" stroke="#fff" strokeWidth="3.2" />
      <path d="M0 0L24 16M24 0L0 16" stroke="#CF142B" strokeWidth="1.2" />
      <path d="M12 0V16M0 8H24" stroke="#fff" strokeWidth="5.2" />
      <path d="M12 0V16M0 8H24" stroke="#CF142B" strokeWidth="2" />
    </svg>
  ),
  ru: (
    <svg viewBox="0 0 24 16" className="h-full w-full">
      <rect width="24" height="16" fill="#fff" />
      <rect y="5.33" width="24" height="5.33" fill="#0039A6" />
      <rect y="10.67" width="24" height="5.33" fill="#D52B1E" />
    </svg>
  ),
  de: (
    <svg viewBox="0 0 24 16" className="h-full w-full">
      <rect width="24" height="5.33" fill="#000" />
      <rect y="5.33" width="24" height="5.33" fill="#DD0000" />
      <rect y="10.67" width="24" height="5.33" fill="#FFCE00" />
    </svg>
  ),
};

export function Flag({
  locale,
  className = "h-3.5 w-5",
}: {
  locale: AppLocale;
  className?: string;
}) {
  return (
    <span
      className={`inline-block shrink-0 overflow-hidden rounded-[3px] ring-1 ring-inset ring-black/10 ${className}`}
    >
      {FLAGS[locale]}
    </span>
  );
}
