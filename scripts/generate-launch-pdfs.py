#!/usr/bin/env python3
"""Generate the checklist-only lead magnet and the four quiz worksheets."""
from pathlib import Path
import os
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak,
    KeepTogether, HRFlowable
)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "free-bucket"
PRIVATE_OUT = Path(os.environ.get("CURLS_PRIVATE_OUT", "/tmp/curls-deliverables"))
FONT_ROOT = Path("/usr/share/fonts/truetype/dejavu")
font_sources = {
    "CCSans": "DejaVuSans.ttf",
    "CCSansBold": "DejaVuSans-Bold.ttf",
    "CCSerif": "DejaVuSerif.ttf",
    "CCSerifItalic": "DejaVuSerif-Bold.ttf",
    "CCMono": "DejaVuSansMono.ttf",
    "CCMonoItalic": "DejaVuSansMono-Oblique.ttf",
}
for alias, source in font_sources.items():
    pdfmetrics.registerFont(TTFont(alias, str(FONT_ROOT / source)))

OBSIDIAN = colors.HexColor("#111111")
TEAL = colors.HexColor("#006666")
JADE = colors.HexColor("#00806F")
GOLD = colors.HexColor("#B08D57")
PAPER = colors.HexColor("#F6F1E7")
INK = colors.HexColor("#252525")
MUTED = colors.HexColor("#5F625F")
LINE = colors.HexColor("#C9D7D1")

styles = getSampleStyleSheet()
KICKER = ParagraphStyle("Kicker", parent=styles["Normal"], fontName="CCSansBold", fontSize=7.5, leading=10, textColor=GOLD, tracking=1.6, spaceAfter=5)
TITLE = ParagraphStyle("Title", parent=styles["Title"], fontName="CCSerif", fontSize=24, leading=28, textColor=TEAL, alignment=TA_LEFT, spaceAfter=8)
LEDE = ParagraphStyle("Lede", parent=styles["Normal"], fontName="CCSerifItalic", fontSize=11, leading=16, textColor=MUTED, spaceAfter=14)
H2 = ParagraphStyle("H2", parent=styles["Heading2"], fontName="CCSansBold", fontSize=10, leading=13, textColor=TEAL, spaceBefore=10, spaceAfter=7, keepWithNext=True)
BODY = ParagraphStyle("Body", parent=styles["BodyText"], fontName="CCSerif", fontSize=9.4, leading=14.5, textColor=INK, spaceAfter=7)
SMALL = ParagraphStyle("Small", parent=styles["BodyText"], fontName="CCSans", fontSize=7.2, leading=10.5, textColor=MUTED)
CALLOUT = ParagraphStyle("Callout", parent=BODY, fontName="CCSerifItalic", textColor=TEAL, borderColor=GOLD, borderWidth=0, borderPadding=10, backColor=colors.HexColor("#E8F1ED"), spaceBefore=8, spaceAfter=10)

def page_frame(canvas, doc):
    width, height = letter
    canvas.saveState()
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, width, height, stroke=0, fill=1)
    canvas.setFillColor(colors.HexColor("#E8EFEA"))
    canvas.circle(width - 0.38 * inch, height - 0.35 * inch, 0.62 * inch, stroke=0, fill=1)
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(1.2)
    canvas.line(0.65 * inch, 0.49 * inch, width - 0.65 * inch, 0.49 * inch)
    canvas.setFont("CCMono", 6.8)
    canvas.setFillColor(MUTED)
    canvas.drawString(0.65 * inch, 0.31 * inch, "CURLS & CONTEMPLATION · MICHAEL DAVID")
    canvas.drawRightString(width - 0.65 * inch, 0.31 * inch, f"{doc.page}")
    canvas.restoreState()

def header(kicker, title, lede):
    return [Paragraph(kicker.upper(), KICKER), Paragraph(title, TITLE), Paragraph(lede, LEDE), HRFlowable(width="100%", thickness=2.2, color=TEAL, spaceAfter=9)]

