const STORAGE_KEY = "batimemoire-ci-mvp-v1";
const API_BASE = "/api";

const stateTemplate = {
  buildings: [],
  zones: [],
  materials: [],
  equipment: [],
  documents: [],
  reminders: [],
  notifications: [],
  catalog: [],
};

function referenceCatalog() {
  return [
    { id: "cat-ciment-cpj", family: "Structure", category: "Ciment", name: "Ciment Portland CPJ 32.5", brand: "LafargeHolcim / Cimaf / Sococim", reference: "CPJ-CEM-II-32.5", lifespan: "50 ans et plus", maintenance: "Contrôle fissures annuel", usage: "Béton courant, mortier, maçonnerie", notes: "Stockage au sec, vérifier date fabrication." },
    { id: "cat-ciment-cpa", family: "Structure", category: "Ciment", name: "Ciment CPA 42.5", brand: "Cimaf / Dangote / LafargeHolcim", reference: "CPA-CEM-I-42.5", lifespan: "50 ans et plus", maintenance: "Inspection structurelle", usage: "Béton armé, poteaux, dalles", notes: "Dosage validé par calcul béton." },
    { id: "cat-fer-ha", family: "Structure", category: "Acier", name: "Fer à béton haute adhérence", brand: "SOTACI / Turkish Steel / Import", reference: "HA-FE500-D8-D25", lifespan: "50 ans et plus", maintenance: "Surveillance corrosion", usage: "Armatures béton armé", notes: "Contrôler diamètre et certificats." },
    { id: "cat-parpaing", family: "Maçonnerie", category: "Bloc", name: "Parpaing creux 15/20", brand: "Fabrication locale contrôlée", reference: "BLOC-15-20", lifespan: "30 à 50 ans", maintenance: "Contrôle fissures et humidité", usage: "Murs et cloisons", notes: "Vérifier résistance et cure." },
    { id: "cat-membrane-sbs", family: "Toiture", category: "Étanchéité", name: "Membrane bitumineuse SBS 4 mm", brand: "Soprema / Sika / Derbigum", reference: "SBS-4MM-ALU", lifespan: "10 à 20 ans", maintenance: "Inspection annuelle", usage: "Toiture terrasse", notes: "Protéger contre UV et poinçonnement." },
    { id: "cat-bac-acier", family: "Toiture", category: "Couverture", name: "Bac acier nervuré galvanisé", brand: "Metal Ivoire / ArcelorMittal", reference: "BAC75-Z275", lifespan: "15 à 30 ans", maintenance: "Contrôle fixations et corrosion", usage: "Entrepôts, maisons, bâtiments industriels", notes: "Choisir épaisseur adaptée." },
    { id: "cat-carrelage-gres", family: "Finition", category: "Carrelage", name: "Grès cérame 60x60", brand: "Marazzi / Porcelanosa / RAK", reference: "GRES-6060-R10", lifespan: "15 à 30 ans", maintenance: "Nettoyage, remplacement casse", usage: "Sols intérieurs, halls", notes: "Conserver réserve de carreaux." },
    { id: "cat-peinture-acryl", family: "Finition", category: "Peinture", name: "Peinture acrylique intérieure", brand: "Seigneurie / Astral / BatiColor", reference: "ACRYL-MAT-INT", lifespan: "3 à 7 ans", maintenance: "Reprise selon usure", usage: "Murs intérieurs", notes: "Lessivable pour zones fréquentées." },
    { id: "cat-pvc-pression", family: "Plomberie", category: "Tube", name: "Tube PVC pression", brand: "Nicoll / Girpi / local", reference: "PVC-PN16-D20-D63", lifespan: "20 à 40 ans", maintenance: "Contrôle fuites et pression", usage: "Eau froide, alimentation", notes: "Respecter pression nominale." },
    { id: "cat-ppr", family: "Plomberie", category: "Tube", name: "Tube PPR eau chaude/froide", brand: "Aquatherm / Vesbo / Kalde", reference: "PPR-PN20", lifespan: "25 à 50 ans", maintenance: "Contrôle soudures", usage: "Réseaux sanitaires", notes: "Soudure thermique qualifiée." },
    { id: "cat-cable-u1000", family: "Électricité", category: "Câble", name: "Câble U1000 R2V", brand: "Nexans / Prysmian / Sycabel", reference: "U1000-R2V-3G2.5", lifespan: "25 à 40 ans", maintenance: "Contrôle échauffement", usage: "Circuits électriques", notes: "Dimensionner selon puissance." },
    { id: "cat-disjoncteur", family: "Électricité", category: "Protection", name: "Disjoncteur modulaire", brand: "Schneider / Legrand / Hager", reference: "MCB-C16-C32", lifespan: "10 à 25 ans", maintenance: "Test et serrage annuel", usage: "Protection circuits", notes: "Adapter courbe et calibre." },
    { id: "cat-split", family: "Climatisation", category: "Climatiseur", name: "Split mural inverter", brand: "Daikin / LG / Samsung / Midea", reference: "SPLIT-INV-12000BTU", lifespan: "8 à 15 ans", maintenance: "Filtres mensuels, entretien semestriel", usage: "Chambres, bureaux", notes: "Dimensionner selon volume." },
    { id: "cat-vrv", family: "Climatisation", category: "Système centralisé", name: "VRV/VRF multi-zones", brand: "Daikin / Mitsubishi / LG", reference: "VRF-MULTI-ZONE", lifespan: "10 à 20 ans", maintenance: "Contrôle trimestriel", usage: "Immeubles, hôtels, cliniques", notes: "Contrat maintenance recommandé." },
    { id: "cat-pompe", family: "Hydraulique", category: "Pompe", name: "Pompe surpresseur", brand: "Grundfos / Wilo / Pedrollo", reference: "BOOSTER-2P-INOX", lifespan: "8 à 15 ans", maintenance: "Contrôle pression semestriel", usage: "Alimentation eau immeuble", notes: "Prévoir pompe secours." },
    { id: "cat-ascenseur", family: "Transport vertical", category: "Ascenseur", name: "Ascenseur passagers", brand: "Otis / Kone / Schindler / Orona", reference: "LIFT-630KG-8P", lifespan: "20 à 30 ans", maintenance: "Maintenance mensuelle", usage: "Immeubles R+ et ERP", notes: "Contrat spécialisé obligatoire." },
    { id: "cat-extincteur", family: "Sécurité", category: "Incendie", name: "Extincteur poudre ABC 6 kg", brand: "Sicli / Desautel / local certifié", reference: "EXT-ABC-6KG", lifespan: "10 à 20 ans", maintenance: "Contrôle annuel", usage: "Sécurité incendie", notes: "Afficher date contrôle." },
    { id: "cat-detecteur", family: "Sécurité", category: "Incendie", name: "Détecteur fumée adressable", brand: "Siemens / Honeywell / Bosch", reference: "FIRE-SMOKE-ADDR", lifespan: "8 à 12 ans", maintenance: "Test trimestriel", usage: "ERP, hôtels, cliniques", notes: "Relier à centrale incendie." },
    { id: "cat-camera", family: "Sécurité", category: "CCTV", name: "Caméra IP PoE", brand: "Hikvision / Dahua / Axis", reference: "IP-CAM-4MP-POE", lifespan: "5 à 10 ans", maintenance: "Nettoyage optique", usage: "Surveillance bâtiment", notes: "Prévoir politique confidentialité." },
    { id: "cat-menuiserie-alu", family: "Menuiserie", category: "Aluminium", name: "Fenêtre aluminium coulissante", brand: "Technal / Profils locaux", reference: "ALU-COUL-2V", lifespan: "20 à 35 ans", maintenance: "Nettoyage rails annuel", usage: "Façades, appartements", notes: "Vérifier étanchéité eau." },
    { id: "cat-groupe", family: "Énergie", category: "Groupe électrogène", name: "Groupe électrogène diesel", brand: "Perkins / Cummins / SDMO", reference: "GENSET-100KVA", lifespan: "10 à 20 ans", maintenance: "Essai mensuel, vidange", usage: "Secours énergie", notes: "Ventilation et insonorisation." },
    { id: "cat-onduleur", family: "Énergie", category: "Onduleur", name: "Onduleur UPS online", brand: "APC / Eaton / Socomec", reference: "UPS-ONLINE-10KVA", lifespan: "5 à 12 ans", maintenance: "Test batteries semestriel", usage: "Informatique, clinique, sécurité", notes: "Batteries 3 à 5 ans." },
  ];
}

