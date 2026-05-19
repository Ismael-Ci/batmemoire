from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "Cahier_des_charges_MVP_BatiMemoire_CI.pdf"


def register_fonts():
    calibri = Path(r"C:\Windows\Fonts\calibri.ttf")
    bold = Path(r"C:\Windows\Fonts\calibrib.ttf")
    if calibri.exists():
        pdfmetrics.registerFont(TTFont("Calibri", str(calibri)))
    if bold.exists():
        pdfmetrics.registerFont(TTFont("Calibri-Bold", str(bold)))


register_fonts()
FONT = "Calibri" if "Calibri" in pdfmetrics.getRegisteredFontNames() else "Helvetica"
BOLD = "Calibri-Bold" if "Calibri-Bold" in pdfmetrics.getRegisteredFontNames() else "Helvetica-Bold"

palette = {
    "navy": colors.HexColor("#113247"),
    "teal": colors.HexColor("#168A7A"),
    "gold": colors.HexColor("#D48A2A"),
    "ink": colors.HexColor("#263238"),
    "muted": colors.HexColor("#60717D"),
    "line": colors.HexColor("#D9E2E8"),
    "soft": colors.HexColor("#F6FAFC"),
}

styles = getSampleStyleSheet()
styles.add(ParagraphStyle("TitleX", fontName=BOLD, fontSize=24, leading=28, textColor=colors.white, spaceAfter=10))
styles.add(ParagraphStyle("SubtitleX", fontName=FONT, fontSize=12, leading=16, textColor=colors.HexColor("#DDEEF7")))
styles.add(ParagraphStyle("H1X", fontName=BOLD, fontSize=16, leading=20, textColor=palette["navy"], spaceBefore=12, spaceAfter=7))
styles.add(ParagraphStyle("H2X", fontName=BOLD, fontSize=11.5, leading=14, textColor=palette["teal"], spaceBefore=8, spaceAfter=4))
styles.add(ParagraphStyle("BodyX", fontName=FONT, fontSize=9.4, leading=12.2, textColor=palette["ink"], spaceAfter=4))
styles.add(ParagraphStyle("SmallX", fontName=FONT, fontSize=7.6, leading=9, textColor=palette["muted"]))
styles.add(ParagraphStyle("CellX", fontName=FONT, fontSize=7.8, leading=9.2, textColor=palette["ink"]))
styles.add(ParagraphStyle("HeadCellX", fontName=BOLD, fontSize=8, leading=9, textColor=colors.white))


def esc(text):
    return str(text).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def p(text, style="BodyX"):
    return Paragraph(esc(text), styles[style])


def bullet(text):
    return Paragraph("• " + esc(text), styles["BodyX"])


def table(rows, widths=None):
    data = []
    for r, row in enumerate(rows):
        data.append([Paragraph(esc(x), styles["HeadCellX" if r == 0 else "CellX"]) for x in row])
    t = Table(data, colWidths=widths, repeatRows=1)
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), palette["navy"]),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, palette["soft"]]),
                ("GRID", (0, 0), (-1, -1), 0.35, palette["line"]),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    return t


