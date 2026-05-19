const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const { Pool } = require("pg");
const QRCode = require("qrcode");

const app = express();
const PORT = Number(process.env.PORT || 4200);
const PUBLIC_URL = process.env.PUBLIC_URL || `http://localhost:${PORT}`;
const STORAGE_ROOT = process.env.STORAGE_ROOT || __dirname;
const DATA_DIR = path.join(STORAGE_ROOT, "data");
const UPLOAD_DIR = path.join(STORAGE_ROOT, "uploads");
const DB_FILE = path.join(DATA_DIR, "app-data.json");
const DATABASE_URL = process.env.DATABASE_URL || "";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14;
const pool = DATABASE_URL
  ? new Pool({
      connectionString: DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    })
  : null;
let runtimeDb = null;
let storeMode = "json";

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

function referenceCatalog() {
  return [
    { id: "cat-ciment-cpj", family: "Structure", category: "Ciment", name: "Ciment Portland CPJ 32.5", brand: "LafargeHolcim / Cimaf / Sococim", reference: "CPJ-CEM-II-32.5", lifespan: "50 ans et plus selon ouvrage", maintenance: "Contrôle fissures annuel", usage: "Béton courant, mortier, maçonnerie", notes: "Vérifier conformité locale, stockage au sec et date de fabrication." },
    { id: "cat-ciment-cpa", family: "Structure", category: "Ciment", name: "Ciment CPA 42.5", brand: "Cimaf / Dangote / LafargeHolcim", reference: "CPA-CEM-I-42.5", lifespan: "50 ans et plus selon ouvrage", maintenance: "Inspection structurelle périodique", usage: "Béton armé, poteaux, poutres, dalles", notes: "À utiliser selon calcul béton et dosage validé." },
    { id: "cat-fer-ha", family: "Structure", category: "Acier", name: "Fer à béton haute adhérence", brand: "SOTACI / Turkish Steel / Import", reference: "HA-FE500-D8-D25", lifespan: "50 ans et plus si protégé", maintenance: "Surveillance corrosion et fissures", usage: "Armatures béton armé", notes: "Contrôler diamètre, nuance et certificats." },
    { id: "cat-beton-pret", family: "Structure", category: "Béton", name: "Béton prêt à l'emploi", brand: "Centrale béton locale", reference: "BPE-C25/30", lifespan: "50 ans et plus", maintenance: "Inspection structure et humidité", usage: "Dalles, voiles, fondations", notes: "Conserver bons de livraison et formulation." },
    { id: "cat-parpaing", family: "Maçonnerie", category: "Bloc", name: "Parpaing creux 15/20", brand: "Fabrication locale contrôlée", reference: "BLOC-15-20", lifespan: "30 à 50 ans", maintenance: "Contrôle fissures et humidité", usage: "Murs, cloisons, façades", notes: "Vérifier résistance et cure correcte." },
    { id: "cat-brique", family: "Maçonnerie", category: "Brique", name: "Brique de terre cuite", brand: "Terre cuite locale / import", reference: "BTC-TC-10", lifespan: "50 ans et plus", maintenance: "Contrôle joints et remontées capillaires", usage: "Cloisons, murs, isolation thermique", notes: "Bonne inertie thermique." },
    { id: "cat-membrane-sbs", family: "Toiture", category: "Étanchéité", name: "Membrane bitumineuse SBS 4 mm", brand: "Soprema / Sika / Derbigum", reference: "SBS-4MM-ALU", lifespan: "10 à 20 ans", maintenance: "Inspection annuelle et après fortes pluies", usage: "Toiture terrasse, relevés d'étanchéité", notes: "Prévoir protection contre poinçonnement et UV." },
    { id: "cat-bac-acier", family: "Toiture", category: "Couverture", name: "Bac acier nervuré galvanisé", brand: "Metal Ivoire / ArcelorMittal / import", reference: "BAC75-Z275", lifespan: "15 à 30 ans", maintenance: "Contrôle fixations et corrosion annuel", usage: "Entrepôts, maisons, bâtiments industriels", notes: "Choisir épaisseur adaptée et traitement anticorrosion." },
    { id: "cat-tuile", family: "Toiture", category: "Couverture", name: "Tuile béton ou terre cuite", brand: "Monier / Terreal / local", reference: "TUILE-TC-BETON", lifespan: "25 à 50 ans", maintenance: "Nettoyage mousse et contrôle casse", usage: "Maisons, villas, bâtiments résidentiels", notes: "Prévoir pente et écran sous toiture." },
    { id: "cat-carrelage-gres", family: "Finition", category: "Carrelage", name: "Grès cérame 60x60", brand: "Marazzi / Porcelanosa / Ceramica Uno", reference: "GRES-6060-R10", lifespan: "15 à 30 ans", maintenance: "Nettoyage régulier, remplacement carreaux cassés", usage: "Sols intérieurs, halls, logements", notes: "Conserver une réserve de carreaux." },
    { id: "cat-faience", family: "Finition", category: "Carrelage", name: "Faïence murale salle d'eau", brand: "RAK / Pamesa / import", reference: "FAIENCE-30X60", lifespan: "15 à 25 ans", maintenance: "Contrôle joints silicone et infiltration", usage: "Salles de bain, cuisines", notes: "Prévoir joints hydrofuges." },
    { id: "cat-peinture-acryl", family: "Finition", category: "Peinture", name: "Peinture acrylique intérieure", brand: "Seigneurie / Astral / BatiColor", reference: "ACRYL-MAT-INT", lifespan: "3 à 7 ans", maintenance: "Reprise selon usure et humidité", usage: "Murs intérieurs", notes: "Choisir lessivable pour zones fréquentées." },
    { id: "cat-peinture-facade", family: "Finition", category: "Peinture", name: "Peinture façade anti-UV", brand: "Seigneurie / Sika / Astral", reference: "FACADE-UV-EXT", lifespan: "5 à 10 ans", maintenance: "Contrôle fissures et farinage annuel", usage: "Façades extérieures", notes: "Préparation support indispensable." },
    { id: "cat-pvc-pression", family: "Plomberie", category: "Tube", name: "Tube PVC pression", brand: "Nicoll / Girpi / local", reference: "PVC-PN16-D20-D63", lifespan: "20 à 40 ans", maintenance: "Contrôle fuites et pression", usage: "Eau froide, alimentation", notes: "Respecter pression nominale et colle compatible." },
    { id: "cat-ppr", family: "Plomberie", category: "Tube", name: "Tube PPR eau chaude/froide", brand: "Aquatherm / Vesbo / Kalde", reference: "PPR-PN20", lifespan: "25 à 50 ans", maintenance: "Contrôle soudures et dilatation", usage: "Réseaux sanitaires", notes: "Soudure thermique par technicien qualifié." },
    { id: "cat-pex", family: "Plomberie", category: "Tube", name: "Tube multicouche PEX/Alu", brand: "Uponor / Comap / Henco", reference: "PEX-AL-PEX", lifespan: "25 à 50 ans", maintenance: "Contrôle raccords et nourrices", usage: "Eau sanitaire, chauffage", notes: "Éviter exposition UV directe." },
    { id: "cat-wc", family: "Sanitaire", category: "Équipement", name: "WC suspendu ou monobloc", brand: "Roca / Jacob Delafon / Ideal Standard", reference: "WC-CERAM-STD", lifespan: "10 à 25 ans", maintenance: "Contrôle chasse, joints, fixations", usage: "Sanitaires logements et ERP", notes: "Conserver référence mécanisme chasse." },
    { id: "cat-lavabo", family: "Sanitaire", category: "Équipement", name: "Lavabo céramique", brand: "Roca / Ideal Standard / local", reference: "LAV-CERAM-60", lifespan: "10 à 25 ans", maintenance: "Contrôle siphon, robinetterie, fissures", usage: "Salles d'eau", notes: "Prévoir accès siphon." },
    { id: "cat-cable-u1000", family: "Électricité", category: "Câble", name: "Câble U1000 R2V", brand: "Nexans / Prysmian / Sycabel", reference: "U1000-R2V-3G2.5", lifespan: "25 à 40 ans", maintenance: "Contrôle échauffement et isolement", usage: "Alimentation circuits électriques", notes: "Dimensionner selon norme et puissance." },
    { id: "cat-disjoncteur", family: "Électricité", category: "Protection", name: "Disjoncteur modulaire", brand: "Schneider / Legrand / Hager", reference: "MCB-C16-C32", lifespan: "10 à 25 ans", maintenance: "Test et serrage annuel", usage: "Protection circuits", notes: "Adapter courbe et calibre." },
    { id: "cat-differentiel", family: "Électricité", category: "Protection", name: "Interrupteur différentiel 30 mA", brand: "Schneider / Legrand / Hager", reference: "RCD-30MA-40A", lifespan: "10 à 20 ans", maintenance: "Test mensuel recommandé", usage: "Protection personnes", notes: "Obligatoire sur circuits sensibles." },
    { id: "cat-led-panel", family: "Électricité", category: "Éclairage", name: "Panneau LED encastré", brand: "Philips / Osram / Opple", reference: "LED-PANEL-600-40W", lifespan: "5 à 10 ans", maintenance: "Nettoyage et remplacement driver", usage: "Bureaux, cliniques, commerces", notes: "Choisir température couleur adaptée." },
    { id: "cat-split", family: "Climatisation", category: "Climatiseur", name: "Split mural inverter", brand: "Daikin / LG / Samsung / Midea", reference: "SPLIT-INV-12000BTU", lifespan: "8 à 15 ans", maintenance: "Nettoyage filtres mensuel, entretien semestriel", usage: "Chambres, bureaux, petits locaux", notes: "Dimensionner selon volume et exposition." },
    { id: "cat-vrv", family: "Climatisation", category: "Système centralisé", name: "VRV/VRF multi-zones", brand: "Daikin / Mitsubishi / LG", reference: "VRF-MULTI-ZONE", lifespan: "10 à 20 ans", maintenance: "Contrôle trimestriel, fluide, compresseur", usage: "Immeubles, hôtels, cliniques", notes: "Contrat maintenance recommandé." },
    { id: "cat-pompe", family: "Hydraulique", category: "Pompe", name: "Pompe surpresseur", brand: "Grundfos / Wilo / Pedrollo", reference: "BOOSTER-2P-INOX", lifespan: "8 à 15 ans", maintenance: "Contrôle pression, joints, roulements semestriel", usage: "Alimentation eau immeuble", notes: "Prévoir pompe de secours pour sites critiques." },
    { id: "cat-reservoir", family: "Hydraulique", category: "Réservoir", name: "Réservoir polyéthylène", brand: "Rototec / Polytank / local", reference: "PEHD-5000L", lifespan: "10 à 25 ans", maintenance: "Nettoyage semestriel, contrôle couvercle", usage: "Stockage eau", notes: "Protéger du soleil direct si nécessaire." },
    { id: "cat-ascenseur", family: "Transport vertical", category: "Ascenseur", name: "Ascenseur passagers", brand: "Otis / Kone / Schindler / Orona", reference: "LIFT-630KG-8P", lifespan: "20 à 30 ans", maintenance: "Maintenance mensuelle obligatoire", usage: "Immeubles R+ et ERP", notes: "Contrat spécialisé obligatoire." },
    { id: "cat-extincteur", family: "Sécurité", category: "Incendie", name: "Extincteur poudre ABC 6 kg", brand: "Sicli / Desautel / local certifié", reference: "EXT-ABC-6KG", lifespan: "10 à 20 ans", maintenance: "Contrôle annuel, recharge selon usage", usage: "Sécurité incendie", notes: "Afficher emplacement et date contrôle." },
    { id: "cat-detecteur", family: "Sécurité", category: "Incendie", name: "Détecteur fumée adressable", brand: "Siemens / Honeywell / Bosch", reference: "FIRE-SMOKE-ADDR", lifespan: "8 à 12 ans", maintenance: "Test trimestriel", usage: "ERP, hôtels, cliniques, entrepôts", notes: "Relier à centrale incendie." },
    { id: "cat-camera", family: "Sécurité", category: "CCTV", name: "Caméra IP PoE", brand: "Hikvision / Dahua / Axis", reference: "IP-CAM-4MP-POE", lifespan: "5 à 10 ans", maintenance: "Nettoyage optique et test enregistrement", usage: "Surveillance bâtiment", notes: "Prévoir politique de confidentialité." },
    { id: "cat-controle-acces", family: "Sécurité", category: "Contrôle accès", name: "Lecteur badge RFID", brand: "ZKTeco / HID / Suprema", reference: "RFID-ACCESS-13.56", lifespan: "5 à 10 ans", maintenance: "Test badges et alimentation", usage: "Portes, locaux techniques", notes: "Prévoir procédure perte badge." },
    { id: "cat-menuiserie-alu", family: "Menuiserie", category: "Aluminium", name: "Fenêtre aluminium coulissante", brand: "Technal / Profils locaux", reference: "ALU-COUL-2V", lifespan: "20 à 35 ans", maintenance: "Nettoyage rails, joints, roulettes annuel", usage: "Façades, appartements, bureaux", notes: "Vérifier étanchéité à l'eau." },
    { id: "cat-porte-bois", family: "Menuiserie", category: "Bois", name: "Porte bois intérieure", brand: "Menuiserie locale / import", reference: "DOOR-WOOD-2040", lifespan: "10 à 25 ans", maintenance: "Contrôle paumelles, serrure, humidité", usage: "Pièces intérieures", notes: "Traitement anti-termites recommandé." },
    { id: "cat-vitrage", family: "Façade", category: "Vitrage", name: "Double vitrage clair", brand: "Saint-Gobain / Guardian", reference: "DV-6-12-6", lifespan: "20 à 30 ans", maintenance: "Contrôle joints et buée interne", usage: "Fenêtres, façades vitrées", notes: "Choisir contrôle solaire si exposition forte." },
    { id: "cat-groupe", family: "Énergie", category: "Groupe électrogène", name: "Groupe électrogène diesel", brand: "Perkins / Cummins / SDMO", reference: "GENSET-100KVA", lifespan: "10 à 20 ans", maintenance: "Essai mensuel, vidange, filtres", usage: "Secours énergie", notes: "Prévoir carburant, ventilation et insonorisation." },
    { id: "cat-onduleur", family: "Énergie", category: "Onduleur", name: "Onduleur UPS online", brand: "APC / Eaton / Socomec", reference: "UPS-ONLINE-10KVA", lifespan: "5 à 12 ans", maintenance: "Test batteries semestriel", usage: "Informatique, clinique, sécurité", notes: "Batteries à remplacer tous les 3 à 5 ans." },
  ];
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || "");
      const base = path
        .basename(file.originalname || "document", ext)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9_-]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 48) || "document";
      cb(null, `${Date.now()}-${crypto.randomBytes(4).toString("hex")}-${base}${ext}`);
    },
  }),
  limits: { fileSize: 25 * 1024 * 1024 },
});