const moduleConfig = {
  buildings: {
    label: "Bâtiments",
    singular: "bâtiment",
    collection: "buildings",
    idPrefix: "bat",
    columns: [
      { key: "name", label: "Bâtiment", main: true, sub: "address" },
      { key: "type", label: "Type" },
      { key: "city", label: "Ville / quartier" },
      { key: "status", label: "Statut", badge: true },
      { key: "manager", label: "Gestionnaire" },
      { key: "surface", label: "Surface" },
      { key: "deliveredAt", label: "Livraison", date: true },
    ],
    fields: [
      { name: "name", label: "Nom du bâtiment", type: "text", required: true },
      { name: "type", label: "Type", type: "select", options: ["Immeuble collectif", "Clinique", "Hôtel", "École", "Entrepôt", "Bureaux", "Maison", "Autre"] },
      { name: "city", label: "Ville / quartier", type: "text", required: true },
      { name: "address", label: "Adresse", type: "text", required: true, full: true },
      { name: "surface", label: "Surface", type: "text" },
      { name: "floors", label: "Niveaux", type: "number" },
      { name: "owner", label: "Propriétaire / client", type: "text" },
      { name: "manager", label: "Gestionnaire technique", type: "text" },
      { name: "status", label: "Statut", type: "select", options: ["Chantier", "Livré", "En exploitation", "En maintenance"] },
      { name: "deliveredAt", label: "Date de livraison", type: "date" },
      { name: "notes", label: "Notes", type: "textarea", full: true },
    ],
  },
  zones: {
    label: "Zones",
    singular: "zone",
    collection: "zones",
    idPrefix: "zone",
    columns: [
      { key: "name", label: "Zone", main: true, sub: "level" },
      { key: "buildingId", label: "Bâtiment", relation: "building" },
      { key: "type", label: "Type" },
      { key: "risk", label: "Risque", badge: true },
      { key: "area", label: "Surface" },
      { key: "notes", label: "Notes" },
    ],
    fields: [
      { name: "buildingId", label: "Bâtiment", type: "select", relation: "buildings", required: true },
      { name: "name", label: "Nom de zone", type: "text", required: true },
      { name: "level", label: "Niveau", type: "text" },
      { name: "type", label: "Type", type: "select", options: ["Toiture", "Façade", "Étage", "Appartement", "Pièce", "Local technique", "Parking", "Extérieur", "Autre"] },
      { name: "area", label: "Surface", type: "text" },
      { name: "risk", label: "Niveau de risque", type: "select", options: ["Faible", "Moyen", "Élevé", "Critique"] },
      { name: "notes", label: "Notes", type: "textarea", full: true },
    ],
  },
  materials: {
    label: "Matériaux",
    singular: "matériau",
    collection: "materials",
    idPrefix: "mat",
    columns: [
      { key: "name", label: "Matériau", main: true, sub: "reference" },
      { key: "category", label: "Catégorie" },
      { key: "buildingId", label: "Bâtiment", relation: "building" },
      { key: "zoneId", label: "Zone", relation: "zone" },
      { key: "supplier", label: "Fournisseur" },
      { key: "warrantyEnd", label: "Garantie", date: true },
      { key: "nextMaintenance", label: "Prochaine inspection", date: true },
      { key: "status", label: "Statut", badge: true },
    ],
    fields: [
      { name: "buildingId", label: "Bâtiment", type: "select", relation: "buildings", required: true },
      { name: "zoneId", label: "Zone", type: "select", relation: "zones" },
      { name: "category", label: "Catégorie", type: "select", options: ["Toiture", "Carrelage", "Peinture", "Plomberie", "Électricité", "Menuiserie", "Façade", "Structure", "Étanchéité", "Autre"] },
      { name: "name", label: "Nom du matériau", type: "text", required: true },
      { name: "brand", label: "Marque", type: "text" },
      { name: "reference", label: "Référence", type: "text" },
      { name: "supplier", label: "Fournisseur", type: "text" },
      { name: "quantity", label: "Quantité", type: "text" },
      { name: "installedAt", label: "Date de pose", type: "date" },
      { name: "warrantyEnd", label: "Fin de garantie", type: "date" },
      { name: "nextMaintenance", label: "Prochaine inspection", type: "date" },
      { name: "status", label: "Statut", type: "select", options: ["Sous garantie", "À surveiller", "À remplacer", "Hors garantie"] },
      { name: "notes", label: "Notes", type: "textarea", full: true },
    ],
  },
  equipment: {
    label: "Équipements",
    singular: "équipement",
    collection: "equipment",
    idPrefix: "eq",
    columns: [
      { key: "name", label: "Équipement", main: true, sub: "serial" },
      { key: "type", label: "Type" },
      { key: "buildingId", label: "Bâtiment", relation: "building" },
      { key: "zoneId", label: "Zone", relation: "zone" },
      { key: "responsible", label: "Responsable" },
      { key: "nextMaintenance", label: "Maintenance", date: true },
      { key: "status", label: "Statut", badge: true },
    ],
    fields: [
      { name: "buildingId", label: "Bâtiment", type: "select", relation: "buildings", required: true },
      { name: "zoneId", label: "Zone", type: "select", relation: "zones" },
      { name: "type", label: "Type", type: "select", options: ["Climatisation", "Pompe", "Tableau électrique", "Ascenseur", "Groupe électrogène", "Extincteur", "Caméra", "Plomberie", "Sécurité", "Autre"] },
      { name: "name", label: "Nom", type: "text", required: true },
      { name: "brand", label: "Marque", type: "text" },
      { name: "model", label: "Modèle", type: "text" },
      { name: "serial", label: "Numéro de série", type: "text" },
      { name: "supplier", label: "Installateur / fournisseur", type: "text" },
      { name: "installedAt", label: "Date d'installation", type: "date" },
      { name: "warrantyEnd", label: "Fin de garantie", type: "date" },
      { name: "nextMaintenance", label: "Prochaine maintenance", type: "date" },
      { name: "frequency", label: "Fréquence", type: "select", options: ["Mensuelle", "Trimestrielle", "Semestrielle", "Annuelle", "Tous les 2 ans", "Selon besoin"] },
      { name: "responsible", label: "Responsable", type: "text" },
      { name: "status", label: "Statut", type: "select", options: ["Actif", "À surveiller", "En panne", "Remplacé"] },
      { name: "notes", label: "Notes", type: "textarea", full: true },
    ],
  },
  documents: {
    label: "Documents",
    singular: "document",
    collection: "documents",
    idPrefix: "doc",
    columns: [
      { key: "title", label: "Document", main: true, sub: "fileName" },
      { key: "type", label: "Type" },
      { key: "buildingId", label: "Bâtiment", relation: "building" },
      { key: "zoneId", label: "Zone", relation: "zone" },
      { key: "date", label: "Date", date: true },
      { key: "status", label: "Statut", badge: true },
    ],
    fields: [
      { name: "buildingId", label: "Bâtiment", type: "select", relation: "buildings", required: true },
      { name: "zoneId", label: "Zone", type: "select", relation: "zones" },
      { name: "type", label: "Type", type: "select", options: ["Plan architectural", "Plan électricité", "Plan plomberie", "Facture", "Garantie", "Fiche technique", "PV de réception", "Photo", "Rapport intervention", "Autre"] },
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "date", label: "Date", type: "date" },
      { name: "fileName", label: "Fichier", type: "file" },
      { name: "status", label: "Statut", type: "select", options: ["Brouillon", "Validé", "À mettre à jour"] },
      { name: "notes", label: "Notes", type: "textarea", full: true },
    ],
  },
  reminders: {
    label: "Rappels",
    singular: "rappel",
    collection: "reminders",
    idPrefix: "rap",
    columns: [
      { key: "title", label: "Rappel", main: true, sub: "notes" },
      { key: "type", label: "Type" },
      { key: "buildingId", label: "Bâtiment", relation: "building" },
      { key: "zoneId", label: "Zone", relation: "zone" },
      { key: "dueDate", label: "Échéance", date: true },
      { key: "priority", label: "Priorité", badge: true },
      { key: "assignee", label: "Responsable" },
      { key: "status", label: "Statut", badge: true },
    ],
    fields: [
      { name: "buildingId", label: "Bâtiment", type: "select", relation: "buildings", required: true },
      { name: "zoneId", label: "Zone", type: "select", relation: "zones" },
      { name: "type", label: "Type", type: "select", options: ["Inspection", "Maintenance", "Garantie", "Remplacement", "Contrôle sécurité", "Audit"] },
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "dueDate", label: "Date d'échéance", type: "date", required: true },
      { name: "recurrence", label: "Récurrence", type: "select", options: ["Une fois", "Mensuelle", "Trimestrielle", "Semestrielle", "Annuelle", "Tous les 2 ans", "Tous les 5 ans"] },
      { name: "priority", label: "Priorité", type: "select", options: ["Basse", "Normale", "Haute", "Critique"] },
      { name: "assignee", label: "Responsable", type: "text" },
      { name: "status", label: "Statut", type: "select", options: ["À faire", "Planifié", "Fait", "En retard"] },
      { name: "notes", label: "Notes", type: "textarea", full: true },
    ],
  },
  notifications: {
    label: "Notifications",
    singular: "notification",
    collection: "notifications",
    idPrefix: "notif",
    columns: [
      { key: "title", label: "Notification", main: true, sub: "message" },
      { key: "channels", label: "Canaux" },
      { key: "status", label: "Statut", badge: true },
      { key: "providerMode", label: "Mode" },
      { key: "createdAt", label: "Date", date: true },
    ],
    fields: [],
  },
  catalog: {
    label: "Bibliothèque",
    singular: "référence",
    collection: "catalog",
    idPrefix: "cat",
    columns: [
      { key: "name", label: "Matériel / équipement", main: true, sub: "reference" },
      { key: "family", label: "Famille" },
      { key: "category", label: "Catégorie" },
      { key: "brand", label: "Marques" },
      { key: "lifespan", label: "Durée de vie" },
      { key: "maintenance", label: "Maintenance" },
      { key: "usage", label: "Usage" },
    ],
    fields: [
      { name: "family", label: "Famille", type: "text", required: true },
      { name: "category", label: "Catégorie", type: "text", required: true },
      { name: "name", label: "Nom", type: "text", required: true },
      { name: "brand", label: "Marques", type: "text" },
      { name: "reference", label: "Référence", type: "text" },
      { name: "lifespan", label: "Durée de vie", type: "text" },
      { name: "maintenance", label: "Maintenance recommandée", type: "text", full: true },
      { name: "usage", label: "Usage", type: "text", full: true },
      { name: "notes", label: "Notes", type: "textarea", full: true },
    ],
  },
  users: {
    label: "Utilisateurs",
    singular: "utilisateur",
    collection: "users",
    idPrefix: "usr",
    columns: [
      { key: "name", label: "Utilisateur", main: true, sub: "email" },
      { key: "role", label: "Rôle", badge: true },
      { key: "status", label: "Statut", badge: true },
      { key: "createdAt", label: "Créé le", date: true },
      { key: "lastResetAt", label: "Dernier reset", date: true },
    ],
    fields: [
      { name: "name", label: "Nom complet", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "role", label: "Rôle", type: "select", options: ["admin", "gestionnaire", "technicien", "lecteur"] },
      { name: "status", label: "Statut", type: "select", options: ["Actif", "Invité", "Suspendu"] },
    ],
  },
};

