# RestoFocus

RestoFocus est une plateforme web multi-restaurants pensée comme un produit complet, et non comme un simple site vitrine.  
Le projet combine trois briques complémentaires :

- un **site public** orienté visibilité, acquisition et conversion ;
- un **espace admin restaurant** pour piloter l’activité d’un établissement ;
- un **espace super admin** pour superviser plusieurs restaurants, comparer leurs performances et tester des fonctionnalités transverses.

L’objectif du projet est de relier dans une seule application :

- présence en ligne ;
- SEO / visibilité ;
- collecte de données utile ;
- tableaux de bord et KPI ;
- gestion opérationnelle ;
- bonnes pratiques de qualité logicielle ;
- base de conformité RGPD.

---

## 1. Vision du projet

RestoFocus a été conçu comme une plateforme évolutive pour restaurants.  
Le produit ne se limite pas à afficher un menu : il permet de publier une vitrine publique claire, de collecter certaines données de navigation et de conversion, puis de transformer ces données en indicateurs exploitables dans les interfaces d’administration.

Le projet repose sur une logique simple :

**visibilité -> engagement -> conversion -> pilotage**

Exemples :

- un visiteur consulte une fiche restaurant ;
- il clique sur le bouton de réservation ou sur l’itinéraire ;
- il envoie une demande de réservation ;
- l’admin restaurant traite cette demande ;
- les KPI du dashboard évoluent ;
- le super admin compare ensuite les performances entre établissements.

---

## 2. Fonctionnalités principales

## Site public

Le site public permet de :

- consulter la vitrine d’un restaurant ;
- voir le menu et les catégories ;
- consulter l’adresse, les horaires, le téléphone et l’email public ;
- accéder à une page FAQ ;
- accéder à une page contact ;
- accéder à une page de réservation ;
- cliquer sur les CTA principaux :
  - réservation ;
  - itinéraire.

Le site public a aussi été pensé pour être exploitable côté SEO / GEO :

- pages structurées ;
- metadata ;
- données structurées JSON-LD de type `Restaurant` ;
- informations utiles et locales ;
- menu accessible ;
- contenu lisible.

## Admin restaurant

L’espace admin restaurant permet de :

- consulter un tableau de bord ;
- voir les réservations ;
- confirmer ou annuler une réservation ;
- voir les commandes ;
- gérer le menu ;
- modifier les paramètres du restaurant :
  - nom ;
  - description ;
  - adresse ;
  - téléphone ;
  - email public ;
  - type de cuisine ;
  - horaires ;
  - réservation activée ou non ;
  - URL de réservation ;
  - lien Google Maps.

## Super admin

L’espace super admin permet de :

- voir les KPI globaux de la plateforme ;
- consulter la liste des restaurants ;
- comparer les établissements ;
- ouvrir une fiche détaillée par restaurant ;
- suivre les réservations, commandes et revenus par établissement.

---

## 3. KPI suivis

Le projet suit plusieurs niveaux d’indicateurs.

## Acquisition

- vues de pages publiques ;
- clics vers réservation ;
- clics vers itinéraire ;
- structure prévue pour clics Search Console ;
- structure prévue pour impressions Search Console ;
- structure prévue pour CTR moyen ;
- structure prévue pour position moyenne.

## Engagement

- interactions sur les CTA ;
- comportement sur les pages publiques ;
- suivi de certains événements de navigation.

## Conversion métier

- demandes de réservation ;
- réservations confirmées ;
- taux de confirmation ;
- commandes ;
- chiffre d’affaires ;
- taux clic vers réservation -> demande.

---

## 4. Modèle de données

Le projet repose notamment sur les modèles suivants :

- `User`
- `Restaurant`
- `Category`
- `MenuItem`
- `Order`
- `OrderItem`
- `Reservation`
- `PublicVisit`
- `PublicEvent`
- `SearchPerformanceDaily`

### Chaîne logique de données

Le modèle de prise de données suit cette logique :

`restaurant -> page publique -> visite -> événement utilisateur -> réservation / commande -> KPI agrégé`

### Exemples

- `PublicVisit` permet de stocker une visite publique pseudonymisée ;
- `PublicEvent` permet de stocker un clic utile comme `CTA_RESERVATION` ou `CTA_DIRECTIONS` ;
- `Reservation` permet de stocker une demande envoyée depuis la page publique ;
- `SearchPerformanceDaily` prépare l’intégration ou l’import manuel de métriques Search Console.

---

## 5. Base RGPD intégrée au projet

Le projet intègre une base de conformité visible dans l’interface :

- page **Politique de confidentialité** ;
- page **Mentions légales** ;
- mention d’information sous les formulaires de réservation et de contact ;
- logique de minimisation ;
- séparation des accès par rôle ;
- collecte limitée à ce qui est utile au produit.

Le projet applique une logique de **Privacy by Design** à l’échelle d’un démonstrateur fonctionnel.

Exemples :

- les visites publiques utilisent un identifiant de session technique plutôt qu’un profil nominatif ;
- les réservations collectent uniquement les données nécessaires au traitement de la demande ;
- les espaces admin sont séparés selon les rôles.

---

## 6. Stack technique

- **Next.js 16**
- **React**
- **TypeScript**
- **Prisma**
- **PostgreSQL**
- **Auth.js / NextAuth**
- **Tailwind CSS**
- **Lucide React**

---

## 7. Structure du produit

Le projet est organisé autour de trois espaces :

- `/` et `/restaurant/[slug]` pour la partie publique
- `/espace-restaurant` pour l’admin restaurant
- `/super-admin` pour la supervision globale

### Pages publiques principales

- `/`
- `/restaurant/[slug]`
- `/faq`
- `/contact`
- `/reservation/[slug]`
- `/confidentialite`
- `/mentions-legales`

### Pages admin restaurant principales

- `/espace-restaurant`
- `/espace-restaurant/reservations`
- `/espace-restaurant/commandes`
- `/espace-restaurant/menu`
- `/espace-restaurant/parametres`

### Pages super admin principales

- `/super-admin`
- `/super-admin/restaurants`
- `/super-admin/restaurants/[id]`

---

## 8. Installation du projet

## Prérequis

- Node.js installé
- PostgreSQL installé et lancé
- npm disponible

## Installation

```bash
npm install