app.use(express.json({ limit: "12mb" }));
app.use(express.urlencoded({ extended: true }));

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
    ],
    zones: [
      { id: "zone-toiture", buildingId: "bat-akwaba", name: "Toiture terrasse", level: "R+7", type: "Toiture", area: "620 m²", risk: "Élevé", notes: "Zone exposée aux pluies et à l'étanchéité." },
      { id: "zone-local", buildingId: "bat-akwaba", name: "Local technique principal", level: "RDC", type: "Local technique", area: "42 m²", risk: "Critique", notes: "Pompes, tableaux électriques et alimentation eau." },
      { id: "zone-bloc-operatoire", buildingId: "bat-marcory", name: "Bloc opératoire", level: "R+1", type: "Pièce", area: "160 m²", risk: "Critique", notes: "Maintenance stricte des équipements et climatisation." },
    ],
    materials: [
      { id: "mat-etancheite", buildingId: "bat-akwaba", zoneId: "zone-toiture", category: "Étanchéité", name: "Membrane bitumineuse SBS", brand: "Soprema", reference: "SBS-4MM-ALU", supplier: "Ivoire Étanchéité", quantity: "620 m²", installedAt: "2026-01-05", warrantyEnd: "2031-01-05", nextMaintenance: "2028-01-05", status: "Sous garantie", notes: "Inspection visuelle après chaque saison de fortes pluies." },
      { id: "mat-peinture", buildingId: "bat-marcory", zoneId: "zone-bloc-operatoire", category: "Peinture", name: "Peinture lessivable antibactérienne", brand: "Seigneurie", reference: "HYG-MAT", supplier: "BatiColor CI", quantity: "220 L", installedAt: "2025-08-17", warrantyEnd: "2027-08-17", nextMaintenance: "2026-08-17", status: "À surveiller", notes: "Contrôle annuel des zones de lavage." },
    ],
    equipment: [
      { id: "eq-pompe", buildingId: "bat-akwaba", zoneId: "zone-local", type: "Pompe", name: "Pompe surpresseur eau potable", brand: "Grundfos", model: "Hydro MPC", serial: "GF-CI-2026-014", supplier: "Hydro Services CI", installedAt: "2026-01-08", warrantyEnd: "2028-01-08", nextMaintenance: "2026-07-08", frequency: "Semestrielle", responsible: "Kouamé N'Guessan", status: "Actif", notes: "Contrôle pression et joints." },
      { id: "eq-clim", buildingId: "bat-marcory", zoneId: "zone-bloc-operatoire", type: "Climatisation", name: "CTA bloc opératoire", brand: "Daikin", model: "AHU-Clinic-12", serial: "DK-MAR-2188", supplier: "Froid Santé CI", installedAt: "2025-09-05", warrantyEnd: "2027-09-05", nextMaintenance: "2026-05-25", frequency: "Mensuelle", responsible: "Aminata Traoré", status: "Actif", notes: "Filtration à vérifier mensuellement." },
    ],
    documents: [
      { id: "doc-archi", buildingId: "bat-akwaba", zoneId: "", type: "Plan architectural", title: "Plans architecturaux finaux", date: "2026-01-14", fileName: "plans-akwaba-r7.pdf", fileUrl: "", status: "Validé", notes: "Version remise à la livraison." },
      { id: "doc-clim", buildingId: "bat-marcory", zoneId: "zone-bloc-operatoire", type: "Fiche technique", title: "Fiche technique CTA bloc opératoire", date: "2025-09-05", fileName: "fiche-cta-daikin.pdf", fileUrl: "", status: "Validé", notes: "À conserver pour maintenance." },
    ],
    interventions: [
      { id: "int-pompe", buildingId: "bat-akwaba", zoneId: "zone-local", equipmentId: "eq-pompe", title: "ContrÃ´le pression pompe surpresseur", type: "Maintenance prÃ©ventive", technician: "Hydro Services CI", scheduledAt: "2026-07-08", completedAt: "", status: "PlanifiÃ©e", cost: "85 000 FCFA", diagnosis: "ContrÃ´le semestriel selon planning.", actionsDone: "", photoBefore: "", photoAfter: "", clientSignature: "", notes: "VÃ©rifier joints, pression et bruit moteur." },
      { id: "int-cta", buildingId: "bat-marcory", zoneId: "zone-bloc-operatoire", equipmentId: "eq-clim", title: "Maintenance CTA bloc opÃ©ratoire", type: "Maintenance prÃ©ventive", technician: "Froid SantÃ© CI", scheduledAt: "2026-05-25", completedAt: "", status: "Ã€ planifier", cost: "95 000 FCFA", diagnosis: "Maintenance mensuelle bloc opÃ©ratoire.", actionsDone: "", photoBefore: "", photoAfter: "", clientSignature: "", notes: "Intervention hors horaires patients." },
    ],
    reminders: [
      { id: "rap-toiture", buildingId: "bat-akwaba", zoneId: "zone-toiture", type: "Inspection", title: "Inspection toiture terrasse", dueDate: "2026-06-15", recurrence: "Annuelle", priority: "Haute", assignee: "Kouamé N'Guessan", status: "Planifié", notes: "Contrôle évacuations et relevés d'étanchéité." },
      { id: "rap-clim", buildingId: "bat-marcory", zoneId: "zone-bloc-operatoire", type: "Maintenance", title: "Maintenance CTA bloc opératoire", dueDate: "2026-05-25", recurrence: "Mensuelle", priority: "Critique", assignee: "Froid Santé CI", status: "À faire", notes: "Filtres et température." },
    ],
    notifications: [],
    catalog: referenceCatalog(),
  };
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 32, "sha256").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || "").split(":");
  if (!salt || !hash) return false;
  const next = hashPassword(password, salt).split(":")[1];
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(next));
}