let appState = loadState();
let currentView = "dashboard";
let currentEdit = null;
let serverMode = false;
let currentUser = null;
let currentUsers = [];

const dom = {
  viewTitle: document.querySelector("#viewTitle"),
  buildingFilter: document.querySelector("#buildingFilter"),
  globalSearch: document.querySelector("#globalSearch"),
  dashboardView: document.querySelector("#dashboardView"),
  moduleView: document.querySelector("#moduleView"),
  metricGrid: document.querySelector("#metricGrid"),
  activeBuildingName: document.querySelector("#activeBuildingName"),
  buildingMap: document.querySelector("#buildingMap"),
  priorityReminders: document.querySelector("#priorityReminders"),
  materialBars: document.querySelector("#materialBars"),
  warrantyList: document.querySelector("#warrantyList"),
  moduleEyebrow: document.querySelector("#moduleEyebrow"),
  moduleTitle: document.querySelector("#moduleTitle"),
  moduleSummary: document.querySelector("#moduleSummary"),
  tableHead: document.querySelector("#tableHead"),
  tableBody: document.querySelector("#tableBody"),
  addRecord: document.querySelector("#addRecord"),
  printReport: document.querySelector("#printReport"),
  resetDemo: document.querySelector("#resetDemo"),
  exportJson: document.querySelector("#exportJson"),
  importJson: document.querySelector("#importJson"),
  dialog: document.querySelector("#recordDialog"),
  form: document.querySelector("#recordForm"),
  formFields: document.querySelector("#formFields"),
  dialogTitle: document.querySelector("#dialogTitle"),
  dialogEyebrow: document.querySelector("#dialogEyebrow"),
  closeDialog: document.querySelector("#closeDialog"),
  cancelDialog: document.querySelector("#cancelDialog"),
  loginScreen: document.querySelector("#loginScreen"),
  loginForm: document.querySelector("#loginForm"),
  loginMessage: document.querySelector("#loginMessage"),
  userChip: document.querySelector("#userChip"),
  userCompany: document.querySelector("#userCompany"),
  userName: document.querySelector("#userName"),
  logoutButton: document.querySelector("#logoutButton"),
};