def section(title, body=None):
    items = [Paragraph(title.upper(), H2)]
    if body:
        items.append(Paragraph(body, BODY))
    return items

def blank_lines(count=3):
    rows = [[""] for _ in range(count)]
    table = Table(rows, colWidths=[6.75 * inch], rowHeights=[0.31 * inch] * count)
    table.setStyle(TableStyle([("LINEBELOW", (0, 0), (-1, -1), 0.45, LINE), ("BACKGROUND", (0, 0), (-1, -1), PAPER)]))
    return table

def checks(items):
    data = [["□", Paragraph(item, BODY)] for item in items]
    table = Table(data, colWidths=[0.25 * inch, 6.42 * inch], hAlign="LEFT")
    table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("FONTNAME", (0, 0), (0, -1), "CCSansBold"), ("FONTSIZE", (0, 0), (0, -1), 12), ("TEXTCOLOR", (0, 0), (0, -1), TEAL), ("BOTTOMPADDING", (0, 0), (-1, -1), 4)]))
    return table

def data_table(headers, rows, widths):
    data = [[Paragraph(h, SMALL) for h in headers]] + [[Paragraph(c, BODY) if c else "" for c in row] for row in rows]
    table = Table(data, colWidths=widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), TEAL), ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.5, LINE), ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#EEF4F1")]),
        ("TOPPADDING", (0, 1), (-1, -1), 9), ("BOTTOMPADDING", (0, 1), (-1, -1), 9),
        ("LEFTPADDING", (0, 0), (-1, -1), 6), ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]))
    return table

def build(path, title, story):
    path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(path), pagesize=letter, rightMargin=0.68 * inch, leftMargin=0.68 * inch, topMargin=0.58 * inch, bottomMargin=0.68 * inch, title=title, author="Michael David")
    doc.build(story, onFirstPage=page_frame, onLaterPages=page_frame)

def checklist_story():
    s = header("Free companion", "The Pricing Confidence Checklist", "A two-page decision tool for quoting from evidence, communicating clearly, and protecting sustainable boundaries.")
    s += section("1 · Know the real cost", "Pricing begins with financial visibility. Include both direct expenses and the indirect costs required to keep the practice running.")
    s.append(checks([
        "I know my monthly direct costs: product, tools, travel, workspace, assistants, and transaction fees.",
        "I know my indirect costs: insurance, software, education, marketing, taxes, recovery time, and the salary I intend to pay myself.",
        "I know how many paid hours I can realistically deliver without using every available hour.",
        "I review these numbers regularly instead of treating pricing as permanent."
    ]))
    s += section("Rate-floor calculation")
    s.append(data_table(["Monthly business cost", "Realistic paid hours", "Hourly rate floor"], [["$", "hours", "$"]], [2.25*inch, 2.25*inch, 2.25*inch]))
    s.append(Paragraph("Your rate floor is not the final price. It is the point below which a booking asks the rest of your business to subsidize it.", CALLOUT))
    s += section("Notes from the calculation")
    s.append(blank_lines(4))
    s.append(PageBreak())
    s += header("Pricing confidence", "Say the Number. Hold the Standard.", "Confidence becomes more reliable when the language, policy, and follow-through are already decided.")
    s += section("2 · Communicate clearly")
    s.append(checks([
        "My quote names the scope, price, deposit, due dates, and what would change the total.",
        "I can state the number without apologizing, shrinking, or filling the silence.",
        "My cancellation, rescheduling, overtime, travel, and add-on policies are written before the booking.",
        "Existing clients receive clear notice of a change; the notice is not framed as a negotiation."
    ]))
    s += section("Write your clean quote sentence")
    s.append(blank_lines(3))
    s += section("3 · Hold the boundary")
    s.append(checks([
        "I have a kind, short response for a request to discount the work.",
        "I can offer a smaller scope when the budget is smaller without discounting the same scope.",
        "I record who accepts the quote so evidence can answer fear.",
        "I will review this checklist after 30 days with real booking data."
    ]))
    s.append(Paragraph("Continue in <i>Curls &amp; Contemplation</i>: the book expands pricing into cost analysis, market positioning, diversified income, cash-flow visibility, boundaries, and long-term financial wisdom.", CALLOUT))
    s.append(Paragraph("Educational tool only; not financial, tax, or legal advice. curlscontemplation.beauty", SMALL))
    return s