function defaultDb() {
  const accountId = "acct-demo";
  return {
    users: [
      {
        id: "usr-admin",
        accountId,
        name: "Administrateur BatiMemoire",
        email: "admin@ignara.xyz",
        passwordHash: hashPassword("Admin123!"),
        role: "admin",
      },
    ],
    sessions: [],
    accounts: [
      {
        id: accountId,
        company: "Ignara BTP Demo",
        domain: "ignara.xyz",
        createdAt: new Date().toISOString(),
        state: seedState(),
      },
    ],
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readJsonDb() {
  if (!fs.existsSync(DB_FILE)) {
    writeJsonDb(defaultDb());
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function writeJsonDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

async function initPostgresStore() {
  if (!pool) return null;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_store (
      id text PRIMARY KEY,
      data jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);
  const result = await pool.query("SELECT data FROM app_store WHERE id = $1", ["main"]);
  if (result.rows[0]?.data) {
    return result.rows[0].data;
  }
  const initialDb = readJsonDb();
  await writePostgresDb(initialDb);
  return initialDb;
}

async function writePostgresDb(db) {
  if (!pool) return;
  await pool.query(
    `
      INSERT INTO app_store (id, data, updated_at)
      VALUES ($1, $2::jsonb, now())
      ON CONFLICT (id)
      DO UPDATE SET data = EXCLUDED.data, updated_at = now()
    `,
    ["main", JSON.stringify(db)]
  );
}

async function initStore() {
  const jsonDb = readJsonDb();
  if (!pool) {
    runtimeDb = jsonDb;
    storeMode = "json";
    return;
  }
  try {
    runtimeDb = await initPostgresStore();
    writeJsonDb(runtimeDb);
    storeMode = "postgresql";
  } catch (error) {
    runtimeDb = jsonDb;
    storeMode = "json-fallback";
    console.error("PostgreSQL indisponible, fallback JSON active:", error.message);
  }
}

function readDb() {
  if (!runtimeDb) runtimeDb = readJsonDb();
  return clone(runtimeDb);
}

function writeDb(db) {
  runtimeDb = clone(db);
  writeJsonDb(runtimeDb);
  if (pool && storeMode === "postgresql") {
    writePostgresDb(runtimeDb).catch((error) => {
      storeMode = "json-fallback";
      console.error("Sauvegarde PostgreSQL impossible, fallback JSON active:", error.message);
    });
  }
}

function parseCookies(req) {
  return Object.fromEntries(
    String(req.headers.cookie || "")
      .split(";")
      .map((part) => part.trim().split("="))
      .filter(([key]) => key)
      .map(([key, ...value]) => [key, decodeURIComponent(value.join("="))])
  );
}

function setSessionCookie(res, token) {
  res.setHeader("Set-Cookie", `bm_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL_MS / 1000}`);
}

function clearSessionCookie(res) {
  res.setHeader("Set-Cookie", "bm_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");
}

function requireAuth(req, res, next) {
  const token = parseCookies(req).bm_session;
  const db = readDb();
  const session = db.sessions.find((item) => item.token === token && new Date(item.expiresAt) > new Date());
  if (!session) return res.status(401).json({ error: "AUTH_REQUIRED" });
  const user = db.users.find((item) => item.id === session.userId);
  const account = db.accounts.find((item) => item.id === session.accountId);
  if (!user || !account) return res.status(401).json({ error: "AUTH_REQUIRED" });
  req.db = db;
  req.session = session;
  req.user = user;
  req.account = account;
  next();
}

function publicUser(user, account) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    company: account.company,
    domain: account.domain,
  };
}

function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Accès admin requis" });
  next();
}

function userForClient(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status || "Actif",
    createdAt: user.createdAt || "",
    invitedAt: user.invitedAt || "",
    lastResetAt: user.lastResetAt || "",
  };
}