function seedState() {
  return {
    buildings: [
      {
        id: "bat-akwaba",
        name: "Résidence Akwaba R+7",
        type: "Immeuble collectif",
        city: "Cocody, Abidjan",
        address: "Boulevard Mitterrand, Cocody",
        surface: "5 800 m²",
        floors: 8,
        owner: "Groupe Immobilier Akwaba",
        manager: "Kouamé N'Guessan",
        status: "En exploitation",
        deliveredAt: "2026-01-15",
        notes: "Immeuble résidentiel avec parking, toiture terrasse et deux locaux techniques.",
      },
      {
        id: "bat-marcory",
        name: "Clinique Les Lagunes",
        type: "Clinique",
        city: "Marcory, Abidjan",
        address: "Zone 4, rue du Canal",
        surface: "2 400 m²",
        floors: 4,
        owner: "Clinique Les Lagunes SARL",
        manager: "Aminata Traoré",
        status: "En exploitation",
        deliveredAt: "2025-09-20",
        notes: "Bâtiment sensible avec climatisation, plomberie médicale et exigences de maintenance fortes.",
      },
      {
        id: "bat-yopougon",
        name: "Entrepôt Yop Logistique",
        type: "Entrepôt",
        city: "Yopougon, Abidjan",
        address: "Zone industrielle de Yopougon",
        surface: "7 200 m²",
        floors: 1,
        owner: "Yop Logistique",
        manager: "Serge Bamba",
        status: "Chantier",
        deliveredAt: "2026-08-30",
        notes: "Entrepôt avec charpente métallique, toiture bac acier et système incendie.",
      },
    ],
    zones: [
      { id: "zone-toiture", buildingId: "bat-akwaba", name: "Toiture terrasse", level: "R+7", type: "Toiture", area: "620 m²", risk: "Élevé", notes: "Zone exposée aux pluies et à l'étanchéité." },
      { id: "zone-local", buildingId: "bat-akwaba", name: "Local technique principal", level: "RDC", type: "Local technique", area: "42 m²", risk: "Critique", notes: "Pompes, tableaux électriques et alimentation eau." },
      { id: "zone-a301", buildingId: "bat-akwaba", name: "Appartement A301", level: "R+3", type: "Appartement", area: "92 m²", risk: "Moyen", notes: "Zone témoin pour suivi carrelage et plomberie." },
      { id: "zone-bloc-operatoire", buildingId: "bat-marcory", name: "Bloc opératoire", level: "R+1", type: "Pièce", area: "160 m²", risk: "Critique", notes: "Maintenance stricte des équipements et climatisation." },
      { id: "zone-stock", buildingId: "bat-yopougon", name: "Zone stockage nord", level: "RDC", type: "Parking", area: "3 100 m²", risk: "Moyen", notes: "Sol industriel et système incendie." },
    ],
    materials: [
      { id: "mat-etancheite", buildingId: "bat-akwaba", zoneId: "zone-toiture", category: "Étanchéité", name: "Membrane bitumineuse SBS", brand: "Soprema", reference: "SBS-4MM-ALU", supplier: "Ivoire Étanchéité", quantity: "620 m²", installedAt: "2026-01-05", warrantyEnd: "2031-01-05", nextMaintenance: "2028-01-05", status: "Sous garantie", notes: "Inspection visuelle après chaque saison de fortes pluies." },
      { id: "mat-carrelage", buildingId: "bat-akwaba", zoneId: "zone-a301", category: "Carrelage", name: "Carrelage grès cérame 60x60", brand: "Ceramica Uno", reference: "CU6060-GR", supplier: "Carro CI", quantity: "92 m²", installedAt: "2025-12-12", warrantyEnd: "2028-12-12", nextMaintenance: "2027-12-12", status: "Sous garantie", notes: "Conserver 4 cartons de réserve pour remplacement." },
      { id: "mat-peinture", buildingId: "bat-marcory", zoneId: "zone-bloc-operatoire", category: "Peinture", name: "Peinture lessivable antibactérienne", brand: "Seigneurie", reference: "HYG-MAT", supplier: "BatiColor CI", quantity: "220 L", installedAt: "2025-08-17", warrantyEnd: "2027-08-17", nextMaintenance: "2026-08-17", status: "À surveiller", notes: "Contrôle annuel des zones de lavage." },
      { id: "mat-bacacier", buildingId: "bat-yopougon", zoneId: "zone-stock", category: "Toiture", name: "Bac acier nervuré", brand: "Metal Ivoire", reference: "BAC75-Z275", supplier: "Metal Ivoire", quantity: "7 500 m²", installedAt: "2026-04-02", warrantyEnd: "2036-04-02", nextMaintenance: "2027-04-02", status: "Sous garantie", notes: "Prévoir inspection fixations et corrosion." },
    ],
    equipment: [
      { id: "eq-pompe", buildingId: "bat-akwaba", zoneId: "zone-local", type: "Pompe", name: "Pompe surpresseur eau potable", brand: "Grundfos", model: "Hydro MPC", serial: "GF-CI-2026-014", supplier: "Hydro Services CI", installedAt: "2026-01-08", warrantyEnd: "2028-01-08", nextMaintenance: "2026-07-08", frequency: "Semestrielle", responsible: "Kouamé N'Guessan", status: "Actif", notes: "Contrôle pression et joints." },
      { id: "eq-tableau", buildingId: "bat-akwaba", zoneId: "zone-local", type: "Tableau électrique", name: "TGBT principal", brand: "Schneider Electric", model: "Prisma", serial: "TGBT-AKW-001", supplier: "ElecPro Abidjan", installedAt: "2025-12-20", warrantyEnd: "2027-12-20", nextMaintenance: "2026-06-20", frequency: "Semestrielle", responsible: "ElecPro Abidjan", status: "À surveiller", notes: "Thermographie recommandée." },
      { id: "eq-clim", buildingId: "bat-marcory", zoneId: "zone-bloc-operatoire", type: "Climatisation", name: "CTA bloc opératoire", brand: "Daikin", model: "AHU-Clinic-12", serial: "DK-MAR-2188", supplier: "Froid Santé CI", installedAt: "2025-09-05", warrantyEnd: "2027-09-05", nextMaintenance: "2026-05-25", frequency: "Mensuelle", responsible: "Aminata Traoré", status: "Actif", notes: "Filtration à vérifier mensuellement." },
      { id: "eq-incendie", buildingId: "bat-yopougon", zoneId: "zone-stock", type: "Sécurité", name: "Centrale détection incendie", brand: "Siemens", model: "FC2020", serial: "SI-YOP-502", supplier: "SecureFire CI", installedAt: "2026-03-15", warrantyEnd: "2029-03-15", nextMaintenance: "2026-06-15", frequency: "Trimestrielle", responsible: "Serge Bamba", status: "Actif", notes: "Test sirène et capteurs." },
    ],
    documents: [
      { id: "doc-archi", buildingId: "bat-akwaba", zoneId: "", type: "Plan architectural", title: "Plans architecturaux finaux", date: "2026-01-14", fileName: "plans-akwaba-r7.pdf", status: "Validé", notes: "Version remise à la livraison." },
      { id: "doc-garantie-pompe", buildingId: "bat-akwaba", zoneId: "zone-local", type: "Garantie", title: "Garantie pompe surpresseur", date: "2026-01-08", fileName: "garantie-grundfos-akwaba.pdf", status: "Validé", notes: "Garantie 24 mois." },
      { id: "doc-clim", buildingId: "bat-marcory", zoneId: "zone-bloc-operatoire", type: "Fiche technique", title: "Fiche technique CTA bloc opératoire", date: "2025-09-05", fileName: "fiche-cta-daikin.pdf", status: "Validé", notes: "À conserver pour maintenance." },
      { id: "doc-yop", buildingId: "bat-yopougon", zoneId: "zone-stock", type: "Plan électricité", title: "Plan réseau sécurité incendie", date: "2026-03-16", fileName: "plan-incendie-yop-logistique.pdf", status: "Brouillon", notes: "Validation finale attendue." },
    ],
    reminders: [
      { id: "rap-toiture", buildingId: "bat-akwaba", zoneId: "zone-toiture", type: "Inspection", title: "Inspection toiture terrasse", dueDate: "2026-06-15", recurrence: "Annuelle", priority: "Haute", assignee: "Kouamé N'Guessan", status: "Planifié", notes: "Contrôle évacuations et relevés d'étanchéité." },
      { id: "rap-tgbt", buildingId: "bat-akwaba", zoneId: "zone-local", type: "Maintenance", title: "Contrôle TGBT principal", dueDate: "2026-05-15", recurrence: "Semestrielle", priority: "Critique", assignee: "ElecPro Abidjan", status: "En retard", notes: "Thermographie et serrage." },
      { id: "rap-clim", buildingId: "bat-marcory", zoneId: "zone-bloc-operatoire", type: "Maintenance", title: "Maintenance CTA bloc opératoire", dueDate: "2026-05-25", recurrence: "Mensuelle", priority: "Critique", assignee: "Froid Santé CI", status: "À faire", notes: "Filtres et température." },
      { id: "rap-incendie", buildingId: "bat-yopougon", zoneId: "zone-stock", type: "Contrôle sécurité", title: "Test centrale incendie", dueDate: "2026-06-15", recurrence: "Trimestrielle", priority: "Haute", assignee: "SecureFire CI", status: "Planifié", notes: "Test sirène et capteurs." },
      { id: "rap-carrelage", buildingId: "bat-akwaba", zoneId: "zone-a301", type: "Garantie", title: "Vérifier réserve carrelage A301", dueDate: "2026-09-10", recurrence: "Une fois", priority: "Normale", assignee: "Kouamé N'Guessan", status: "À faire", notes: "Confirmer stockage des cartons de réserve." },
    ],
    notifications: [],
    catalog: referenceCatalog(),
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    const state = { ...structuredClone(stateTemplate), ...parsed };
    state.catalog = state.catalog?.length ? state.catalog : referenceCatalog();
    return state;
  } catch {
    return seedState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  if (serverMode && currentUser) {
    fetch(`${API_BASE}/state`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appState),
    }).catch(() => showToast("Sauvegarde serveur temporairement indisponible."));
  }
}