WORKSHEETS = [
    ("underpriced-artist", "The Underpriced Artist", "Pricing clarity", "Your expertise has grown. Your pricing has not caught up. Use evidence and arithmetic to close the gap.", [
        ("Cost inventory", ["Product, tools, kit, travel, and workspace", "Insurance, licenses, education, software, and fees", "Taxes, recovery time, and the salary you intend to pay yourself"]),
        ("Rate-floor calculation", ["Total monthly cost: $", "Realistic paid hours per month:", "Hourly rate floor: $"]),
        ("Clean quote language", ["Write the exact scope and price sentence you will use.", "Write a smaller-scope option that protects the rate."]),
        ("30-day evidence plan", ["Correct one underpriced offer.", "Give clear notice where needed.", "Track every yes, no, and scope change.", "Review the numbers in 30 days."])
    ]),
    ("invisible-talent", "The Invisible Talent", "Intentional visibility", "The work is strong. The right audience does not know it yet. Build discoverability without turning your practice into performance.", [
        ("Visibility audit", ["Portfolio or website", "Social channels", "Search or booking profile", "Referrals and collaborators"]),
        ("Proof inventory", ["List five recent outcomes that show the work you want more of.", "Name the best channel and context for each one."]),
        ("Three rooms", ["Name three productions, associations, classes, communities, or collaborations where aligned opportunities gather.", "Add one concrete step into each room."]),
        ("Introduction script", ["I am...", "The work I want to be known for is...", "The specific proof I would like to show you is...", "My clear next ask is..."])
    ]),
    ("burned-out-booked", "The Burned-Out Booked", "Sustainable rhythm", "A full calendar that empties you is not a sustainable system. Compare income, energy, recovery, and boundaries honestly.", [
        ("Energy and income ledger", ["List five services, client types, or projects.", "Score energy cost from 1–10.", "Mark each: keep, reprice, redesign, or release."]),
        ("Calendar redesign", ["Protect one recurring recovery block.", "Cluster similar work to reduce context switching.", "Set a clear last-booking or wrap time.", "Price the most draining work honestly."]),
        ("Boundary language", ["Write two sentences for late add-ons, day-off requests, unpaid revisions, or a rushed timeline."]),
        ("Recovery plan", ["Name three practices that reliably restore you.", "Put each one on an actual date this week."])
    ]),
    ("almost-ceo", "The Almost-CEO", "Leadership systems", "Leadership begins before the title. Turn instinct into standards, decisions, and repeatable practices.", [
        ("Codify your standards", ["List four practices that make the work recognizably yours.", "Describe what a collaborator must understand to represent them well."]),
        ("Only I can do", ["List recurring tasks.", "Mark what requires your judgment.", "Assign, automate, template, or stop the rest."]),
        ("Weekly leadership block", ["Choose one protected hour for pricing, pipeline, positioning, systems, and reflection.", "Write the first three agenda items."]),
        ("The next room", ["Name the next leadership context.", "Identify one path or person to study.", "Write your three-sentence vision.", "Date the first delegated task."])
    ]),
]