function temporaryPassword() {
  return `Bati-${crypto.randomBytes(3).toString("hex")}-CI!`;
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, publicUrl: PUBLIC_URL, storage: storeMode });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  const db = readDb();
  const user = db.users.find((item) => item.email.toLowerCase() === String(email || "").toLowerCase());
  if (!user || !verifyPassword(String(password || ""), user.passwordHash)) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }
  const token = crypto.randomBytes(32).toString("hex");
  db.sessions = db.sessions.filter((item) => new Date(item.expiresAt) > new Date());
  db.sessions.push({
    token,
    userId: user.id,
    accountId: user.accountId,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  });
  writeDb(db);
  const account = db.accounts.find((item) => item.id === user.accountId);
  setSessionCookie(res, token);
  res.json({ user: publicUser(user, account) });
});

app.post("/api/auth/logout", requireAuth, (req, res) => {
  const db = req.db;
  db.sessions = db.sessions.filter((item) => item.token !== req.session.token);
  writeDb(db);
  clearSessionCookie(res);
  res.json({ ok: true });
});

app.get("/api/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user, req.account) });
});

app.get("/api/state", requireAuth, (req, res) => {
  const state = { ...req.account.state };
  state.catalog = state.catalog?.length ? state.catalog : referenceCatalog();
  res.json(state);
});