async function apiJson(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Erreur serveur" }));
    throw new Error(error.error || "Erreur serveur");
  }
  return response.json();
}

async function hydrateFromServer() {
  try {
    await apiJson("/health");
    serverMode = true;
  } catch {
    serverMode = false;
    document.body.classList.remove("auth-required");
    handleEquipmentDeepLink();
    return;
  }

  try {
    const session = await apiJson("/me");
    currentUser = session.user;
    await loadServerState();
    showAppSession();
  } catch {
    document.body.classList.add("auth-required");
    dom.loginScreen.hidden = false;
  }
}

async function loadServerState() {
  appState = await apiJson("/state");
  appState.catalog = appState.catalog?.length ? appState.catalog : referenceCatalog();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  renderBuildingFilter();
  setView(currentView);
}

async function loadUsers() {
  if (!serverMode || currentUser?.role !== "admin") return;
  const result = await apiJson("/users");
  currentUsers = result.users || [];
}

function showAppSession() {
  document.body.classList.remove("auth-required");
  dom.loginScreen.hidden = true;
  dom.userChip.hidden = false;
  dom.userCompany.textContent = currentUser?.company || "Entreprise";
  dom.userName.textContent = currentUser?.name || currentUser?.email || "Utilisateur";
  if (currentUser?.role === "admin") loadUsers();
  window.setTimeout(handleEquipmentDeepLink, 100);
}

