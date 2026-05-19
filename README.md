# BatiMemoire CI - Site web MVP

Premiere version du carnet numerique du batiment pour le marche ivoirien. Le projet est maintenant une base de site web full-stack : connexion utilisateur, sauvegarde serveur, upload de documents, QR codes par equipement et notifications preparees.

## Livrables

- `index.html` : application web responsive.
- `styles.css` : design B2B sobre et responsive.
- `app.js` : logique metier, donnees de demo, localStorage, import/export JSON.
- `manifest.webmanifest` et `service-worker.js` : base PWA transformable en application.
- `server.js` : serveur Node.js avec authentification, donnees, upload, QR codes et notifications.
- `data/app-data.json` : cree automatiquement au premier lancement.
- `uploads/` : fichiers documents envoyes par les utilisateurs.
- `.env.example` : variables de production et notifications.
- `docs/cahier_des_charges_mvp.md` : cahier des charges editable.
- `docs/Cahier_des_charges_MVP_BatiMemoire_CI.pdf` : cahier des charges PDF.
- `docs/deploiement_ignara_xyz.md` : guide pour connecter le domaine `ignara.xyz`.

## Modules inclus

- Tableau de bord.
- Batiments.
- Zones.
- Materiaux.
- Equipements.
- Documents.
- Rappels.

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

## Evolution recommandee

1. Remplacer le fichier JSON serveur par PostgreSQL.
2. Remplacer le stockage local `uploads/` par S3, Cloudflare R2 ou Supabase Storage.
3. Ajouter gestion complete des roles utilisateurs.
4. Brancher SMTP, SMS et WhatsApp Business.
5. Ajouter notifications automatiques planifiees.
6. Transformer la PWA en application mobile avec Capacitor.
