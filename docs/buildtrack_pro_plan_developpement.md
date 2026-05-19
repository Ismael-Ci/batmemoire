# Alignement BuildTrack Pro - Plan de developpement

Ce document aligne le projet BatiMemoire CI avec les recommandations du PDF `BuildTrack Pro Analyse Strategique`.

## Positionnement produit retenu

Nom produit possible : `BuildTrack Pro` pour la marque commerciale, avec `BatiMemoire CI` comme nom interne ou premier produit local.

Promesse simple :

> Transformer chaque batiment en dossier technique numerique, avec maintenance planifiee, documents centralises, QR codes terrain et score de sante du patrimoine.

Client prioritaire en Cote d'Ivoire :

- Hotels 3 a 5 etoiles a Abidjan.
- Residences de standing et syndics.
- Immeubles de bureaux.
- Cliniques, ecoles privees et centres commerciaux.
- Promoteurs et gestionnaires immobiliers.

## Ce qui change par rapport au MVP actuel

Le MVP actuel est deja utile pour montrer le produit : batiments, zones, materiaux, equipements, documents, rappels, utilisateurs, QR codes, notifications et base materiaux.

Les ajustements BuildTrack Pro sont :

- Garder un MVP strict, sans marketplace ni IoT tout de suite.
- Concevoir le SaaS multi-tenant des maintenant.
- Mettre le score sante batiment au centre du tableau de bord.
- Ajouter un module `Interventions` pour les techniciens terrain.
- Ajouter generation PDF des rapports.
- Ajouter stockage cloud documents.
- Ajouter PostgreSQL/Supabase comme base principale.
- Ajouter paiement mobile plus tard : Wave, MTN MoMo, Orange Money, virement.

## Stack recommandee limitee aux outils connus

### Version actuelle, simple et efficace

- GitHub : code, historique, issues, versions.
- Render : serveur Node.js actuel, API, sessions, QR codes, notifications.
- Supabase : PostgreSQL, stockage documents, authentification future, sauvegarde.
- Vercel : a utiliser plus tard si on separe le frontend en React/Next.js.

Recommandation immediate : rester sur Render + Supabase. C'est le plus simple pour continuer vite.

### Architecture cible V1

- Frontend web : application actuelle puis migration progressive vers React/Next.js si necessaire.
- Backend API : Node.js/Express actuel, evolutif vers NestJS quand le produit grossit.
- Base donnees : Supabase PostgreSQL.
- Documents : Supabase Storage.
- Authentification : sessions actuelles, puis Supabase Auth ou auth backend maison renforcee.
- Notifications email : SMTP.
- SMS/WhatsApp : Twilio ou WhatsApp Business Cloud API.
- Mobile : PWA au debut, puis Capacitor ou Flutter.
- Deploiement :
  - Render pour backend monolithique actuel.
  - Vercel si frontend Next.js separe.

## Phases de developpement

### Phase 1 - Stabilisation SaaS et donnees cloud

Objectif : rendre le site fiable pour les premiers clients pilotes.

Fonctions a developper :

- Brancher Supabase PostgreSQL via `DATABASE_URL`.
- Remplacer progressivement le fichier JSON par de vraies tables.
- Ajouter Supabase Storage pour les documents.
- Garder les QR codes par equipement.
- Garder les roles : admin, gestionnaire, technicien, lecteur.
- Ajouter historique simple des actions : creation, modification, suppression.
- Ajouter sauvegarde/export complet par client.

Outils :

- GitHub
- Render
- Supabase PostgreSQL
- Supabase Storage

### Phase 2 - Module terrain technicien

Objectif : rendre l'application vraiment utile sur telephone pendant une visite de batiment.

Fonctions a developper :

- Module `Interventions` avec statut, technicien, cout, diagnostic et photos avant/apres.
- Checklists d'inspection.
- Photos avant/apres.
- Statuts : a planifier, en cours, termine, valide.
- Signature client terrain.
- Mode mobile optimise.
- Scan QR code depuis telephone.
- Rapport d'intervention PDF.