app.put("/api/state", requireAuth, (req, res) => {
  if (req.user.role === "lecteur") return res.status(403).json({ error: "Compte en lecture seule" });
  const db = req.db;
  const account = db.accounts.find((item) => item.id === req.account.id);
  account.state = {
    ...seedState(),
    ...req.body,
    notifications: req.body.notifications || account.state.notifications || [],
    catalog: req.body.catalog?.length ? req.body.catalog : account.state.catalog?.length ? account.state.catalog : referenceCatalog(),
  };
  account.updatedAt = new Date().toISOString();
  writeDb(db);
  res.json({ ok: true });
});

app.get("/api/users", requireAuth, requireAdmin, (req, res) => {
  const users = req.db.users.filter((user) => user.accountId === req.account.id).map(userForClient);
  res.json({ users });
});

app.post("/api/users", requireAuth, requireAdmin, async (req, res) => {
  const { name, email, role } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: "Nom et email requis" });
  const db = req.db;
  const exists = db.users.some((user) => user.email.toLowerCase() === String(email).toLowerCase());
  if (exists) return res.status(409).json({ error: "Cet email existe déjà" });
  const password = temporaryPassword();
  const user = {
    id: `usr-${Date.now().toString(36)}`,
    accountId: req.account.id,
    name,
    email,
    role: ["admin", "gestionnaire", "technicien", "lecteur"].includes(role) ? role : "lecteur",
    status: "Invité",
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
    invitedAt: new Date().toISOString(),
  };
  db.users.push(user);
  writeDb(db);
  await sendEmail(
    { title: "Invitation BatiMemoire CI", message: `Bonjour ${name}, votre accès BatiMemoire CI est créé. Email: ${email}. Mot de passe temporaire: ${password}` },
    email
  );
  res.json({ user: userForClient(user), temporaryPassword: password });
});

