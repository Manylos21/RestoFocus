import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10 max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-600">
          Contact
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900">
          Une question avant votre visite ?
        </h1>
        <p className="text-lg text-neutral-600">
          Utilisez ce point de contact pour obtenir des informations générales sur la
          plateforme. Pour une réservation urgente, contactez directement le restaurant.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-neutral-900">Coordonnées</h2>

          <div className="space-y-4 text-neutral-700">
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-neutral-900">Téléphone</p>
                <p>+33 1 42 00 00 00</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-neutral-900">Email</p>
                <p>contact@restofocus.fr</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-neutral-900">Adresse</p>
                <p>12 Rue de Rivoli, 75001 Paris</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-neutral-900">
            Formulaire de contact
          </h2>

          <form className="space-y-4">
            <div>
              <label htmlFor="nom" className="mb-2 block text-sm font-medium text-neutral-700">
                Nom
              </label>
              <input
                id="nom"
                type="text"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none ring-0 transition focus:border-orange-500"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none ring-0 transition focus:border-orange-500"
                placeholder="vous@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none ring-0 transition focus:border-orange-500"
                placeholder="Votre message"
              />
            </div>

            <button
              type="button"
              className="cursor-pointer rounded-full bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700"
            >
              Envoyer
            </button>

            <p className="text-sm leading-6 text-neutral-500">
              Les données transmises via ce formulaire sont utilisées pour répondre à votre demande
              de contact. Consultez la{" "}
              <a href="/confidentialite" className="text-orange-600 hover:underline">
                politique de confidentialité
              </a>
              .
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}