function handleEquipmentDeepLink() {
  const equipmentId = new URLSearchParams(window.location.search).get("equipment");
  if (!equipmentId) return;
  const record = appState.equipment.find((item) => item.id === equipmentId);
  if (!record) {
    showToast("Équipement introuvable pour ce QR code.");
    return;
  }
  dom.buildingFilter.value = record.buildingId || "all";
  setView("equipment");
  openDialog("equipment", record);
  showToast(`Fiche ouverte : ${record.name}`);
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function slug(value) {
  return normalize(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function formatDate(value) {
  if (!value) return "-";
  const date = String(value).includes("T") ? new Date(value) : new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function daysUntil(value) {
  if (!value) return null;
  const target = new Date(`${value}T00:00:00`);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.ceil((target - today) / 86400000);
}

function buildingName(id) {
  return appState.buildings.find((item) => item.id === id)?.name || "-";
}

function zoneName(id) {
  return appState.zones.find((item) => item.id === id)?.name || "-";
}

function activeBuildingId() {
  const selected = dom.buildingFilter.value;
  if (selected && selected !== "all") return selected;
  return appState.buildings[0]?.id || "";
}

function selectedBuildingScope() {
  const selected = dom.buildingFilter.value;
  return selected && selected !== "all" ? selected : null;
}

function scopedRecords(collection) {
  if (collection === "users") return currentUsers;
  if (collection === "catalog") return appState.catalog || [];
  const records = appState[collection] || [];
  const scope = selectedBuildingScope();
  if (!scope || collection === "buildings") {
    return collection === "buildings" && scope ? records.filter((item) => item.id === scope) : records;
  }
  return records.filter((item) => item.buildingId === scope);
}

function searchRecords(moduleKey, records) {
  const query = normalize(dom.globalSearch.value);
  if (!query) return records;
  return records.filter((record) => normalize(searchText(moduleKey, record)).includes(query));
}

function searchText(moduleKey, record) {
  const relationText = [buildingName(record.buildingId), zoneName(record.zoneId)].join(" ");
  return `${Object.values(record).join(" ")} ${relationText}`;
}

function statusBadge(value) {
  if (!value) return "-";
  const className = slug(value);
  return `<span class="badge ${className}">${escapeHtml(value)}</span>`;
}

function renderBuildingFilter() {
  const current = dom.buildingFilter.value || "all";
  const options = [
    `<option value="all">Tous les bâtiments</option>`,
    ...appState.buildings.map((building) => `<option value="${building.id}">${escapeHtml(building.name)}</option>`),
  ];
  dom.buildingFilter.innerHTML = options.join("");
  dom.buildingFilter.value = appState.buildings.some((item) => item.id === current) ? current : "all";
}

function setView(view) {
  currentView = view;
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.view === view);
  });

  if (view === "dashboard") {
    dom.dashboardView.classList.add("is-active");
    dom.moduleView.classList.remove("is-active");
    dom.viewTitle.textContent = "Tableau de bord";
    renderDashboard();
    return;
  }

  dom.dashboardView.classList.remove("is-active");
  dom.moduleView.classList.add("is-active");
  dom.viewTitle.textContent = moduleConfig[view].label;
  if (view === "users" && serverMode && currentUser?.role === "admin") {
    loadUsers().then(() => renderModule(view)).catch((error) => showToast(error.message || "Chargement utilisateurs impossible."));
  }
  renderModule(view);
}

function renderDashboard() {
  const scope = selectedBuildingScope();
  const active = appState.buildings.find((building) => building.id === activeBuildingId()) || appState.buildings[0];
  const count = (collection) => scopedRecords(collection).length;
  const reminders = scopedRecords("reminders");
  const overdue = reminders.filter((item) => item.status !== "Fait" && daysUntil(item.dueDate) < 0).length;
  const soon = reminders.filter((item) => item.status !== "Fait" && daysUntil(item.dueDate) >= 0 && daysUntil(item.dueDate) <= 30).length;
  const health = calculateBuildingHealth(scope ? active?.id : null);

  dom.metricGrid.innerHTML = [
    metric("Score santÃ©", `${health.score}%`, health.label, `health-${health.level}`),
    metric("Bâtiments", scope ? 1 : appState.buildings.length, "Portefeuille"),
    metric("Zones", count("zones"), "Localisation"),
    metric("Matériaux", count("materials"), "Références"),
    metric("Équipements", count("equipment"), "Actifs"),
    metric("Documents", count("documents"), "Dossier"),
    metric("Alertes", overdue + soon, `${overdue} retard`),
  ].join("");

  dom.activeBuildingName.textContent = active?.name || "Aucun bâtiment";
  renderBuildingMap(active);
  renderPriorityReminders(reminders);
  renderMaterialBars(scopedRecords("materials"));
  renderWarrantyList([...scopedRecords("materials"), ...scopedRecords("equipment")]);
}

function calculateBuildingHealth(buildingId = null) {
  const filter = (records) => (buildingId ? records.filter((item) => item.buildingId === buildingId) : records);
  const reminders = filter(appState.reminders).filter((item) => item.status !== "Fait");
  const equipment = filter(appState.equipment);
  const materials = filter(appState.materials);
  const overdue = reminders.filter((item) => daysUntil(item.dueDate) < 0).length;
  const critical = reminders.filter((item) => item.priority === "Critique").length;
  const soon = reminders.filter((item) => daysUntil(item.dueDate) >= 0 && daysUntil(item.dueDate) <= 30).length;
  const broken = equipment.filter((item) => ["En panne", "Ã€ surveiller"].includes(item.status)).length;
  const replace = materials.filter((item) => ["Ã€ remplacer", "Ã€ surveiller"].includes(item.status)).length;
  const expiredWarranty = [...equipment, ...materials].filter((item) => item.warrantyEnd && daysUntil(item.warrantyEnd) < 0).length;
  const penalty = overdue * 14 + critical * 10 + soon * 4 + broken * 8 + replace * 6 + expiredWarranty * 3;
  const score = Math.max(0, Math.min(100, 100 - penalty));
  if (score >= 85) return { score, label: "Excellent", level: "good" };
  if (score >= 70) return { score, label: "Stable", level: "ok" };
  if (score >= 50) return { score, label: "Ã€ surveiller", level: "watch" };
  return { score, label: "Critique", level: "risk" };
}

function metric(label, value, note, className = "") {
  return `<article class="metric ${escapeHtml(className)}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(note)}</small></article>`;
}

function renderBuildingMap(building) {
  if (!building) {
    dom.buildingMap.innerHTML = `<div class="empty-state">Aucun bâtiment disponible.</div>`;
    return;
  }
  const zones = appState.zones.filter((zone) => zone.buildingId === building.id).slice(0, 5);
  const floors = Math.max(3, Math.min(Number(building.floors) || 4, 6));
  const floorRows = Array.from({ length: floors }, (_, index) => {
    const label = index === floors - 1 ? "Toiture" : index === 0 ? "RDC" : `R+${index}`;
    const zoneCount = zones.filter((zone) => normalize(zone.level).includes(normalize(label))).length;
    return `<div class="floor"><strong>${label}</strong><span>${zoneCount || ""} zone${zoneCount > 1 ? "s" : ""}</span></div>`;
  }).reverse();
  const zoneRows = zones
    .map((zone) => `<div class="zone-chip"><strong>${escapeHtml(zone.name)}</strong><span>${escapeHtml(zone.type)} · ${escapeHtml(zone.risk)}</span></div>`)
    .join("");

  dom.buildingMap.innerHTML = `
    <div class="building-stack">${floorRows.join("")}</div>
    <div class="zone-list">${zoneRows || '<div class="empty-state">Aucune zone.</div>'}</div>
  `;
}

function renderPriorityReminders(reminders) {
  const sorted = [...reminders]
    .filter((item) => item.status !== "Fait")
    .sort((a, b) => (daysUntil(a.dueDate) ?? 9999) - (daysUntil(b.dueDate) ?? 9999))
    .slice(0, 5);
  dom.priorityReminders.innerHTML =
    sorted
      .map((item) => {
        const delta = daysUntil(item.dueDate);
        const timing = delta < 0 ? `${Math.abs(delta)} jour(s) de retard` : `dans ${delta} jour(s)`;
        return `
          <article class="list-row">
            <strong>${escapeHtml(item.title)}</strong>
            <span>${escapeHtml(buildingName(item.buildingId))} · ${formatDate(item.dueDate)} · ${escapeHtml(timing)}</span>
            <div class="row-meta">${statusBadge(item.priority)} ${statusBadge(item.status)}</div>
          </article>
        `;
      })
      .join("") || `<div class="empty-state">Aucun rappel prioritaire.</div>`;
}

function renderMaterialBars(materials) {
  const grouped = materials.reduce((acc, material) => {
    acc[material.category] = (acc[material.category] || 0) + 1;
    return acc;
  }, {});
  const entries = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map((entry) => entry[1]), 1);
  dom.materialBars.innerHTML =
    entries
      .map(([label, value]) => {
        const width = Math.max(12, Math.round((value / max) * 100));
        return `
          <div class="bar-row">
            <span class="bar-label">${escapeHtml(label)}</span>
            <span class="bar-track"><span class="bar-fill" style="width:${width}%"></span></span>
            <strong>${value}</strong>
          </div>
        `;
      })
      .join("") || `<div class="empty-state">Aucun matériau enregistré.</div>`;
}

function renderWarrantyList(records) {
  const warranties = records
    .filter((item) => item.warrantyEnd)
    .map((item) => ({ ...item, days: daysUntil(item.warrantyEnd) }))
    .sort((a, b) => a.days - b.days)
    .slice(0, 5);
  dom.warrantyList.innerHTML =
    warranties
      .map((item) => {
        const label = item.days < 0 ? "expirée" : item.days <= 180 ? "à surveiller" : "active";
        return `
          <article class="list-row">
            <strong>${escapeHtml(item.name)}</strong>
            <span>${escapeHtml(buildingName(item.buildingId))} · ${formatDate(item.warrantyEnd)}</span>
            <div class="row-meta">${statusBadge(label)}</div>
          </article>
        `;
      })
      .join("") || `<div class="empty-state">Aucune garantie enregistrée.</div>`;
}

function renderModule(moduleKey) {
  const config = moduleConfig[moduleKey];
  const records = searchRecords(moduleKey, scopedRecords(config.collection));
  dom.moduleEyebrow.textContent = "Module MVP";
  dom.moduleTitle.textContent = config.label;
  dom.addRecord.textContent = `Ajouter ${config.singular}`;
  dom.addRecord.hidden = !config.fields.length;
  dom.tableHead.innerHTML = `<tr>${config.columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("")}<th>Actions</th></tr>`;
  dom.tableBody.innerHTML = records.length
    ? records.map((record) => renderRow(moduleKey, record)).join("")
    : `<tr><td colspan="${config.columns.length + 1}"><div class="empty-state">Aucune donnée pour ce filtre.</div></td></tr>`;
  renderModuleSummary(moduleKey, records);
}

