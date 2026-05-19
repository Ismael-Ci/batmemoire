const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const QRCode = require("qrcode");

const app = express();
const PORT = Number(process.env.PORT || 4200);
const PUBLIC_URL = process.env.PUBLIC_URL || `http://localhost:${PORT}`;
const STORAGE_ROOT = process.env.STORAGE_ROOT || __dirname;
const DATA_DIR = path.join(STORAGE_ROOT, "data");
const UPLOAD_DIR = path.join(STORAGE_ROOT, "uploads");
const DB_FILE = path.join(DATA_DIR, "app-data.json");
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14;

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

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
app.use(express.static(__dirname));

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
    reminders: [
      { id: "rap-toiture", buildingId: "bat-akwaba", zoneId: "zone-toiture", type: "Inspection", title: "Inspection toiture terrasse", dueDate: "2026-06-15", recurrence: "Annuelle", priority: "Haute", assignee: "Kouamé N'Guessan", status: "Planifié", notes: "Contrôle évacuations et relevés d'étanchéité." },
      { id: "rap-clim", buildingId: "bat-marcory", zoneId: "zone-bloc-operatoire", type: "Maintenance", title: "Maintenance CTA bloc opératoire", dueDate: "2026-05-25", recurrence: "Mensuelle", priority: "Critique", assignee: "Froid Santé CI", status: "À faire", notes: "Filtres et température." },
    ],
    notifications: [],
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

function readDb() {
  if (!fs.existsSync(DB_FILE)) {
    writeDb(defaultDb());
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function writeDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
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

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, publicUrl: PUBLIC_URL });
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
  res.json(req.account.state);
});

app.put("/api/state", requireAuth, (req, res) => {
  const db = req.db;
  const account = db.accounts.find((item) => item.id === req.account.id);
  account.state = { ...seedState(), ...req.body, notifications: req.body.notifications || account.state.notifications || [] };
  account.updatedAt = new Date().toISOString();
  writeDb(db);
  res.json({ ok: true });
});

app.post("/api/upload", requireAuth, upload.single("document"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu" });
  res.json({
    fileName: req.file.originalname,
    storedName: req.file.filename,
    size: req.file.size,
    url: `/uploads/${encodeURIComponent(req.file.filename)}`,
  });
});

app.use("/uploads", requireAuth, express.static(UPLOAD_DIR));

app.get("/api/qr/equipment/:id.svg", requireAuth, async (req, res) => {
  const item = req.account.state.equipment.find((equipment) => equipment.id === req.params.id);
  if (!item) return res.status(404).send("Équipement introuvable");
  const url = `${PUBLIC_URL}/index.html?equipment=${encodeURIComponent(item.id)}`;
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

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`BatiMemoire CI disponible sur ${PUBLIC_URL}`);
  console.log("Compte demo : admin@ignara.xyz / Admin123!");
});
