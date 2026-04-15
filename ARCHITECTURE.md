# Architecture RestoFocus

Cette base est pensee pour une plateforme multi-espaces:

- **B2C**: site public SEO-first.
- **B2B**: espace admin restaurant.
- **Super Admin**: pilotage central de la plateforme.

## Arborescence

```txt
.
|-- app
|   |-- (public)
|   |   `-- page.tsx
|   |-- (restaurant-admin)
|   |   `-- espace-restaurant
|   |       `-- page.tsx
|   |-- (super-admin)
|   |   `-- super-admin
|   |       `-- page.tsx
|   |-- globals.css
|   `-- layout.tsx
|-- src
|   |-- app-providers
|   |-- core
|   |   |-- config
|   |   |-- constants
|   |   |-- rgpd
|   |   |-- security
|   |   |-- types
|   |   `-- utils
|   |-- entities
|   |   |-- menu
|   |   |-- order
|   |   |-- reservation
|   |   |-- restaurant
|   |   `-- user
|   |-- features
|   |   |-- public
|   |   |-- restaurant-admin
|   |   `-- super-admin
|   |-- processes
|   |   |-- auth
|   |   `-- onboarding
|   |-- shared
|   |   |-- api
|   |   |-- hooks
|   |   |-- lib
|   |   |-- types
|   |   `-- ui
|   |-- tests
|   |   |-- e2e
|   |   |-- integration
|   |   `-- unit
|   `-- widgets
|       |-- public
|       |-- restaurant-admin
|       `-- super-admin
|-- .eslintrc.json
|-- .prettierrc
`-- tsconfig.json
```

## Roles des dossiers cle

- `app`: couche de routage et rendu SSR via App Router.
  - Les route groups (`(public)`, `(restaurant-admin)`, `(super-admin)`) separent les interfaces sans impacter les URLs.
- `src/core`: fondation transversale du produit.
  - `security`: politiques de securite, utilitaires de validation, sanitization.
  - `rgpd`: gestion des consentements, retention, export/suppression de donnees.
  - `config`: lecture/validation de la configuration d'environnement.
- `src/entities`: noyau metier par entite (restaurant, menu, commande, reservation, utilisateur).
- `src/features`: cas d'usage metier par espace produit (B2C/B2B/Super Admin).
- `src/widgets`: assemblages UI plus larges (sections, panneaux, blocs complexes).
- `src/processes`: workflows multi-features (authentification, onboarding, etc.).
- `src/shared`: briques reutilisables techniques et UI sans logique metier.
- `src/app-providers`: providers React globaux (theme, auth, i18n, telemetry).
- `src/tests`: separation claire des tests `unit`, `integration`, `e2e`.

## Regles d'evolution

1. **Isolation des espaces**: tout code specifique B2C/B2B/Super Admin va dans `features/*` et `widgets/*` dedies.
2. **Domaine avant UI**: la logique metier vit dans `entities`/`features`, pas dans les composants de page.
3. **Securite by default**: validations d'entrees, controles d'acces et gestion des secrets centralises dans `core/security` et `core/config`.
4. **RGPD by design**: tout flux de donnees personnelles doit declarer son cycle de vie dans `core/rgpd`.
5. **SSR first**: prioriser Server Components et chargements serveur pour SEO/performance, avec Client Components uniquement si necessaire.

## Securite & RGPD

- **Headers HTTP stricts** (configures dans `next.config.ts`): `Content-Security-Policy`, `X-Frame-Options=DENY`, `X-Content-Type-Options=nosniff`, `Referrer-Policy=strict-origin-when-cross-origin`, `Permissions-Policy`, `Strict-Transport-Security`.
- **Middleware Edge** (`src/middleware.ts`): enrobe NextAuth `auth()` pour lire la session JWT cote Edge (sans Prisma). Les routes `/espace-restaurant/*` exigent une session avec role `RESTAURANT_ADMIN` ou `SUPER_ADMIN`; `/super-admin/*` exige `SUPER_ADMIN`. Sinon redirection vers `/login` avec `callbackUrl`.
- **Validation d'environnement** (`src/core/config/env.ts`): schema strict via `zod`, echec immediat au demarrage si variable manquante/invalide.
- **Consentement cookies** (`src/shared/ui/CookieConsent.tsx`): choix utilisateur entre cookies strictement necessaires et analytiques, stocke dans un cookie de preference.

### Flux d'authentification (UI -> NextAuth -> Middleware)

1. L'utilisateur saisit email / mot de passe sur `app/(public)/login/page.tsx` via `LoginForm` (`signIn("credentials")` cote client).
2. NextAuth valide les identifiants (Prisma + bcrypt) dans le provider Credentials, puis emet un JWT contenant `id`, `role` et `restaurantId` (sans mot de passe).
3. Le middleware lit `request.auth` (JWT decode) et applique les regles d'acces par prefixe de route avant d'atteindre les pages protegees.

## Base de donnees

- **ORM Prisma**: centralise le schema, la generation de client TypeScript et la coherence des relations.
- **PostgreSQL**: datasource principale (`provider = "postgresql"`), configuree via `DATABASE_URL`.
- **Modeles initiaux** (`prisma/schema.prisma`):
  - `User` (UUID, identite, role enum `CUSTOMER | RESTAURANT_ADMIN | SUPER_ADMIN`).
  - `Restaurant` (UUID, slug SEO unique, proprietaire relie a `User`).
  - `Category` (UUID, rattachee a un restaurant, nom unique par restaurant).
  - `MenuItem` (UUID, rattache a une categorie et a un restaurant, prix decimal).
- **Integrite relationnelle**: indexes sur cles etrangeres et politiques `onDelete`/`onUpdate` explicites pour assurer des types Prisma fiables et une evolution saine.
