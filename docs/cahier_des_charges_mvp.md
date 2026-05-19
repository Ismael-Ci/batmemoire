# Cahier des charges MVP - BatiMemoire CI

## 1. Objectif du MVP

BatiMemoire CI est une plateforme de carnet numerique du batiment pour les entreprises ivoiriennes. Le MVP doit permettre de creer un dossier technique simple mais exploitable pour un batiment : zones, materiaux, equipements, documents et rappels de maintenance.

Le MVP n'a pas pour objectif de tout faire. Il doit prouver que les clients B2B comprennent la valeur, acceptent d'utiliser l'outil et sont prets a payer pour centraliser les donnees techniques de leurs batiments.

## 2. Positionnement

Le produit doit etre presente comme un carnet de sante numerique du batiment, pas comme un simple site internet. Il doit aider les promoteurs, entreprises BTP, gestionnaires, syndics, hotels, cliniques, ecoles et administrations a ne plus perdre la memoire technique de leurs batiments.

## 3. Utilisateurs cibles

| Profil | Besoin principal | Droits MVP |
| --- | --- | --- |
| Administrateur entreprise | Gerer l'espace client, les utilisateurs et les batiments | Tout voir et tout modifier |
| Gestionnaire technique | Suivre les batiments, equipements et maintenances | Creer, modifier, exporter |
| Technicien terrain | Ajouter photos, equipements, interventions et rappels | Creer et modifier les donnees terrain |
| Direction | Consulter les rapports et indicateurs | Lecture et exports |
| Prestataire externe | Intervenir sur certains rappels ou equipements | Acces limite futur |

## 4. Perimetre fonctionnel MVP

### 4.1 Tableau de bord

- Statistiques principales : batiments, zones, materiaux, equipements, documents, rappels.
- Alertes : rappels en retard, rappels dans les 30 prochains jours, garanties bientot expirees.
- Selection d'un batiment actif.
- Vue rapide des zones critiques du batiment.

### 4.2 Module Batiments

Chaque batiment doit avoir :

- nom du batiment ;
- type de batiment ;
- ville/quartier/adresse ;
- surface approximative ;
- nombre de niveaux ;
- proprietaire ou client ;
- gestionnaire technique ;
- statut : chantier, livre, en exploitation, en maintenance ;
- date de livraison ou de mise en service ;
- notes.

Actions MVP :

- creer un batiment ;
- modifier un batiment ;
- supprimer un batiment de demonstration ;
- filtrer et rechercher ;
- exporter les donnees.

### 4.3 Module Zones

Une zone permet de localiser les donnees dans le batiment.

Exemples :

- toiture terrasse ;
- facade nord ;
- local technique ;
- sous-sol ;
- etage 3 ;
- appartement A301 ;
- salle d'eau ;
- parking.

Champs :

- batiment rattache ;
- nom de zone ;
- niveau ;
- type de zone ;
- surface approximative ;
- niveau de risque : faible, moyen, eleve, critique ;
- notes.

### 4.4 Module Materiaux

Le module materiaux repertorie les produits utilises dans la construction.

Champs :

- batiment ;
- zone ;
- categorie : toiture, carrelage, peinture, plomberie, electricite, menuiserie, facade, structure, autre ;
- nom du materiau ;
- marque ;
- reference ;
- fournisseur ;
- quantite ;
- date de pose ;
- fin de garantie ;
- prochaine maintenance ou inspection ;
- statut ;
- notes.

### 4.5 Module Equipements

Le module equipements suit les actifs techniques installes.

Exemples :

- climatiseur ;
- pompe ;
- tableau electrique ;
- ascenseur ;
- groupe electrogene ;
- extincteur ;
- camera ;
- chauffe-eau ;
- compteur ;
- vanne.

Champs :

- batiment ;
- zone ;
- type d'equipement ;
- nom ;
- marque ;
- modele ;
- numero de serie ;
- fournisseur ou installateur ;
- date d'installation ;
- fin de garantie ;
- prochaine maintenance ;
- frequence de maintenance ;
- responsable ;
- statut : actif, a surveiller, en panne, remplace.

### 4.6 Module Documents

