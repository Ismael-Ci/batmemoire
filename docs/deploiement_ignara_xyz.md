# Déploiement du site BatiMemoire CI sur ignara.xyz

## 1. Situation actuelle

Le projet est maintenant une base de site web complet :

- connexion utilisateur ;
- sauvegarde serveur ;
- documents uploadés côté serveur ;
- QR codes par équipement ;
- notifications email/SMS/WhatsApp préparées ;
- interface responsive utilisable depuis téléphone ;
- PWA transformable ensuite en application Android/iPhone.

Compte de démonstration local :

- Email : `admin@ignara.xyz`
- Mot de passe : `Admin123!`

## 2. Lancement local

Dans le dossier du projet :

```powershell
npm install
npm start
```

Puis ouvrir :

```text
http://localhost:4200
```

Pour le test actuel, le serveur a été lancé sur :

```text
http://localhost:4300
```

## 3. Ce qu'il faut pour que le site marche sur Internet

Un nom de domaine seul ne suffit pas. Il faut :

1. le domaine `ignara.xyz` chez Namecheap ;
2. un hébergeur pour lancer le serveur Node.js ;
3. une base ou un disque persistant pour conserver les données ;
4. HTTPS/SSL ;
5. DNS Namecheap pointant vers l'hébergeur.

## 4. Hébergeurs recommandés pour commencer

Options simples :

- Render ;
- Railway ;
- Fly.io ;
- DigitalOcean App Platform ;
- VPS Ubuntu chez Hetzner, OVH, Contabo ou DigitalOcean.

Pour un débutant, Render ou Railway sont plus simples. Pour une entreprise, un VPS donne plus de contrôle mais demande plus de maintenance.

## 4.1 Valeurs recommandées pour GitHub

Repository :

```text
Owner : Ismael-Ci
Repository name : batimemoire
Description : Carnet numérique du bâtiment pour inventaire, documents, QR codes et maintenance
Visibility : Private au début, Public seulement si tu veux montrer le code
Default branch : main
```

Commit initial :

```text
Commit message : Initial BatiMemoire web app
```

Ne pas envoyer :

```text
node_modules/
data/
uploads/
.env
```

Ces dossiers/fichiers sont déjà protégés par `.gitignore`.

## 4.2 Valeurs recommandées pour Render

Si tu choisis Render, crée un Web Service depuis GitHub avec :

```text
Name : batimemoire
Repository : Ismael-Ci/batimemoire
Branch : main
Runtime : Node
Build command : npm install
Start command : npm start
Plan : Starter ou Free pour test
```

Variables d'environnement :

```text
NODE_ENV=production
PUBLIC_URL=https://ignara.xyz
PORT=10000
STORAGE_ROOT=/opt/render/project/src/storage
```

Disque persistant :

```text
Name : batimemoire-data
Mount path : /opt/render/project/src/storage
Size : 1 GB
```

Important : la version actuelle stocke les données dans `storage/data/` et les documents dans `storage/uploads/` quand `STORAGE_ROOT` est configuré. Pour une commercialisation avancée, on remplacera ensuite les fichiers locaux par S3, Cloudflare R2 ou Supabase Storage.

## 5. Configuration DNS Namecheap

Dans l'écran Namecheap visible sur la capture, tu es dans :

`Domain List` -> `ignara.xyz` -> `Advanced DNS`

Selon l'hébergeur choisi :

### Cas A : Render ou autre hébergeur donne une cible DNS

Après avoir ajouté `ignara.xyz` dans Render, Render donnera une cible du type :

```text
batimemoire.onrender.com
```

Dans Namecheap -> Advanced DNS -> Host Records, mettre :

```text
Type : CNAME Record
Host : www
Value : batimemoire.onrender.com
TTL : Automatic
```

Pour le domaine racine `ignara.xyz`, Render peut donner un `A Record` ou une configuration spéciale. Si Render affiche une IP, mettre :

```text
Type : A Record
Host : @
Value : 216.24.57.1
TTL : Automatic
```

Si Render demande un CNAME flattening pour `@`, Namecheap ne le gère pas toujours comme Cloudflare. Dans ce cas, la solution la plus propre est :

1. utiliser `www.ignara.xyz` pour le site ;
2. ou passer le DNS chez Cloudflare ;
3. ou utiliser l'IP/A record si Render la fournit.

### Cas B : l'hébergeur donne une adresse IP

Ajouter :

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| A Record | @ | IP_DU_SERVEUR | Automatic |
| CNAME Record | www | ignara.xyz | Automatic |

### Cas B : l'hébergeur donne un domaine cible

Ajouter :

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| CNAME Record | www | domaine-fourni-par-hebergeur | Automatic |

Et suivre les instructions de l'hébergeur pour le domaine racine `@`.

Important : il faut supprimer les anciens records contradictoires s'ils existent. Sur ta capture, la zone Host Records est vide, donc ce sera propre à configurer.

## 6. Variables d'environnement de production

Sur l'hébergeur, définir au minimum :

```text
PORT=4200
PUBLIC_URL=https://ignara.xyz
```

Ensuite, pour les notifications :

```text
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM=
WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
```

Sans ces variables, les notifications sont enregistrées en simulation. Avec les variables, on pourra brancher les vrais envois.

## 7. Prochaine évolution technique

La version actuelle utilise un fichier JSON serveur pour aller vite. Pour une vraie commercialisation :

1. remplacer JSON par PostgreSQL ;
2. stocker les documents sur S3, Cloudflare R2, Supabase Storage ou Backblaze B2 ;
3. ajouter une gestion utilisateurs complète ;
4. ajouter réinitialisation de mot de passe ;
5. ajouter rôles : admin, gestionnaire, technicien, lecteur ;
6. ajouter QR codes imprimables ;
7. ajouter notifications automatiques planifiées ;
8. ajouter sauvegardes quotidiennes.

## 8. Android et iPhone

La bonne stratégie :

1. terminer le site web responsive ;
2. le rendre stable sur téléphone ;
3. ajouter PWA installable ;
4. utiliser Capacitor pour créer Android/iPhone à partir du site ;
5. plus tard, développer une application native si nécessaire.

Capacitor permet d'emballer le site web dans une application Android/iOS, tout en réutilisant la même base.
