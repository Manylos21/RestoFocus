"use client";

import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

import { deleteMenuItem } from "@/features/restaurant-admin/actions/menu-actions";

type DeleteMenuButtonProps = {
  menuItemId: string;
  label: string;
};

export function DeleteMenuButton({ menuItemId, label }: DeleteMenuButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(null);
    startTransition(() => {
      void deleteMenuItem(menuItemId).then((result) => {
        if (!result.ok) {
          setError(result.message);
        }
      });
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-label={`Supprimer ${label}`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-700 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden />
        {isPending ? "…" : "Supprimer"}
      </button>
      {error ? (
        <p className="max-w-[12rem] text-right text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
