"use client";

export function DeleteButton({
  action,
  confirmMessage = "Bu kaydı silmek istediğinizden emin misiniz?",
  label = "Sil",
}: {
  action: () => Promise<void>;
  confirmMessage?: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="text-xs font-semibold text-bordo-600 hover:text-bordo-800"
      >
        {label}
      </button>
    </form>
  );
}
