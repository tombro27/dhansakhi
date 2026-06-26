#!/usr/bin/env python3
"""Fill the IDBI Innovate PPT template with DhanSakhi content (editable source).
The polished submission is the PDF; this keeps an editable template-based deck."""
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor

ROOT = "/home/imart/indiamart/hackathons/IDBI_Innovate_26"
TEMPLATE = os.path.join(ROOT, "deck", "Prototype Submission Deck _ IDBI Innovate.pptx")
OUT = os.path.join(ROOT, "deck", "DhanSakhi_IDBI_Innovate_Deck.pptx")
SHOTS = os.path.join(ROOT, "deck", "screenshots")

NAVY = RGBColor(0x0A, 0x25, 0x40)
INK = RGBColor(0x2B, 0x3A, 0x4D)
TEAL = RGBColor(0x00, 0x93, 0x6B)

prs = Presentation(TEMPLATE)
SW, SH = prs.slide_width, prs.slide_height


def add_text(slide, lines, top=1.45, left=0.55, width=9.0, height=3.7, size=13, color=INK, bold_first=False):
    tb = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = tb.text_frame
    tf.word_wrap = True
    for i, line in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        bullet = line.startswith("• ")
        runs = line[2:] if bullet else line
        r = p.add_run()
        r.text = ("•  " + runs) if bullet else runs
        r.font.size = Pt(size)
        r.font.color.rgb = color
        if bold_first and i == 0:
            r.font.bold = True
            r.font.size = Pt(size + 2)
            r.font.color.rgb = NAVY
        p.space_after = Pt(6)
    return tb


def add_img(slide, path, left, top, width):
    if os.path.exists(path):
        slide.shapes.add_picture(path, Inches(left), Inches(top), width=Inches(width))


s = prs.slides

# 1 Team details
add_text(s[0], [
    "Product: DhanSakhi — an AI Robo-Advisor for IDBI Bank",
    "",
    "Team name:  Team DhanSakhi",
    "Team leader name:  Prakhar Singh Tomar",
    "Members:  [Member 2], [Member 3], [Member 4]",
    "Problem Statement:  Digital Wealth Management",
], top=1.5, size=15, color=NAVY)

# 2 Brief about the idea
add_text(s[1], [
    "DhanSakhi gives every IDBI customer a personal robo-advisor.",
    "• One-tap RBI Account Aggregator consent pulls ALL their holdings (bank, MF, demat, EPF, NPS, insurance).",
    "• AI builds goal-based plans and an explainable, suitability-aware portfolio.",
    "• Every recommendation carries a plain-language 'why' — no black boxes.",
    "• A vernacular conversational advisor (Google Gemini) answers anything, in 6 languages.",
    "• Goals map to real IDBI + LIC products (FD, MF, NPS via IDBI POP, LIC insurance/annuity).",
    "",
    "Why now: AA covers 2.61B accounts / 252.9M users (Dec 2025); IDBI already owns the distribution shelf and LIC (~49% owner). Advice today is HNI-only — DhanSakhi democratises it.",
])

# 3 Opportunities
add_text(s[2], [
    "How is it different?",
    "• AA-native aggregation (no CAS/PDF imports that INDmoney & HDFC SmartWealth still need).",
    "• Explainable AI rationale vs black-box curation or rule-based recommendations.",
    "• Vernacular advisor in 6 languages — depth almost no competitor offers.",
    "",
    "How does it solve the problem?",
    "• One 360° view; AI risk-profile → target allocation → rebalancing with reasons; goal plans funded by the right IDBI/LIC product.",
    "",
    "USP: 'Trust of a bank + intelligence of a super-app' — the intersection no standalone app or bank tool owns.",
])

# 4 Features
add_text(s[3], [
    "• KYC-lite onboarding (DigiLocker/Aadhaar-style, paperless)",
    "• RBI Account Aggregator consent artefact (purpose, scope, expiry, one-tap revoke)",
    "• 360° net-worth dashboard (bank + FD + MF + demat + EPF + NPS + LIC)",
    "• AI risk profiling → Conservative / Moderate / Aggressive, explained",
    "• Goal-based planning (retirement, education, home, emergency) with SIP-to-goal math",
    "• Explainable portfolio advice + rebalancing ('why this, why now')",
    "• Vernacular conversational advisor (Gemini, 6 languages, suitability-aware)",
    "• IDBI + LIC cross-sell engine (next-best-product mapped to goal gaps)",
    "• Trust & compliance layer (SEBI guardrails, DPDP consent, no-PII)",
    "• Cross-sell ROI model (benchmark-anchored revenue projection for IDBI)",
], top=1.4, size=12.5)

# 5 Process flow
add_text(s[4], [
    "Golden path (end-to-end):",
    "1) KYC-lite onboarding  →  2) AA consent & 360° aggregation  →  3) AI risk profile  →",
    "4) Goal-based plan  →  5) Explainable advice & rebalance  →  6) Vernacular advisor chat  →  7) IDBI/LIC cross-sell",
    "",
    "Actors: Customer · DhanSakhi AI · RBI Account Aggregator (FIP→FIU) · IDBI core & product catalog · LIC · SEBI-RIA (human-in-loop).",
    "Trigger: customer opens DhanSakhi inside IDBI net-banking and grants one consent to see and plan their whole financial life.",
    "Outcome: a funded, explainable plan + the single best next product + an advisor they can ask anything, in their language.",
])