def cover(canvas, doc):
    w, h = A4
    canvas.saveState()
    canvas.setFillColor(palette["navy"])
    canvas.rect(0, 0, w, h, fill=1, stroke=0)
    canvas.setFillColor(palette["teal"])
    canvas.rect(0, 0, w, 2.1 * cm, fill=1, stroke=0)
    canvas.setFillColor(palette["gold"])
    canvas.circle(w - 2 * cm, h - 2 * cm, 2.5 * cm, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont(BOLD, 26)
    canvas.drawString(1.7 * cm, h - 5.2 * cm, "Cahier des charges MVP")
    canvas.setFont(BOLD, 18)
    canvas.drawString(1.7 * cm, h - 6.2 * cm, "BatiMemoire CI")
    canvas.setFont(FONT, 11)
    canvas.drawString(1.7 * cm, h - 7.2 * cm, "Carnet numerique du batiment - version initiale transformable en application")
    canvas.drawString(1.7 * cm, 1.1 * cm, "Document de cadrage produit | 19 mai 2026")
    canvas.restoreState()


def later(canvas, doc):
    w, h = A4
    canvas.saveState()
    canvas.setFillColor(palette["soft"])
    canvas.rect(0, h - 1.15 * cm, w, 1.15 * cm, fill=1, stroke=0)
    canvas.setFont(BOLD, 8)
    canvas.setFillColor(palette["navy"])
    canvas.drawString(1.35 * cm, h - 0.73 * cm, "BatiMemoire CI - Cahier des charges MVP")
    canvas.setFont(FONT, 8)
    canvas.setFillColor(palette["muted"])
    canvas.drawRightString(w - 1.35 * cm, 0.75 * cm, f"Page {doc.page}")
    canvas.restoreState()


story = [
    Spacer(1, 23 * cm),
    PageBreak(),
    p("1. Objectif du MVP", "H1X"),
    p("Le MVP doit permettre de creer un carnet numerique simple, clair et vendable pour un batiment. Il couvre les modules essentiels : batiments, zones, materiaux, equipements, documents et rappels."),
    p("Le but n'est pas de construire tout le produit final. Le but est de prouver la valeur commerciale, tester l'usage terrain et preparer une evolution vers une application complete."),
    table(
        [
            ["Objectif", "Resultat attendu"],
            ["Prouver le besoin", "Les entreprises comprennent rapidement la valeur du carnet numerique."],
            ["Centraliser les donnees", "Les informations techniques du batiment sont rangees par zone et categorie."],
            ["Anticiper la maintenance", "Les rappels mettent en avant les controles et reparations a venir."],
            ["Preparer le mobile", "L'interface responsive et PWA peut evoluer vers une app terrain."],
        ],
        [5.2 * cm, 10.8 * cm],
    ),
    p("2. Utilisateurs cibles", "H1X"),
    table(
        [
            ["Profil", "Besoin", "Droits MVP"],
            ["Administrateur", "Gerer l'espace entreprise et les batiments", "Tout voir et modifier"],
            ["Gestionnaire technique", "Suivre equipements, documents et rappels", "Creer, modifier, exporter"],
            ["Technicien terrain", "Ajouter donnees et interventions", "Creer et modifier les donnees terrain"],
            ["Direction", "Consulter indicateurs et rapports", "Lecture et exports"],
        ],
        [4.0 * cm, 7.0 * cm, 5.0 * cm],
    ),
    p("3. Perimetre fonctionnel", "H1X"),
    table(
        [
            ["Module", "Fonctions MVP", "Priorite"],
            ["Tableau de bord", "Statistiques, alertes, rappels proches, vue batiment active", "P0"],
            ["Batiments", "Creation, modification, statut, surface, gestionnaire, notes", "P0"],
            ["Zones", "Etage, piece, toiture, facade, local technique, niveau de risque", "P0"],
            ["Materiaux", "Categorie, reference, fournisseur, garantie, maintenance", "P0"],
            ["Equipements", "Type, marque, serie, responsable, prochaine maintenance", "P0"],
            ["Documents", "Plans, factures, garanties, fiches techniques, photos", "P0"],
            ["Rappels", "Echeance, priorite, responsable, statut, recurrence", "P0"],
            ["Export/import", "Sauvegarde JSON pour demonstration et migration future", "P1"],
        ],
        [3.2 * cm, 10.6 * cm, 2.2 * cm],
    ),
    PageBreak(),
    p("4. Parcours utilisateurs MVP", "H1X"),
    table(
        [
            ["Parcours", "Etapes", "Resultat"],
            ["Creer un batiment", "Ouvrir Batiments, ajouter, saisir nom/type/adresse/statut, enregistrer", "Le batiment devient disponible dans tous les modules"],
            ["Structurer un batiment", "Ajouter zones : toiture, etage, local technique, facade, appartement", "Les donnees peuvent etre localisees precisement"],
            ["Inventorier un materiau", "Choisir batiment et zone, saisir categorie, marque, reference, fournisseur, garantie", "La reference peut etre retrouvee pour maintenance ou remplacement"],
            ["Ajouter un equipement", "Choisir zone, saisir type, modele, serie, fournisseur, prochaine maintenance", "L'equipement entre dans le registre technique"],
            ["Classer un document", "Ajouter titre, type, date, fichier ou nom de fichier, statut", "Les plans, garanties et fiches techniques sont centralises"],
            ["Planifier un rappel", "Creer echeance, priorite, responsable, recurrence et statut", "La maintenance est visible dans le tableau de bord"],
            ["Exporter les donnees", "Cliquer Export", "Un fichier JSON permet sauvegarde, demonstration ou migration future"],
        ],
        [3.6 * cm, 8.0 * cm, 4.4 * cm],
    ),
    p("5. Champs obligatoires par module", "H1X"),
    table(
        [
            ["Module", "Champs minimum", "Champs utiles"],
            ["Batiments", "nom, type, ville/quartier, adresse, statut", "surface, niveaux, proprietaire, gestionnaire, date livraison, notes"],
            ["Zones", "batiment, nom, type, risque", "niveau, surface, notes"],
            ["Materiaux", "batiment, zone, categorie, nom", "marque, reference, fournisseur, quantite, pose, garantie, inspection"],
            ["Equipements", "batiment, zone, type, nom, statut", "marque, modele, serie, fournisseur, garantie, maintenance, responsable"],
            ["Documents", "batiment, type, titre", "zone, date, fichier, statut, notes"],
            ["Rappels", "batiment, titre, echeance, priorite, statut", "zone, type, recurrence, responsable, notes"],
        ],
        [3.0 * cm, 6.7 * cm, 6.3 * cm],
    ),
    PageBreak(),
    p("6. Regles metier", "H1X"),
    *[
        bullet(x)
        for x in [
            "Un materiau, un equipement, un document ou un rappel doit toujours etre rattache a un batiment.",
            "Une zone appartient a un seul batiment.",
            "Si un batiment est supprime dans la version demo, ses donnees rattachees sont supprimees aussi.",
            "Un rappel avec une date passee et un statut different de Fait doit etre considere comme en retard.",
            "Un rappel dans les 30 prochains jours doit remonter dans le tableau de bord.",
            "Une garantie proche ou expiree doit etre visible dans la liste des echeances a surveiller.",
            "Les donnees doivent rester disponibles apres rechargement de page.",
            "L'export JSON doit contenir toutes les collections du MVP.",
        ]
    ],
    p("7. Modele de donnees initial", "H1X"),
    table(
        [
            ["Objet", "Relations", "Role"],
            ["Entreprise", "contient plusieurs batiments", "Future entite pour comptes clients B2B"],
            ["Batiment", "contient zones, materiaux, equipements, documents, rappels", "Noyau du carnet numerique"],
            ["Zone", "appartient a un batiment", "Localisation technique"],
            ["Materiau", "appartient a un batiment et optionnellement a une zone", "Trace des produits de construction"],
            ["Equipement", "appartient a un batiment et optionnellement a une zone", "Registre des actifs techniques"],
            ["Document", "lie a un batiment, une zone ou un equipement futur", "Preuves et fichiers techniques"],
            ["Rappel", "lie a un batiment, zone, materiau ou equipement futur", "Maintenance et garanties"],
            ["Utilisateur", "appartient a une entreprise", "Roles et securite en version backend"],
        ],
        [3.2 * cm, 6.8 * cm, 6.0 * cm],
    ),
    PageBreak(),
    p("8. Interfaces attendues", "H1X"),
    table(
        [
            ["Ecran", "Contenu", "Actions"],
            ["Tableau de bord", "KPI, batiment actif, carte simplifiee, rappels prioritaires, garanties", "Filtrer, ajouter rappel, aller aux zones"],
            ["Liste module", "Tableau filtrable, resume, actions ligne", "Ajouter, modifier, supprimer, imprimer"],
            ["Formulaire", "Champs courts, listes de selection, date, fichier document", "Enregistrer, annuler"],
            ["Mobile", "Navigation horizontale, champs pleine largeur, tableaux scrollables", "Consulter et ajouter donnees terrain"],
            ["Export/import", "Fichier JSON", "Sauvegarder, restaurer, migrer"],
        ],
        [3.2 * cm, 7.0 * cm, 5.8 * cm],
    ),
    p("9. Exigences de qualite", "H1X"),
    *[
        bullet(x)
        for x in [
            "Interface lisible sur desktop, tablette et telephone.",
            "Aucun texte important ne doit deborder de son conteneur.",
            "Les formulaires doivent etre utilisables sans formation technique longue.",
            "Les actions dangereuses doivent demander confirmation dans la version demo.",
            "Le code doit rester simple pour etre remplace progressivement par un backend.",
            "Les donnees de demonstration doivent parler au marche ivoirien.",
            "Le produit doit etre vendable en demonstration, meme sans backend.",
        ]
    ],
    PageBreak(),
    p("10. Architecture cible apres prototype", "H1X"),
    table(
        [
            ["Couche", "MVP actuel", "Version commerciale"],
            ["Interface", "HTML/CSS/JS responsive", "React/Next.js ou equivalent"],
            ["Mobile", "PWA", "PWA avancee ou application via Capacitor/React Native"],
            ["Stockage", "LocalStorage", "PostgreSQL + stockage cloud fichiers"],
            ["Authentification", "Non incluse", "Comptes, roles, 2FA administrateurs"],
            ["Fichiers", "Nom de fichier seulement", "Upload securise, versioning, antivirus"],
            ["Notifications", "Visuel dans dashboard", "Email, SMS, WhatsApp Business"],
            ["Rapports", "Impression navigateur", "PDF generes cote serveur"],
            ["3D/BIM", "Hors MVP", "Integration Matterport, IFC viewer, scan 3D"],
        ],
        [3.2 * cm, 5.4 * cm, 7.4 * cm],
    ),
    p("11. Backlog de developpement", "H1X"),
    table(
        [
            ["Priorite", "Fonction", "Statut prototype"],
            ["P0", "Dashboard, batiments, zones, materiaux, equipements, documents, rappels", "Inclus"],
            ["P0", "Creation, modification, suppression", "Inclus"],
            ["P0", "Persistance locale", "Inclus"],
            ["P1", "Export/import JSON", "Inclus"],
            ["P1", "PWA installable", "Inclus"],
            ["P1", "QR code equipement", "A developper"],
            ["P1", "Rapport PDF automatique", "A developper"],
            ["P2", "Backend multi-utilisateurs", "A developper"],
            ["P2", "Upload fichiers cloud", "A developper"],
            ["P3", "BIM/3D et marketplace", "A developper"],
        ],
        [2.2 * cm, 9.8 * cm, 4.0 * cm],
    ),
    PageBreak(),
    p("12. Hors perimetre MVP", "H1X"),
    *[
        bullet(x)
        for x in [
            "Paiement en ligne.",
            "BIM complet et scan 3D interne.",
            "Marketplace fournisseurs.",
            "Application mobile native.",
            "Intelligence artificielle predictive.",
            "Workflow d'approbation complexe.",
            "Gestion avancee multi-agences.",
        ]
    ],
    p("13. Exigences UX/UI", "H1X"),
    *[
        bullet(x)
        for x in [
            "Interface professionnelle, dense et claire.",
            "Premier ecran dans l'application, pas une page marketing.",
            "Navigation visible vers les six modules MVP.",
            "Tableaux filtrables et formulaires courts.",
            "Responsive desktop, tablette et mobile.",
            "Design sobre adapte au B2B.",
        ]
    ],
    p("14. Exigences techniques", "H1X"),
    table(
        [
            ["Sujet", "Choix MVP", "Evolution"],
            ["Application", "Web responsive + PWA", "Mobile via Capacitor/React Native/Flutter"],
            ["Stockage", "LocalStorage pour demo", "Backend + PostgreSQL"],
            ["Fichiers", "Metadonnees de documents", "Upload cloud S3 compatible"],
            ["Securite", "Structure prete pour roles", "Auth, droits, audit logs"],
            ["Exports", "JSON", "PDF, Excel, API"],
        ],
        [3.4 * cm, 6.1 * cm, 6.5 * cm],
    ),
    p("15. Criteres d'acceptation", "H1X"),
    *[
        bullet(x)
        for x in [
            "Creer et modifier un batiment.",
            "Creer des zones rattachees au batiment.",
            "Ajouter materiaux, equipements, documents et rappels.",
            "Conserver les donnees apres rechargement.",
            "Mettre a jour le tableau de bord automatiquement.",
            "Afficher les rappels en retard ou proches.",
            "Exporter et importer les donnees JSON.",
            "Fonctionner sur ordinateur et mobile.",
        ]
    ],
    p("16. Feuille de route apres MVP", "H1X"),
    table(
        [
            ["Phase", "Fonctions"],
            ["Phase 2", "Backend, comptes utilisateurs, upload fichiers, QR codes, notifications email."],
            ["Phase 3", "Photos 360, Matterport, rapports PDF, planning intervention, marketplace."],
            ["Phase 4", "BIM/IFC, jumeau numerique, scan 3D, IA maintenance, module assurance/banque."],
        ],
        [3.2 * cm, 12.8 * cm],
    ),
]

doc = SimpleDocTemplate(
    str(OUT),
    pagesize=A4,
    leftMargin=1.35 * cm,
    rightMargin=1.35 * cm,
    topMargin=1.55 * cm,
    bottomMargin=1.25 * cm,
    title="Cahier des charges MVP - BatiMemoire CI",
)
doc.build(story, onFirstPage=cover, onLaterPages=later)
print(OUT)