app.put("/api/users/:id", requireAuth, requireAdmin, (req, res) => {
  const db = req.db;
  const user = db.users.find((item) => item.id === req.params.id && item.accountId === req.account.id);
  if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });
  const { name, role, status } = req.body || {};
  if (name) user.name = name;
  if (["admin", "gestionnaire", "technicien", "lecteur"].includes(role)) user.role = role;
  if (["Actif", "Invité", "Suspendu"].includes(status)) user.status = status;
  user.updatedAt = new Date().toISOString();
  writeDb(db);
  res.json({ user: userForClient(user) });
});

app.post("/api/users/:id/reset-password", requireAuth, requireAdmin, async (req, res) => {
  const db = req.db;
  const user = db.users.find((item) => item.id === req.params.id && item.accountId === req.account.id);
  if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });
  const password = temporaryPassword();
  user.passwordHash = hashPassword(password);
  user.status = "Invité";
  user.lastResetAt = new Date().toISOString();
  writeDb(db);
  await sendEmail(
    { title: "Réinitialisation BatiMemoire CI", message: `Bonjour ${user.name}, votre nouveau mot de passe temporaire est: ${password}` },
    user.email
  );
  res.json({ user: userForClient(user), temporaryPassword: password });
});

app.delete("/api/users/:id", requireAuth, requireAdmin, (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ error: "Impossible de supprimer votre propre compte" });
  const db = req.db;
  const before = db.users.length;
  db.users = db.users.filter((item) => !(item.id === req.params.id && item.accountId === req.account.id));
  if (db.users.length === before) return res.status(404).json({ error: "Utilisateur introuvable" });
  db.sessions = db.sessions.filter((session) => session.userId !== req.params.id);
  writeDb(db);
  res.json({ ok: true });
});