# 6 Wireframes / mock
add_text(s[5], ["Hero flow — RBI AA consent artefact (left) and AI risk-profiling (right):"], top=1.25, size=12, color=NAVY)
add_img(s[5], os.path.join(SHOTS, "02-onboarding-consent.png"), 0.45, 1.75, 4.45)
add_img(s[5], os.path.join(SHOTS, "09-onboarding-risk.png"), 5.15, 1.75, 4.45)

# 7 Architecture
add_text(s[6], [
    "Customer (web/mobile, in IDBI net-banking)",
    "      ▼ HTTPS",
    "Next.js 16 App Router on Vercel — Onboarding · Dashboard · Goals · Explainable Advice · Advisor · Cross-sell (React 19 + Tailwind + Recharts)",
    "      ▼ server route handlers",
    "AA Connector (simulated FIP→FIU consent)  |  Recommendation Engine (deterministic TS)  |  Gemini API (advisor + explainability, no-key fallback)  |  IDBI + LIC Catalog",
    "      ▼",
    "Synthetic data store (no real PII).  POC path → IDBI core banking + live AA FIU + SEBI-RIA review workflow.",
])

# 8 Technologies
add_text(s[7], [
    "Frontend:  Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Recharts",
    "AI & logic:  Google Gemini (2.5 Flash) via Google Gen AI SDK; deterministic TS engine (risk, goals, rebalancing); explainability layer",
    "Integrations & infra:  RBI Account Aggregator (FIU), IDBI core + LIC/NPS catalog, DigiLocker/Aadhaar KYC, Vercel",
    "Compliance:  SEBI IA guardrails, DPDP Act 2023, synthetic/no-PII, Bhashini-ready vernacular",
])

# 9 Implementation cost
add_text(s[8], [
    "Prototype (done): this app — ≈ ₹0 (open-source + free tiers)",
    "Pilot / Sandbox (3–4 months): live AA FIU, IDBI core + LIC APIs, RIA workflow, security review — ₹35–55 L",
    "Production (6–9 months): scale infra, vernacular (Bhashini), DPO/DPIA, mobile app — ₹1.2–1.8 Cr",
    "Run-rate: cloud + Gemini API + AA consent fees + support — ₹20–40 / active user / year",
    "",
    "Mostly variable, usage-based costs; AA + Gemini (free tier available) + Vercel keep fixed costs low. Payback driven by cross-sell uplift.",
])

# 10 Snapshots
add_text(s[9], ["A working, deployed product — not mockups:"], top=1.2, size=12, color=NAVY)
grid = [
    "03-dashboard.png", "04-advice.png", "05-advisor.png",
    "06-goals.png", "07-cross-sell.png", "08-compliance.png",
]
for idx, name in enumerate(grid):
    col, row = idx % 3, idx // 3
    add_img(s[9], os.path.join(SHOTS, name), 0.45 + col * 3.15, 1.7 + row * 1.95, 3.0)

# 11 Performance / benchmarking
add_text(s[10], [
    "Prototype metrics:",
    "• 360° aggregation (6–8 institutions, simulated): < 2 s",
    "• Explainability coverage of recommendations: 100%",
    "• Advisor reply latency: ~1–3 s (Gemini) / < 50 ms (fallback)",
    "• Languages supported: 6   •   Uptime without API key (graceful fallback): 100%",
    "",
    "Projected impact (industry benchmarks, labelled as projections):",
    "• Cross-sell conversion lift ~6× (2% → ~12%)   •   Revenue uplift 25–40%",
    "• Illustrative incremental revenue ₹4.8 Cr / campaign   •   Payback < 18 months",
    "• Vernacular PoC (literature): +41% task completion, +86% session length vs English-only",
], top=1.35, size=12.5)

# 12 Future development
add_text(s[11], [
    "Near term: live AA FIU integration; IDBI core + LIC/NPS APIs; SEBI-RIA review workflow; mobile app + WhatsApp advisor.",
    "Mid term: Bhashini voice in 22 languages; auto-rebalance & SIP execution (EOP); tax-harvesting & family dashboard; proactive nudges.",
    "Long term: predictive churn & life-event triggers; RM co-pilot (B2B2C); open-finance marketplace; financial inclusion at PMJDY scale.",
    "",
    "Winners may access IDBI's sandbox & POC environment — DhanSakhi is architected to drop onto IDBI's existing rails with low integration lift.",
])

# 13 Links
add_text(s[12], [
    "GitHub Public Repository:   github.com/tombro27/dhansakhi",
    "",
    "Final Product Link (live):   https://idbi-innovate-26.vercel.app",
    "",
    "Demo Video Link (3 minutes):   https://drive.google.com/file/d/1-ZobKRuBWrzYHAqD9f_Xko-KFBlIHDsC/view",
    "",
    "→ All submission links are live: GitHub repository, deployment, and demo video.",
], top=1.6, size=14, color=NAVY)

# 14 (closing) if exists
if len(s) > 13:
    add_text(s[13], [
        "Thank you.",
        "DhanSakhi — trust of a bank, intelligence of a super-app.",
        "Built to de-risk adoption for IDBI, deliver measurable cross-sell ROI, and bring explainable, vernacular wealth advice to every Indian.",
    ], top=1.8, size=16, color=NAVY)

prs.save(OUT)
print("Saved", OUT, "with", len(s), "slides")