function renderModuleSummary(moduleKey, records) {
  const config = moduleConfig[moduleKey];
  let items = [
    ["Total", records.length],
    ["Bâtiments", new Set(records.map((item) => item.buildingId || item.id).filter(Boolean)).size],
  ];
  if (moduleKey === "reminders") {
    items = [
      ["Total", records.length],
      ["En retard", records.filter((item) => item.status !== "Fait" && daysUntil(item.dueDate) < 0).length],
      ["30 jours", records.filter((item) => item.status !== "Fait" && daysUntil(item.dueDate) >= 0 && daysUntil(item.dueDate) <= 30).length],
    ];
  }
  if (moduleKey === "documents") {
    items.push(["Validés", records.filter((item) => item.status === "Validé").length]);
  }
  dom.moduleSummary.innerHTML = items
    .map(([label, value]) => `<div class="summary-pill"><strong>${value}</strong><span>${escapeHtml(label)}</span></div>`)
    .join("");
  dom.moduleEyebrow.textContent = `${config.singular} · ${records.length} élément${records.length > 1 ? "s" : ""}`;
}

function renderRow(moduleKey, record) {
  const config = moduleConfig[moduleKey];
  const cells = config.columns.map((column) => `<td>${renderCell(record, column)}</td>`).join("");
  const actions = config.fields.length
    ? `
          ${moduleKey === "users" ? `<button type="button" data-reset-user="${record.id}">Reset</button>` : ""}
          ${moduleKey === "equipment" ? `<button type="button" data-qr="${record.id}">QR</button>` : ""}
          ${moduleKey === "reminders" ? `<button type="button" data-notify="${record.id}">Notifier</button>` : ""}
          ${moduleKey === "reminders" && record.status !== "Fait" ? `<button type="button" data-complete="${record.id}">Fait</button>` : ""}
          <button type="button" data-edit="${record.id}">Modifier</button>
          <button type="button" data-delete="${record.id}">Supprimer</button>
      `
    : `<span class="subtext">Lecture seule</span>`;
  return `
    <tr>
      ${cells}
      <td>
        <div class="row-actions">
          ${actions}
        </div>
      </td>
    </tr>
  `;
}

function renderCell(record, column) {
  let value = record[column.key];
  if (column.relation === "building") value = buildingName(value);
  if (column.relation === "zone") value = zoneName(value);
  if (column.date) value = formatDate(value);
  if (Array.isArray(value)) value = value.join(", ");
  if (column.badge) return statusBadge(value);
  if (column.main) {
    const sub = column.sub ? record[column.sub] : "";
    if (column.key === "title" && record.fileUrl) {
      return `<a class="main-cell" href="${escapeHtml(record.fileUrl)}" target="_blank" rel="noreferrer">${escapeHtml(value || "-")}</a>${sub ? `<span class="subtext">${escapeHtml(sub)}</span>` : ""}`;
    }
    return `<span class="main-cell">${escapeHtml(value || "-")}</span>${sub ? `<span class="subtext">${escapeHtml(sub)}</span>` : ""}`;
  }
  return escapeHtml(value || "-");
}

function openDialog(moduleKey, record = null) {
  const config = moduleConfig[moduleKey];
  if (!config.fields.length) return;
  currentEdit = { moduleKey, id: record?.id || null };
  dom.dialogEyebrow.textContent = config.label;
  dom.dialogTitle.textContent = record ? `Modifier ${config.singular}` : `Ajouter ${config.singular}`;
  dom.formFields.innerHTML = config.fields.map((field) => renderField(field, record)).join("");
  dom.dialog.showModal();
}

function renderField(field, record) {
  const value = record?.[field.name] ?? defaultValue(field);
  const required = field.required ? "required" : "";
  const fieldClass = field.full || field.type === "textarea" ? "field full" : "field";
  const label = `<span>${escapeHtml(field.label)}</span>`;

  if (field.type === "textarea") {
    return `<label class="${fieldClass}">${label}<textarea name="${field.name}" ${required}>${escapeHtml(value)}</textarea></label>`;
  }
  if (field.type === "select") {
    return `<label class="${fieldClass}">${label}<select name="${field.name}" ${required}>${selectOptions(field, value)}</select></label>`;
  }
  if (field.type === "file") {
    return `
      <label class="${fieldClass}">
        ${label}
        <input name="${field.name}" type="file" data-current="${escapeHtml(value)}" />
        ${value ? `<span class="subtext">Actuel : ${escapeHtml(value)}</span>` : ""}
      </label>
    `;
  }
  return `<label class="${fieldClass}">${label}<input name="${field.name}" type="${field.type}" value="${escapeHtml(value)}" ${required} /></label>`;
}

function defaultValue(field) {
  if (field.name === "buildingId") return activeBuildingId();
  if (field.name === "status") return field.options?.[0] || "";
  if (field.name === "priority") return "Normale";
  if (field.type === "date") return "";
  return "";
}

function selectOptions(field, value) {
  if (field.relation === "buildings") {
    return appState.buildings.map((building) => option(building.id, building.name, value)).join("");
  }
  if (field.relation === "zones") {
    const zones = appState.zones.filter((zone) => !selectedBuildingScope() || zone.buildingId === selectedBuildingScope());
    return [`<option value="">Aucune zone</option>`, ...zones.map((zone) => option(zone.id, `${zone.name} · ${buildingName(zone.buildingId)}`, value))].join("");
  }
  return (field.options || []).map((item) => option(item, item, value)).join("");
}

function option(optionValue, label, selectedValue) {
  return `<option value="${escapeHtml(optionValue)}" ${optionValue === selectedValue ? "selected" : ""}>${escapeHtml(label)}</option>`;
}

async function handleSubmit(event) {
  event.preventDefault();
  const { moduleKey, id } = currentEdit;
  const config = moduleConfig[moduleKey];
  if (moduleKey === "users") {
    await saveUserFromForm(id);
    return;
  }
  const formData = new FormData(dom.form);
  const payload = {};
  config.fields.forEach((field) => {
    if (field.type === "file") {
      const input = dom.form.querySelector(`[name="${field.name}"]`);
      payload[field.name] = input.dataset.current || "";
      return;
    }
    payload[field.name] = String(formData.get(field.name) || "").trim();
  });

  const fileInput = dom.form.querySelector('input[type="file"][name="fileName"]');
  if (fileInput?.files?.[0]) {
    try {
      const uploaded = await uploadDocument(fileInput.files[0]);
      payload.fileName = uploaded.fileName;
      payload.fileUrl = uploaded.url;
      payload.storedName = uploaded.storedName;
    } catch (error) {
      showToast(error.message || "Upload impossible.");
      return;
    }
  }

  if (id) {
    appState[config.collection] = appState[config.collection].map((item) => (item.id === id ? { ...item, ...payload, updatedAt: new Date().toISOString() } : item));
    showToast(`${config.singular} modifié.`);
  } else {
    appState[config.collection].push({ id: uid(config.idPrefix), ...payload, createdAt: new Date().toISOString() });
    showToast(`${config.singular} ajouté.`);
  }

  saveState();
  dom.dialog.close();
  renderBuildingFilter();
  setView(moduleKey);
}

async function saveUserFromForm(id) {
  const formData = new FormData(dom.form);
  const payload = {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    role: String(formData.get("role") || "lecteur").trim(),
    status: String(formData.get("status") || "Actif").trim(),
  };
  try {
    const result = await apiJson(id ? `/users/${encodeURIComponent(id)}` : "/users", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(payload),
    });
    await loadUsers();
    dom.dialog.close();
    setView("users");
    if (result.temporaryPassword) {
      showToast(`Utilisateur créé. Mot de passe temporaire : ${result.temporaryPassword}`);
    } else {
      showToast("Utilisateur modifié.");
    }
  } catch (error) {
    showToast(error.message || "Action utilisateur impossible.");
  }
}