WORKBOOK_PAGES = [
    ("Welcome", "This workbook is for the ideas that keep returning.", ["What are you ready to move from reflection into action?", "What would honest clarity make possible?", "How will you choose honesty over performance while you work?"]),
    ("Idea Dump", "Empty the reservoir before you organize it.", ["Write every idea, concept, question, unfinished thought, desire, problem, project, message, or possibility circling in your mind.", "Star anything that feels alive, useful, emotionally charged, or difficult to ignore."]),
    ("Recurring Ideas", "Notice what returns after you dismiss it.", ["List the ideas that keep returning.", "Why do you think each one keeps returning?"]),
    ("Idea Inventory", "Describe 3–5 ideas before choosing.", ["Idea and possible first form", "Why it matters", "Who it could help", "What excites you", "What concerns you", "Which idea carries both excitement and meaning?"]),
    ("Idea Scorecard", "Rate your top three ideas from 1–10.", ["Energy: how alive it makes you feel", "Alignment: fit with your values and season", "Usefulness: a real problem or desire", "Readiness: could begin within 30 days", "Long-term potential", "Emotional resistance", "Which idea has the strongest total? Which matters most now?"]),
    ("Idea Filter", "Choose the idea that fits your life, not only your excitement.", ["Which idea fits this season?", "Which are you emotionally ready to serve?", "Which solves a real problem?", "Which keeps returning for a reason?", "Which are you avoiding because it matters?"]),
    ("Choose the Idea", "Choose one focus for this workbook.", ["The idea I am choosing is...", "I am choosing it now because...", "I am not choosing the others right now because...", "What does delay cost you?", "For this season, this is the idea I am willing to honor."]),
    ("Idea Expansion Map", "Expand the idea you chose.", ["What is the core concept?", "Who is this for?", "What problem, need, desire, or tension does it address?", "Why does it matter to you personally?", "What could it become?", "What is the simplest first version?"]),
    ("Ten Possible Forms", "Let the idea take more than one shape.", ["List ten ways the idea could exist.", "Which version surprises you?", "Which feels most alive?", "Which is the smartest first version?"]),
    ("Why This Idea Matters", "Answer with honesty, not performance.", ["Why this idea?", "Why now?", "Why you?", "What would be lost if you kept ignoring it?", "What becomes possible if you follow through?", "What makes you more ready than you admit?"]),
    ("One-Sentence Positioning", "Make the idea useful and communicable.", ["My idea is a...", "For...", "That helps them...", "By giving them...", "This idea is a ____ for ____ who need ____."]),
    ("What Am I Afraid Of, Really?", "Name the real story beneath resistance.", ["What are you afraid will happen if you are seen?", "What if the work succeeds?", "What if it is misunderstood?", "If you fully pursued this idea, I am afraid that...", "What is this fear trying to protect you from?"]),
    ("Fear vs. Fact", "Fear speaks in absolutes. Truth speaks in specifics.", ["Fear says...", "What I actually know is...", "The evidence available to me is...", "The next safe, honest experiment is..."]),
    ("Creative Risk Audit", "Separate real risk from imagined risk.", ["What is the real risk?", "What is the imagined risk?", "What is the cost of doing nothing for six months?", "Worst-case scenario", "Best-case scenario", "Most-likely scenario", "Which scenario have you treated as guaranteed?"]),
    ("If I Trusted Myself", "Answer as if self-doubt were not deciding.", ["What would I do next?", "What would I stop delaying?", "What would I no longer ask permission for?", "What decision becomes obvious when fear is quiet?"]),
    ("Rewrite the Story", "Replace a limiting narrative with a grounded one.", ["The old story", "The new story", "What have I survived?", "What have I created?", "What proves I can learn while moving?"]),
    ("Self-Authorization", "Move from reflection to internal permission.", ["I give myself permission to begin before I feel ready.", "I give myself permission to create imperfectly at first.", "I give myself permission to take this idea seriously.", "I give myself permission to become visible through my work.", "I give myself permission to..."]),
    ("30-Day Action Path", "Focus on one honest outcome.", ["My 30-day goal", "What I want to have by day 30", "Three milestones", "What may interrupt me", "What I will do when resistance shows up", "Who will provide accountability?"]),
    ("Tiny Next Steps", "Break the idea into actions small enough to begin.", ["My 10-minute step", "My one-hour step", "My one-day step", "The first thing I will do after this workbook", "What does good enough to begin look like?", "What am I no longer waiting for?", "The date I will begin"]),
    ("Creative Commitment", "Close with identity and action.", ["The idea I am choosing to honor", "The fear I am no longer letting lead", "My next real step", "The version of me I am becoming", "The date I will return to this commitment", "I do not need to feel fully ready to begin. I need only to begin honestly."]),
]

