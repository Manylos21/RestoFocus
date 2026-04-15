import { AlertTriangle } from "lucide-react";

export function NoRestaurantAssociated() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-xl border border-amber-200 bg-amber-50/80 px-6 py-12 text-center shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800">
        <AlertTriangle className="h-6 w-6" aria-hidden />
      </div>
      <h1 className="mt-4 text-lg font-semibold text-zinc-900">
        Aucun restaurant associé
      </h1>
      <p className="mt-2 max-w-md text-sm text-zinc-600">
        Votre compte n’est pas rattaché à un établissement. Contactez le support
        ou un administrateur pour lier un restaurant à votre profil.
      </p>
    </div>
  );
}
