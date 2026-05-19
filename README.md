# BatiMemoire CI - Site web MVP

Premiere version du carnet numerique du batiment pour le marche ivoirien. Le projet est maintenant une base de site web full-stack : connexion utilisateur, sauvegarde serveur, upload de documents, QR codes par equipement et notifications preparees.

## Livrables

- `index.html` : application web responsive.
- `styles.css` : design B2B sobre et responsive.
- `app.js` : logique metier, donnees de demo, localStorage, import/export JSON.
- `manifest.webmanifest` et `service-worker.js` : base PWA transformable en application.
- `server.js` : serveur Node.js avec authentification, donnees, upload, QR codes et notifications.
- `DATABASE_URL` : active PostgreSQL automatiquement si une base Render PostgreSQL est connectee.
- `/qr/equipment/:id` : page imprimable pour les QR codes equipements.
- `Bibliotheque` : base de references materiaux/equipements avec marques, references, durees de vie et maintenances.
- `Utilisateurs` : gestion admin des roles, invitations et resets de mots de passe temporaires.
- `data/app-data.json` : cree automatiquement au premier lancement.
- `uploads/` : fichiers documents envoyes par les utilisateurs.
- `.env.example` : variables de production et notifications.
- `docs/cahier_des_charges_mvp.md` : cahier des charges editable.
- `docs/Cahier_des_charges_MVP_BatiMemoire_CI.pdf` : cahier des charges PDF.
- `docs/deploiement_ignara_xyz.md` : guide pour connecter le domaine `ignara.xyz`.
- `docs/buildtrack_pro_plan_developpement.md` : alignement avec la strategie BuildTrack Pro, phases et outils.

## Modules inclus

- Tableau de bord.
- Score sante batiment.
- Batiments.
- Zones.
- Materiaux.
- Equipements.
- Documents.
- Interventions terrain.
- Rappels.
- Notifications.
- Bibliotheque materiaux/equipements.
- Utilisateurs et roles.

## Roles inclus

- `admin` : gestion complete, utilisateurs, donnees et documents.
- `gestionnaire` : usage metier complet hors administration utilisateurs.
- `technicien` : usage terrain pour equipements, documents et rappels.
- `lecteur` : consultation seule.

## Compte demo

```text
Email : admin@ignara.xyz
Mot de passe : Admin123!
```

## Lancer en local comme vrai site

Depuis ce dossier :

```powershell
npm install
npm start
```

Puis ouvrir :

```text
http://localhost:4200
```

## Stockage donnees

Par defaut, l'application sauvegarde dans `data/app-data.json`. C'est pratique pour tester et pour demarrer rapidement.

Pour passer en vraie base cloud sur Render :

1. Dans Render, creer une base `PostgreSQL`.
2. Copier la valeur `Internal Database URL`.
3. Dans le service web `batmemoire-1`, aller dans `Environment`.
4. Ajouter cette variable :

```text
DATABASE_URL=<Internal Database URL de Render PostgreSQL>
```

5. Garder aussi :

```text
NODE_ENV=production
PUBLIC_URL=https://batmemoire-1.onrender.com
STORAGE_ROOT=/opt/render/project/src/storage
```

6. Lancer `Manual Deploy -> Clear build cache & deploy`.

Si PostgreSQL est indisponible, le serveur garde un fallback JSON pour eviter de bloquer le site.

## Evolution recommandee

1. Creer la base PostgreSQL Render et renseigner `DATABASE_URL`.
2. Remplacer le stockage local `uploads/` par S3, Cloudflare R2 ou Supabase Storage.
3. Ajouter notifications automatiques planifiees.
4. Ajouter historique/audit des modifications.
5. Transformer la PWA en application mobile avec Capacitor.