async function uploadDocument(file) {
  if (!serverMode || !currentUser) {
    return { fileName: file.name, url: "", storedName: "" };
  }
  const body = new FormData();
  body.append("document", file);
  const response = await fetch(`${API_BASE}/upload`, { method: "POST", body });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Upload impossible" }));
    throw new Error(error.error || "Upload impossible");
  }
  return response.json();
}

function deleteRecord(moduleKey, id) {
  const config = moduleConfig[moduleKey];
  if (moduleKey === "users") {
    deleteUser(id);
    return;
  }
  const record = appState[config.collection].find((item) => item.id === id);
  if (!record) return;
  if (!confirm(`Supprimer "${record.name || record.title}" ?`)) return;

  if (moduleKey === "buildings") {
    appState.buildings = appState.buildings.filter((item) => item.id !== id);
    ["zones", "materials", "equipment", "documents", "reminders"].forEach((collection) => {
      appState[collection] = appState[collection].filter((item) => item.buildingId !== id);
    });
  } else {
    appState[config.collection] = appState[config.collection].filter((item) => item.id !== id);
  }
  saveState();
  renderBuildingFilter();
  setView(moduleKey);
  showToast(`${config.singular} supprimé.`);
}

async function deleteUser(id) {
  const record = currentUsers.find((item) => item.id === id);
  if (!record) return;
  if (!confirm(`Supprimer l'utilisateur "${record.name}" ?`)) return;
  try {
    await apiJson(`/users/${encodeURIComponent(id)}`, { method: "DELETE" });
    await loadUsers();
    setView("users");
    showToast("Utilisateur supprimé.");
  } catch (error) {
    showToast(error.message || "Suppression impossible.");
  }
}

async function resetUserPassword(id) {
  const record = currentUsers.find((item) => item.id === id);
  if (!record) return;
  if (!confirm(`Réinitialiser le mot de passe de "${record.name}" ?`)) return;
  try {
    const result = await apiJson(`/users/${encodeURIComponent(id)}/reset-password`, { method: "POST", body: "{}" });
    await loadUsers();
    setView("users");
    showToast(`Nouveau mot de passe temporaire : ${result.temporaryPassword}`);
  } catch (error) {
    showToast(error.message || "Réinitialisation impossible.");
  }
}

function completeReminder(id) {
  appState.reminders = appState.reminders.map((item) => (item.id === id ? { ...item, status: "Fait", completedAt: new Date().toISOString() } : item));
  saveState();
  setView("reminders");
  showToast("Rappel marqué comme fait.");
}

function openEquipmentQr(id) {
  if (!serverMode || !currentUser) {
    showToast("Le QR code nécessite le serveur web connecté.");
    return;
  }
  window.open(`/qr/equipment/${encodeURIComponent(id)}`, "_blank", "noopener");
}

async function notifyReminder(id) {
  if (!serverMode || !currentUser) {
    showToast("Les notifications nécessitent le serveur web connecté.");
    return;
  }
  try {
    const result = await apiJson(`/notify/reminder/${encodeURIComponent(id)}`, {
      method: "POST",
      body: JSON.stringify({ channels: ["email", "sms", "whatsapp"] }),
    });
    appState.notifications = appState.notifications || [];
    appState.notifications.unshift(result.notification);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    showToast("Notification préparée. Configure SMTP/Twilio/WhatsApp pour l’envoi réel.");
    if (currentView === "notifications") setView("notifications");
  } catch (error) {
    showToast(error.message || "Notification impossible.");
  }
}

function exportJson() {
  const payload = JSON.stringify({ exportedAt: new Date().toISOString(), ...appState }, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `batimemoire-ci-export-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Export JSON généré.");
}

function importJson(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      const nextState = { ...structuredClone(stateTemplate) };
      Object.keys(stateTemplate).forEach((key) => {
        nextState[key] = Array.isArray(imported[key]) ? imported[key] : [];
      });
      appState = nextState;
      saveState();
      renderBuildingFilter();
      setView(currentView);
      showToast("Données importées.");
    } catch {
      showToast("Import impossible : fichier JSON invalide.");
    }
  };
  reader.readAsText(file);
}

function resetDemoData() {
  if (!confirm("Réinitialiser les données de démonstration ?")) return;
  appState = seedState();
  saveState();
  dom.globalSearch.value = "";
  renderBuildingFilter();
  setView(currentView);
  showToast("Données de démonstration restaurées.");
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  window.setTimeout(() => toast.remove(), 2600);
}

function bindEvents() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });
  document.querySelectorAll("[data-view-jump]").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.viewJump));
  });
  document.querySelectorAll("[data-quick-add]").forEach((button) => {
    button.addEventListener("click", () => openDialog(button.dataset.quickAdd));
  });
  dom.buildingFilter.addEventListener("change", () => setView(currentView));
  dom.globalSearch.addEventListener("input", () => setView(currentView));
  dom.addRecord.addEventListener("click", () => openDialog(currentView));
  dom.printReport.addEventListener("click", () => window.print());
  dom.resetDemo.addEventListener("click", resetDemoData);
  dom.exportJson.addEventListener("click", exportJson);
  dom.importJson.addEventListener("change", (event) => importJson(event.target.files[0]));
  dom.closeDialog.addEventListener("click", () => dom.dialog.close());
  dom.cancelDialog.addEventListener("click", () => dom.dialog.close());
  dom.form.addEventListener("submit", handleSubmit);
  dom.loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(dom.loginForm);
    dom.loginMessage.textContent = "Connexion en cours...";
    try {
      const result = await apiJson("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      currentUser = result.user;
      await loadServerState();
      showAppSession();
      showToast("Connexion réussie.");
    } catch (error) {
      dom.loginMessage.textContent = error.message || "Connexion impossible.";
    }
  });
  dom.logoutButton?.addEventListener("click", async () => {
    try {
      await apiJson("/auth/logout", { method: "POST", body: "{}" });
    } catch {}
    currentUser = null;
    dom.userChip.hidden = true;
    document.body.classList.add("auth-required");
    dom.loginScreen.hidden = false;
  });
  dom.tableBody.addEventListener("click", (event) => {
    const editId = event.target.closest("[data-edit]")?.dataset.edit;
    const deleteId = event.target.closest("[data-delete]")?.dataset.delete;
    const completeId = event.target.closest("[data-complete]")?.dataset.complete;
    const qrId = event.target.closest("[data-qr]")?.dataset.qr;
    const notifyId = event.target.closest("[data-notify]")?.dataset.notify;
    const resetUserId = event.target.closest("[data-reset-user]")?.dataset.resetUser;
    const config = moduleConfig[currentView];
    if (editId) {
      const record = appState[config.collection].find((item) => item.id === editId);
      openDialog(currentView, record);
    }
    if (deleteId) deleteRecord(currentView, deleteId);
    if (completeId) completeReminder(completeId);
    if (qrId) openEquipmentQr(qrId);
    if (notifyId) notifyReminder(notifyId);
    if (resetUserId) resetUserPassword(resetUserId);
  });
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  }
}

renderBuildingFilter();
bindEvents();
setView("dashboard");
registerServiceWorker();
hydrateFromServer();
