export default function MentionsLegalesPage() {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-600">
          Informations légales
        </p>
  
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-neutral-900">
          Mentions légales
        </h1>
  
        <div className="space-y-8 rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-neutral-900">
              1. Éditeur
            </h2>
            <p className="leading-7 text-neutral-700">
              RestoFocus — projet académique / démonstrateur produit.
            </p>
            <p className="leading-7 text-neutral-700">
              Responsable du projet : à compléter.
            </p>
            <p className="leading-7 text-neutral-700">
              Email de contact : contact@restofocus.fr
            </p>
          </section>
  
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-neutral-900">
              2. Hébergement
            </h2>
            <p className="leading-7 text-neutral-700">
              Hébergeur : à compléter selon l’environnement réel de déploiement.
            </p>
          </section>
  
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-neutral-900">
              3. Objet du site
            </h2>
            <p className="leading-7 text-neutral-700">
              La plateforme RestoFocus permet de présenter des restaurants, gérer des contenus,
              suivre des indicateurs de visibilité et piloter certaines conversions comme les
              réservations et les commandes.
            </p>
          </section>
  
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-neutral-900">
              4. Propriété intellectuelle
            </h2>
            <p className="leading-7 text-neutral-700">
              Les contenus, maquettes, composants, visuels et textes du projet sont protégés au
              titre du droit applicable, sauf mention contraire.
            </p>
          </section>
  
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-neutral-900">
              5. Données personnelles
            </h2>
            <p className="leading-7 text-neutral-700">
              Pour en savoir plus sur les traitements de données personnelles, consultez la
              politique de confidentialité de la plateforme.
            </p>
          </section>
        </div>
      </div>
    );
  }