def workbook_story():
    story = header("Exclusive buyer companion · 21 pages", "The Idea-to-Action Workbook", "A guided companion for choosing your strongest idea, working through fear, and building your next move.")
    story.append(Spacer(1, 0.45 * inch))
    story.append(Paragraph("MICHAEL DAVID", ParagraphStyle("Author", parent=KICKER, alignment=TA_CENTER, fontSize=10)))
    story.append(Spacer(1, 0.35 * inch))
    story.append(Paragraph("Use this workbook digitally or print it for handwritten reflection. Move through it in one sitting or across several sessions. Write honestly. Clarity matters more than perfection.", ParagraphStyle("CoverBody", parent=BODY, alignment=TA_CENTER, fontSize=12, leading=19)))
    story.append(Spacer(1, 1.1 * inch))
    story.append(Paragraph("CURLS &amp; CONTEMPLATION", ParagraphStyle("CoverBrand", parent=KICKER, alignment=TA_CENTER, fontSize=9)))
    for page_num, (title, subtitle, prompts) in enumerate(WORKBOOK_PAGES, start=2):
        story.append(PageBreak())
        story += header(f"Idea-to-Action · {page_num} of 21", title, subtitle)
        for prompt in prompts:
            story.append(KeepTogether([Paragraph(prompt, H2), blank_lines(2 if len(prompts) > 5 else 3)]))
        if page_num == 2:
            story.append(Paragraph("Move in order for the strongest result. Do not edit yourself too early. When a page feels uncomfortable, stay with it a little longer.", CALLOUT))
        if page_num == 21:
            story.append(Paragraph("Return to this page when fear gets loud and clarity gets quiet.", CALLOUT))
    return story

def worksheet_story(name, focus, lede, sections):
    s = header("Blind-spot quiz · focused worksheet", name, lede)
    for index, (title, prompts) in enumerate(sections[:2], start=1):
        s += section(f"{index} · {title}")
        s.append(checks(prompts))
        s.append(blank_lines(3 if index == 2 else 2))
    s.append(Paragraph(f"Today’s focus: <b>{focus}</b>. The goal is a usable decision, not a perfect page.", CALLOUT))
    s.append(PageBreak())
    s += header(focus, "Turn the Diagnosis into a 30-Day Practice", "Choose a small standard you can repeat, observe, and revise with real evidence.")
    for index, (title, prompts) in enumerate(sections[2:], start=3):
        s += section(f"{index} · {title}")
        s.append(checks(prompts))
        s.append(blank_lines(3))
    s += section("One commitment")
    s.append(Paragraph("In the next 24 hours, I will:", BODY))
    s.append(blank_lines(2))
    s.append(Paragraph("Continue in <i>Curls &amp; Contemplation</i>: use the interactive audits, quizzes, prompts, financial exercises, and reflection practices to connect this focus to the rest of your career.", CALLOUT))
    s.append(Paragraph("Educational and reflective tool only. curlscontemplation.beauty", SMALL))
    return s

def main():
    build(OUT / "checklists" / "Pricing-Confidence-Checklist.pdf", "Pricing Confidence Checklist", checklist_story())
    for slug, name, focus, lede, sections in WORKSHEETS:
        build(OUT / "quiz" / f"worksheet-{slug}.pdf", f"{name} Worksheet", worksheet_story(name, focus, lede, sections))
    workbook_path = PRIVATE_OUT / "workbook" / "Idea-to-Action-Workbook.pdf"
    build(workbook_path, "The Idea-to-Action Workbook", workbook_story())
    for path in [OUT / "checklists" / "Pricing-Confidence-Checklist.pdf", *sorted((OUT / "quiz").glob("worksheet-*.pdf"))]:
        print(f"{path.relative_to(ROOT)}\t{path.stat().st_size} bytes")
    print(f"{workbook_path}\t{workbook_path.stat().st_size} bytes")

if __name__ == "__main__":
    main()