Le MVP doit permettre de classer les documents, meme si le stockage cloud final viendra plus tard.

Types :

- plan architectural ;
- plan electricite ;
- plan plomberie ;
- plan climatisation ;
- facture ;
- garantie ;
- fiche technique ;
- PV de reception ;
- photo ;
- rapport intervention.

Champs :

- titre ;
- batiment ;
- zone optionnelle ;
- type ;
- date ;
- fichier ou nom du fichier ;
- statut : brouillon, valide, a mettre a jour ;
- notes.

### 4.7 Module Rappels

Les rappels sont le coeur de la valeur maintenance.

Champs :

- titre ;
- batiment ;
- zone optionnelle ;
- type : inspection, maintenance, garantie, remplacement, controle securite ;
- date d'echeance ;
- recurrence ;
- priorite : basse, normale, haute, critique ;
- responsable ;
- statut : a faire, planifie, fait, en retard ;
- notes.

Actions :

- creer un rappel ;
- modifier un rappel ;
- marquer comme fait ;
- filtrer par priorite, statut et date.

## 5. Hors perimetre MVP

Ces elements ne doivent pas bloquer la premiere version :

- paiement en ligne ;
- gestion avancee multi-agences ;
- BIM complet ;
- scan 3D interne ;
- marketplace fournisseurs ;
- signature electronique ;
- messagerie interne ;
- application mobile native ;
- intelligence artificielle predictive ;
- workflow d'approbation complexe.

## 6. Exigences UX/UI

- Interface professionnelle, dense et claire, adaptee aux entreprises.
- Pas de landing page marketing comme premier ecran : l'utilisateur arrive dans l'application.
- Navigation principale visible : tableau de bord, batiments, zones, materiaux, equipements, documents, rappels.
- Donnees consultables en tableaux.
- Formulaires courts et comprehensibles.
- Design responsive pour ordinateur, tablette et telephone.
- Boutons d'action visibles : ajouter, modifier, supprimer, exporter, importer.
- Texte lisible et jamais coupe dans les boutons ou tableaux.

## 7. Exigences techniques MVP

Premiere version recommandee :

- application web responsive ;
- PWA installable ;
- stockage local pour demo et validation client ;
- export/import JSON ;
- code simple et separable pour future API ;
- structure transformable vers application mobile via Capacitor, React Native ou Flutter plus tard.

Version commerciale ulterieure :

- backend securise ;
- base PostgreSQL ;
- stockage cloud S3 compatible ;
- authentification ;
- roles utilisateurs ;
- sauvegardes ;
- audit logs ;
- notifications email/SMS/WhatsApp.

## 8. Donnees de demonstration

Le MVP doit contenir des exemples ivoiriens :

- Residence Akwaba R+7 a Cocody ;
- clinique a Marcory ;
- entrepot a Yopougon ;
- fournisseurs locaux fictifs ;
- rappels de toiture, climatisation, plomberie, extincteurs et garanties.

## 9. Criteres d'acceptation

Le MVP est acceptable si :

- un utilisateur peut creer un batiment ;
- il peut creer des zones liees a ce batiment ;
- il peut ajouter des materiaux et equipements ;
- il peut rattacher documents et rappels ;
- les donnees restent apres rechargement de la page ;
- le tableau de bord se met a jour ;
- les rappels en retard ou proches sont visibles ;
- l'interface fonctionne sur mobile et desktop ;
- les donnees peuvent etre exportees en JSON ;
- l'application peut etre servie localement ou hebergee comme site statique.

## 10. Feuille de route apres MVP

Phase 2 :

- backend et comptes utilisateurs ;
- upload reel de fichiers ;
- QR codes equipements ;
- notifications email ;
- application mobile/PWA terrain ;
- rapports PDF generes automatiquement.

Phase 3 :

- photos 360 ;
- integration Matterport ;
- planning intervention ;
- marketplace prestataires ;
- API fournisseurs ;
- analytics maintenance.

Phase 4 :

- BIM/IFC ;
- jumeau numerique ;
- scan 3D avance ;
- IA de prediction de maintenance ;
- module assurance/banque.

