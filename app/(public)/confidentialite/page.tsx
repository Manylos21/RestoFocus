export default function ConfidentialitePage() {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-600">
          Confidentialité
        </p>
  
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-neutral-900">
          Politique de confidentialité
        </h1>
  
        <div className="space-y-8 rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-neutral-900">
              1. Finalité de la collecte
            </h2>
            <p className="leading-7 text-neutral-700">
              RestoFocus collecte uniquement les données nécessaires au fonctionnement de la
              plateforme : affichage des restaurants, gestion des réservations, suivi de
              certaines interactions utiles au pilotage du produit, et administration des
              espaces professionnels.
            </p>
          </section>
  
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-neutral-900">
              2. Données susceptibles d’être traitées
            </h2>
            <div className="space-y-3 leading-7 text-neutral-700">
              <p>
                Dans le cadre des réservations, les données suivantes peuvent être collectées :
                prénom, nom, email, téléphone, date et heure souhaitées, nombre de personnes,
                commentaire éventuel.
              </p>
              <p>
                Dans le cadre du pilotage du site, des données de visite pseudonymisées peuvent
                être enregistrées : page visitée, source de trafic estimée, clics sur certains
                boutons d’action, date de l’événement, identifiant de session technique.
              </p>
              <p>
                Dans le cadre de l’administration, certaines données liées aux comptes
                utilisateurs et aux restaurants sont utilisées pour gérer les accès, les menus,
                les paramètres et les tableaux de bord.
              </p>
            </div>
          </section>
  
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-neutral-900">
              3. Base de minimisation
            </h2>
            <p className="leading-7 text-neutral-700">
              La plateforme applique un principe de minimisation : seules les données utiles à
              une finalité claire sont collectées. Les formulaires et les indicateurs ont été
              pensés pour éviter les champs inutiles et limiter les traitements excessifs.
            </p>
          </section>
  
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-neutral-900">
              4. Durées de conservation indicatives
            </h2>
            <div className="space-y-3 leading-7 text-neutral-700">
              <p>
                Réservations : conservation opérationnelle limitée à la gestion de la relation
                client et au suivi d’activité.
              </p>
              <p>
                Événements de navigation et visites publiques : conservation courte destinée au
                suivi statistique et à l’amélioration du service.
              </p>
              <p>
                Comptes administrateurs : conservation tant que le compte reste actif ou tant que
                sa suppression n’est pas demandée selon les règles du projet.
              </p>
            </div>
          </section>
  
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-neutral-900">
              5. Accès aux données
            </h2>
            <p className="leading-7 text-neutral-700">
              Les données sont accessibles selon le rôle de l’utilisateur. Un administrateur de
              restaurant ne consulte que les données liées à son établissement. Le super admin
              dispose d’une vision transverse de supervision produit.
            </p>
          </section>
  
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-neutral-900">
              6. Sécurité
            </h2>
            <p className="leading-7 text-neutral-700">
              Le projet vise à limiter les accès non autorisés, séparer les rôles, protéger les
              sessions et documenter les traitements sensibles. Cette version constitue une base
              projet à compléter avant un usage réel en production.
            </p>
          </section>
  
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-neutral-900">
              7. Exercice des droits
            </h2>
            <p className="leading-7 text-neutral-700">
              Pour une version projet, les demandes liées aux données personnelles peuvent être
              adressées au contact indiqué dans les mentions légales. En contexte réel, cette
              partie devrait être reliée à un vrai processus de traitement des demandes.
            </p>
          </section>
  
          <section className="rounded-2xl bg-neutral-50 p-4 text-sm leading-7 text-neutral-600">
            Cette page constitue une base de transparence cohérente avec un projet de plateforme
            web. Pour une exploitation réelle, elle devrait être revue avec les paramètres
            exacts du responsable de traitement, des sous-traitants, des durées de conservation
            et des obligations applicables.
          </section>
        </div>
      </div>
    );
  }
  