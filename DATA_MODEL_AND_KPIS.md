# RestoFocus — Modèle de données et KPI

## 1. Objectif

RestoFocus est une plateforme multi-restaurants articulée autour de trois briques :
- un site public orienté visibilité et acquisition ;
- un espace admin restaurant orienté pilotage opérationnel ;
- un espace super admin orienté supervision transverse.

Le produit relie présence en ligne, collecte de données utile, conversion métier et tableaux de bord.

## 2. Chaîne logique de collecte

Le modèle logique suivi dans le projet est le suivant :

restaurant -> page publique -> visite -> événement utilisateur -> réservation / commande -> KPI agrégé

## 3. Données principales

### Restaurant
Contient les informations publiques et opérationnelles d’un établissement :
- nom
- slug
- description
- adresse
- téléphone
- email public
- type de cuisine
- horaires
- lien de réservation
- lien Google Maps

### Reservation
Permet de stocker une demande de réservation :
- prénom
- nom
- email
- téléphone
- date/heure
- nombre de personnes
- commentaire
- statut

### Order / OrderItem
Permet de stocker une commande et ses lignes :
- client
- restaurant
- montant total
- statut
- lignes de commande

### PublicVisit
Permet de suivre une visite pseudonymisée :
- restaurant concerné
- page visitée
- type de page
- source de trafic estimée
- identifiant de session technique
- date

### PublicEvent
Permet de suivre certaines actions métier :
- clic vers réservation
- clic itinéraire
- clic contact
- consultation FAQ
- consultation menu
- soumission contact

### SearchPerformanceDaily
Prépare l’import de métriques d’acquisition issues de Google Search Console :
- date
- page
- clics
- impressions
- CTR
- position moyenne

## 4. KPI principaux

### Acquisition
- clics Search Console
- impressions
- CTR moyen
- position moyenne
- vues de pages publiques
- clics vers réservation
- clics itinéraire

### Engagement
- vues FAQ
- clics CTA
- visites par page
- visites par source

### Conversion métier
- demandes de réservation
- réservations confirmées
- taux de confirmation
- commandes
- chiffre d’affaires
- taux clic vers réservation -> demande

## 5. Logique RGPD de base

Le projet applique une logique de minimisation :
- seules les données utiles à une finalité explicite sont collectées ;
- les visites publiques utilisent un identifiant de session technique plutôt qu’un profil nominatif ;
- les espaces d’administration sont séparés par rôles ;
- les pages publiques informent l’utilisateur de la collecte.

## 6. Durées de conservation projet

Base projet indicative :
- événements de navigation : conservation courte ;
- réservations : conservation opérationnelle limitée ;
- comptes admin : conservation tant que le compte est actif ;
- métriques agrégées : conservation plus longue possible car faible sensibilité.

## 7. Limites actuelles

Le projet est une base fonctionnelle, mais certains éléments restent à compléter pour une mise en production réelle :
- import réel Search Console
- gouvernance détaillée des consentements
- politique de suppression/export automatisée
- journalisation avancée
- revue juridique complète