app.post("/api/upload", requireAuth, upload.single("document"), (req, res) => {
  if (req.user.role === "lecteur") return res.status(403).json({ error: "Compte en lecture seule" });
  if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu" });
  res.json({
    fileName: req.file.originalname,
    storedName: req.file.filename,
    size: req.file.size,
    url: `/uploads/${encodeURIComponent(req.file.filename)}`,
  });
});

app.use("/uploads", requireAuth, express.static(UPLOAD_DIR));

app.get("/qr/equipment/:id", requireAuth, async (req, res) => {
  const item = req.account.state.equipment.find((equipment) => equipment.id === req.params.id);
  if (!item) return res.status(404).send("Équipement introuvable");
  const building = req.account.state.buildings.find((entry) => entry.id === item.buildingId);
  const zone = req.account.state.zones.find((entry) => entry.id === item.zoneId);
  const targetUrl = `${PUBLIC_URL}/?equipment=${encodeURIComponent(item.id)}`;
  const qrDataUrl = await QRCode.toDataURL(targetUrl, {
    margin: 2,
    width: 320,
    color: { dark: "#113247", light: "#ffffff" },
  });
  res.send(`<!doctype html>
    <html lang="fr">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>QR - ${escapeHtml(item.name)}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 28px; color: #113247; background: #f5f8fa; }
          main { max-width: 620px; margin: auto; background: #fff; border: 1px solid #d9e2e8; border-radius: 8px; padding: 24px; }
          h1 { margin: 0 0 6px; font-size: 26px; }
          p { margin: 6px 0; color: #60717d; }
          img { width: 260px; height: 260px; display: block; margin: 24px auto; }
          dl { display: grid; grid-template-columns: 140px 1fr; gap: 8px 16px; }
          dt { font-weight: 700; }
          dd { margin: 0; }
          button { background: #168a7a; color: #fff; border: 0; border-radius: 7px; padding: 10px 14px; font-weight: 700; cursor: pointer; }
          @media print { button { display: none; } body { background: #fff; } main { border: 0; } }
        </style>
      </head>
      <body>
        <main>
          <h1>${escapeHtml(item.name)}</h1>
          <p>QR code équipement - BatiMemoire CI</p>
          <img src="${qrDataUrl}" alt="QR code équipement" />
          <dl>
            <dt>Bâtiment</dt><dd>${escapeHtml(building?.name || "-")}</dd>
            <dt>Zone</dt><dd>${escapeHtml(zone?.name || "-")}</dd>
            <dt>Type</dt><dd>${escapeHtml(item.type || "-")}</dd>
            <dt>Marque</dt><dd>${escapeHtml(item.brand || "-")}</dd>
            <dt>Modèle</dt><dd>${escapeHtml(item.model || "-")}</dd>
            <dt>Série</dt><dd>${escapeHtml(item.serial || "-")}</dd>
            <dt>Maintenance</dt><dd>${escapeHtml(item.nextMaintenance || "-")}</dd>
          </dl>
          <p>Scanner ce code ouvre la fiche équipement dans l'application connectée.</p>
          <button onclick="window.print()">Imprimer l'étiquette QR</button>
        </main>
      </body>
    </html>`);
});