Outils :

- PWA actuelle
- Render
- Supabase Storage
- Navigateur mobile
- Plus tard : Capacitor pour Android/iPhone

### Phase 3 - Rapports et valeur client

Objectif : donner au client des livrables qui justifient l'abonnement.

Fonctions a developper :

- Rapports PDF mensuels par batiment.
- Rapport de sante batiment.
- Liste des risques et travaux prioritaires.
- Budget previsionnel maintenance 1 a 5 ans.
- Export client pour proprietaire, syndic, assureur ou banque.
- Tableau de bord direction.

Outils :

- Node.js PDF generation
- Supabase PostgreSQL
- Render

### Phase 4 - Paiement et commercialisation Cote d'Ivoire

Objectif : transformer le produit en SaaS vendable.

Fonctions a developper :

- Plans tarifaires :
  - Essentiel : 75 000 FCFA/mois
  - Professionnel : 250 000 FCFA/mois
  - Entreprise : 750 000 FCFA/mois
  - Grand compte : sur devis
- Factures et statut abonnement.
- Paiement manuel au debut.
- Puis integration Wave, MTN MoMo, Orange Money ou fournisseur local.
- Tableau admin commercial.

Outils :

- Render
- Supabase
- GitHub
- Fournisseur paiement local a choisir plus tard

### Phase 5 - Application mobile

Objectif : publier Android et iPhone apres validation du site web.

Chemin recommande :

1. Continuer en site web responsive/PWA.
2. Ajouter les fonctions offline importantes.
3. Transformer avec Capacitor pour Android/iPhone si le site reste majoritairement web.
4. Choisir Flutter seulement si l'app terrain devient tres complexe.

Outils :

- Capacitor
- Android Studio
- Xcode sur Mac pour iPhone
- Google Play Console
- Apple Developer Account

### Phase 6 - Intelligence, IoT et expansion

Objectif : devenir une plateforme de reference, pas seulement un logiciel de suivi.

Fonctions a developper :

- Score sante avance par type de batiment.
- Prediction de pannes avec historique.
- Capteurs IoT : humidite, temperature, fuite, energie.
- Marketplace prestataires certifies.
- Expansion Senegal, Ghana, Afrique de l'Ouest.

Outils possibles :

- Supabase ou PostgreSQL dedie
- Render ou infrastructure cloud plus robuste
- IoT selon partenaires
- Outils data/BI plus tard

## Priorite des prochains sprints

Sprint 1 :

- Brancher Supabase PostgreSQL en production.
- Creer le schema SQL propre.
- Migrer comptes, batiments, zones, materiaux, equipements, documents, rappels.

Sprint 2 :

- Supabase Storage pour documents.
- Permissions documents par client.
- Previsualisation et telechargement securise.

Sprint 3 :

- Enrichir le module Interventions deja ajoute au MVP.
- Ajouter checklists d'inspection.
- Rapport PDF intervention.

Sprint 4 :

- Ameliorer score sante.
- Rapport PDF mensuel batiment.
- Dashboard direction.

## Logiciels et comptes a prevoir

Indispensables maintenant :

- GitHub
- Render
- Supabase
- Namecheap
- Un compte email SMTP professionnel

Utile bientot :

- Figma pour maquettes.
- WhatsApp Business Cloud API.
- Twilio ou fournisseur SMS local.
- Google Analytics ou Plausible pour suivre l'usage.
- Sentry pour erreurs production.

Pour mobile plus tard :

- Android Studio
- Google Play Console
- Mac + Xcode
- Apple Developer Account

## Decision recommandee

Ne pas migrer tout de suite vers AWS, Kubernetes, Redis ou une architecture trop lourde. Pour le stade actuel, GitHub + Render + Supabase suffit largement.

La meilleure suite est :

1. Garder Render pour le backend actuel.
2. Ajouter Supabase PostgreSQL.
3. Ajouter Supabase Storage.
4. Creer le module Interventions.
5. Ajouter rapports PDF.
6. Transformer en application mobile seulement apres validation terrain.
