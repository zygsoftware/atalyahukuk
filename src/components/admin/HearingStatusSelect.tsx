"use client";

import { HEARING_STATUS_LABEL } from "@/lib/admin-labels";
import type { HearingStatus } from "@/lib/supabase/types";

export function HearingStatusSelect({
  defaultValue,
  action,
}: {
  defaultValue: HearingStatus;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action}>
      <select
        name="status"
        defaultValue={defaultValue}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-full border border-bordo-100 px-3 py-1.5 text-xs font-medium outline-none focus:border-bordo-400"
      >
        {Object.entries(HEARING_STATUS_LABEL).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </form>
  );
}