app.get("/api/qr/equipment/:id.svg", requireAuth, async (req, res) => {
  const item = req.account.state.equipment.find((equipment) => equipment.id === req.params.id);
  if (!item) return res.status(404).send("Équipement introuvable");
  const url = `${PUBLIC_URL}/?equipment=${encodeURIComponent(item.id)}`;
  const svg = await QRCode.toString(url, {
    type: "svg",
    margin: 2,
    color: { dark: "#113247", light: "#ffffff" },
  });
  res.type("image/svg+xml").send(svg);
});

app.post("/api/notify/reminder/:id", requireAuth, async (req, res) => {
  const reminder = req.account.state.reminders.find((item) => item.id === req.params.id);
  if (!reminder) return res.status(404).json({ error: "Rappel introuvable" });
  const channels = req.body?.channels || ["email", "sms", "whatsapp"];
  const recipients = req.body?.recipients || {};
  const notification = {
    id: `notif-${Date.now().toString(36)}`,
    reminderId: reminder.id,
    title: reminder.title,
    channels,
    status: "queued",
    createdAt: new Date().toISOString(),
    message: `Rappel BatiMemoire : ${reminder.title} prévu le ${reminder.dueDate}.`,
    providerMode: notificationMode(),
    results: [],
  };
  notification.results = await sendNotification(notification, recipients, req.user);
  notification.status = notification.results.some((item) => item.status === "sent") ? "sent-or-partial" : "queued";
  const db = req.db;
  const account = db.accounts.find((item) => item.id === req.account.id);
  account.state.notifications = account.state.notifications || [];
  account.state.notifications.unshift(notification);
  writeDb(db);
  res.json({ ok: true, notification });
});

function notificationMode() {
  const email = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  const sms = Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM);
  const whatsapp = Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
  if (email || sms || whatsapp) return "providers-configured";
  return "simulation-env-not-configured";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendNotification(notification, recipients, user) {
  const results = [];
  if (notification.channels.includes("email")) {
    results.push(await sendEmail(notification, recipients.email || user.email));
  }
  if (notification.channels.includes("sms")) {
    results.push(await sendTwilioSms(notification, recipients.sms));
  }
  if (notification.channels.includes("whatsapp")) {
    results.push(await sendWhatsApp(notification, recipients.whatsapp));
  }
  return results;
}

async function sendEmail(notification, to) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return { channel: "email", status: "simulated", reason: "SMTP non configuré" };
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_PORT) === "465",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM || "BatiMemoire CI <noreply@ignara.xyz>",
    to,
    subject: notification.title,
    text: notification.message,
  });
  return { channel: "email", status: "sent", to };
}

async function sendTwilioSms(notification, to) {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_FROM || !to) {
    return { channel: "sms", status: "simulated", reason: "Twilio non configuré ou numéro absent" };
  }
  const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");
  const body = new URLSearchParams({ To: to, From: process.env.TWILIO_FROM, Body: notification.message });
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  return { channel: "sms", status: response.ok ? "sent" : "failed", to };
}

async function sendWhatsApp(notification, to) {
  if (!process.env.WHATSAPP_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID || !to) {
    return { channel: "whatsapp", status: "simulated", reason: "WhatsApp non configuré ou numéro absent" };
  }
  const response = await fetch(`https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: notification.message },
    }),
  });
  return { channel: "whatsapp", status: response.ok ? "sent" : "failed", to };
}

const PUBLIC_FILES = new Set(["/app.js", "/styles.css", "/icon.svg", "/manifest.webmanifest", "/service-worker.js"]);

app.get([...PUBLIC_FILES], (req, res) => {
  res.sendFile(path.join(__dirname, req.path));
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

initStore()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`BatiMemoire CI disponible sur ${PUBLIC_URL}`);
      console.log(`Stockage actif : ${storeMode}`);
      console.log("Compte demo : admin@ignara.xyz / Admin123!");
    });
  })
  .catch((error) => {
    console.error("Demarrage impossible:", error);
    process.exit(1);
  });
