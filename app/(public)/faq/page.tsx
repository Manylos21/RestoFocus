const faqItems = [
    {
      question: "Comment réserver une table ?",
      answer:
        "Vous pouvez réserver directement depuis la page du restaurant quand la réservation en ligne est activée. Sinon, contactez l’établissement par téléphone ou via la page contact.",
    },
    {
      question: "Le menu est-il mis à jour régulièrement ?",
      answer:
        "Oui. Les restaurants partenaires peuvent mettre à jour leurs plats, descriptions et prix depuis leur interface d’administration.",
    },
    {
      question: "Puis-je consulter les horaires avant de me déplacer ?",
      answer:
        "Oui. Chaque fiche restaurant affiche les horaires d’ouverture, l’adresse et un lien d’itinéraire pour faciliter la visite.",
    },
    {
      question: "Les informations affichées sont-elles fiables ?",
      answer:
        "Notre objectif est de centraliser des informations utiles, structurées et actualisées : menu, coordonnées, localisation, horaires et contenu rassurant.",
    },
    {
      question: "Est-ce que tous les restaurants proposent la réservation en ligne ?",
      answer:
        "Pas forcément. Certains établissements activent la réservation en ligne, d’autres préfèrent le téléphone ou un canal externe.",
    },
    {
      question: "Puis-je commander à emporter ?",
      answer:
        "Selon l’établissement, vous pouvez consulter la carte, ajouter des plats au panier et passer commande si cette fonctionnalité est active.",
    },
  ];
  
  export default function FaqPage() {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-600">
            FAQ
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900">
            Questions fréquentes
          </h1>
          <p className="text-lg text-neutral-600">
            Retrouvez ici les réponses aux questions les plus courantes sur les restaurants,
            les réservations et l’utilisation de la plateforme.
          </p>
        </div>
  
        <div className="grid gap-4">
          {faqItems.map((item) => (
            <section
              key={item.question}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <h2 className="mb-2 text-lg font-semibold text-neutral-900">{item.question}</h2>
              <p className="leading-7 text-neutral-600">{item.answer}</p>
            </section>
          ))}
        </div>
      </div>
    );
  }