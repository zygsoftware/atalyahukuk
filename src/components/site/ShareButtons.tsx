"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M16.004 3C9.376 3 4 8.373 4 15c0 2.34.653 4.527 1.786 6.393L4 29l7.83-1.746A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm6.998 16.98c-.293.828-1.462 1.552-2.36 1.746-.61.13-1.406.234-4.09-.878-3.44-1.424-5.652-4.905-5.826-5.135-.166-.23-1.394-1.855-1.394-3.538s.885-2.511 1.2-2.856c.293-.32.64-.4.854-.4.213 0 .427.002.613.011.196.01.46-.075.72.548.293.71.996 2.394 1.084 2.568.088.174.146.377.03.607-.117.23-.176.373-.352.573-.176.2-.372.446-.53.6-.176.174-.36.362-.155.71.205.35.912 1.507 1.958 2.44 1.345 1.2 2.478 1.573 2.827 1.75.35.174.554.145.76-.084.205-.23.883-1.03 1.117-1.383.235-.353.47-.29.79-.174.322.117 2.047.966 2.398 1.14.352.174.585.26.672.406.088.146.088.85-.205 1.68Z" />
    </svg>
  );
}

function LinkedinGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.446-2.136 2.94v5.666H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.56V9h3.554v11.452z" />
    </svg>
  );
}

function CopyGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function ShareButton({
  href,
  onClick,
  label,
  children,
}: {
  href?: string;
  onClick?: () => void;
  label: string;
  children: React.ReactNode;
}) {
  const className = cn(
    "flex h-10 w-10 items-center justify-center rounded-full border border-bordo-100 text-bordo-500 transition hover:border-bordo-300 hover:bg-bordo-50",
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        title={label}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={className}
    >
      {children}
    </button>
  );
}

export function ShareButtons({
  url,
  title,
  label,
  copyLabel,
  copiedLabel,
}: {
  url: string;
  title: string;
  label: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Panoya erişim engellenmişse sessizce yok say.
    }
  }

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="mt-10 flex items-center gap-3 border-t border-bordo-100 pt-6">
      <span className="text-sm font-medium text-ink/70">{label}</span>
      <ShareButton href={whatsappHref} label="WhatsApp">
        <WhatsAppGlyph />
      </ShareButton>
      <ShareButton href={linkedinHref} label="LinkedIn">
        <LinkedinGlyph />
      </ShareButton>
      <ShareButton onClick={handleCopy} label={copied ? copiedLabel : copyLabel}>
        <CopyGlyph />
      </ShareButton>
    </div>
  );
}
