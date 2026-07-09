"use client";

import { useState, useRef, useEffect, type Dispatch, type SetStateAction } from "react";

/**
 * The Idea-to-Action Workbook - 21-page interactive buyer companion.
 * Content verbatim from Michael's approved workbook. On-site interactive
 * edition: autosaves locally, printable, gated to verified buyers by
 * app/workbook/page.tsx (server-side entitlement check).
 * Palette: book-funnel system (teal #008080 / gold #D4AF37 / ink #1a1a1a).
 */

const STORAGE_KEY = "cc-idea-workbook-v1";

type WorkbookData = Record<string, string | boolean>;
type SetData = Dispatch<SetStateAction<WorkbookData>>;

interface FieldProps { label: string; id: string; data: WorkbookData; setData: SetData; tall?: boolean; mid?: boolean }

function Field({ label, id, data, setData, tall, mid }: FieldProps) {
  return (
    <div className="flex flex-col flex-1 min-w-0">
      <label htmlFor={`wb-${id}`} className="text-xs font-bold tracking-wider mb-1.5" style={{color:"#00695f",letterSpacing:"0.06em"}}>{label}</label>
      <textarea
        id={`wb-${id}`}
        className="w-full rounded-md border px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 transition-all"
        style={{background:"#f7f4ed",borderColor:"#d0d0d0",borderBottom:"2px solid #D4AF37",color:"#1a1a1a",minHeight: tall ? 180 : mid ? 120 : 80}}
        value={String(data[id] ?? "")}
        onChange={e => setData(d => ({...d,[id]:e.target.value}))}
        placeholder="Write here..."
      />
    </div>
  );
}

interface CheckboxProps { label: string; id: string; data: WorkbookData; setData: SetData }

function Checkbox({ label, id, data, setData }: CheckboxProps) {
  const checked = !!(data[id]);
  return (
    <button type="button" onClick={() => setData(d => ({...d,[id]:!d[id]}))}
      className="flex items-start gap-3 text-left py-1.5 group w-full"
      aria-pressed={checked}>
      <span className="mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all"
        style={{borderColor: checked ? "#008080" : "#d0d0d0", background: checked ? "#008080" : "transparent"}}>
        {checked && <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" fill="none"/></svg>}
      </span>
      <span className="text-sm" style={{color:"#2d2d2d"}}>{label}</span>
    </button>
  );
}


const PAGE_TITLES = [
  "Cover","Welcome","Idea Dump","Recurring Ideas","Idea Inventory","Idea Scorecard",
  "Idea Filter","Choose the Idea","Expansion Map","Ten Possible Forms","Why This Idea Matters",
  "One-Sentence Positioning","What Am I Afraid Of?","Fear vs. Fact","Creative Risk Audit",
  "If I Trusted Myself","Rewrite the Story","Self-Authorization","30-Day Action Path",
  "Tiny Next Steps","Creative Commitment"
];

function PageShell({ children, title, subtitle, pageNum }: { children: React.ReactNode; title: string; subtitle?: string; pageNum: number }) {
  return (
    <div className="w-full max-w-2xl mx-auto px-1">
      <div className="h-0.5 w-full mb-6" style={{background:"linear-gradient(90deg,#008080,#D4AF37)"}}/>
      <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-1" style={{fontFamily:"'Georgia',serif",color:"#00695f"}}>{title}</h2>
      {subtitle && <p className="text-sm mb-5" style={{color:"#2d2d2d"}}>{subtitle}</p>}
      <div className="space-y-5">{children}</div>
      <div className="text-center mt-8"><span className="text-xs" style={{color:"#888"}}>{pageNum} of 21</span></div>
    </div>
  );
}

function InstructionBox({ children }: { children: React.ReactNode }) {
  return <div className="rounded-md px-4 py-3 text-sm italic border-l-4" style={{background:"#e0f2f1",borderColor:"#008080",color:"#00695f"}}>{children}</div>;
}

function CompleteSentence({ text }: { text: string }) {
  return (
    <div className="mt-4 pt-3 border-t" style={{borderColor:"#D4AF37"}}>
      <span className="text-xs font-bold tracking-wider" style={{color:"#D4AF37"}}>COMPLETE THIS SENTENCE</span>
      <p className="mt-2 text-base italic" style={{fontFamily:"'Georgia',serif",color:"#00695f"}}>{text}</p>
    </div>
  );
}

function BottomQuote({ text }: { text: string }) {
  return <p className="text-center text-xs italic mt-6 pt-4 border-t" style={{color:"#888",borderColor:"#e0e0e0"}}>{text}</p>;
}

export function IdeaToActionWorkbook() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState<WorkbookData>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const topRef = useRef<HTMLDivElement | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Autosave: answers persist per-device so a refresh never destroys the work.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw) as WorkbookData);
    } catch { /* storage unavailable - still usable for the session */ }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* no-op */ }
  }, [data, hydrated]);

  const go = (p: number) => { setPage(p); setMenuOpen(false); topRef.current?.scrollIntoView({behavior:"smooth"}); };
  const next = () => go(Math.min(page+1, 20));
  const prev = () => go(Math.max(page-1, 0));

  const renderPage = () => {
    const p = page;

    if (p === 0) return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="w-full max-w-lg">
          <div className="h-1 w-full mb-8" style={{background:"#D4AF37"}}/>
          <p className="text-xs font-bold tracking-widest mb-4" style={{color:"#D4AF37"}}>EXCLUSIVE BUYER COMPANION · 21 PAGES</p>
          <p className="text-sm tracking-wider mb-6" style={{color:"#C7D9D2"}}>MICHAEL DAVID WARREN</p>
          <div className="w-16 h-0.5 mx-auto mb-6" style={{background:"#D4AF37"}}/>
          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{fontFamily:"'Georgia',serif",color:"#fff"}}>The Idea-to-Action</h1>
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{fontFamily:"'Georgia',serif",color:"#fff"}}>Workbook</h1>
          <p className="text-base italic mb-8" style={{fontFamily:"'Georgia',serif",color:"#D8D1C5"}}>A guided companion for choosing your strongest idea,<br/>working through fear, and building your next move.</p>
          <div className="flex justify-center gap-2 mb-10">{[0,1,2].map(i => <span key={i} className="w-2 h-2 rotate-45 inline-block" style={{background:"#D4AF37"}}/>)}</div>
          <div className="border rounded-lg p-5 mb-8 inline-block" style={{borderColor:"#D4AF37"}}>
            <p className="text-xs font-bold tracking-wider mb-1" style={{color:"#D4AF37"}}>AUTHOR MARK</p>
            <p className="text-3xl font-bold mb-1" style={{fontFamily:"'Georgia',serif",color:"#fff"}}>MDW</p>
            <p className="text-xs" style={{color:"#C7D9D2"}}>Founder · Author · Visionary Creative</p>
          </div>
          <div className="text-xs space-y-1" style={{color:"#C7D9D2"}}>
            <p>Use this workbook digitally or print it for handwritten reflection.</p>
            <p>Move through it in one sitting or across several sessions.</p>
            <p>Write honestly. Clarity matters more than perfection.</p>
          </div>
          <div className="h-1 w-full mt-8" style={{background:"#D4AF37"}}/>
        </div>
      </div>
    );

    if (p === 1) return (
      <PageShell title="Welcome" subtitle="This Workbook Is for the Ideas That Keep Returning" pageNum={2}>
        <div className="space-y-3 text-sm" style={{color:"#2d2d2d"}}>
          <p>You bought the book. Now you have this companion. That means something important: you are not only reading. You are ready to move.</p>
          <p>This workbook is for the ideas that keep returning. The unfinished concepts. The quiet nudges. The thoughts that feel exciting, inconvenient, meaningful, or overdue.</p>
          <p>Use this workbook in one sitting or over several days. Write honestly. Do not aim to sound impressive. Aim to become clear.</p>
        </div>
        <div className="rounded-md p-4 border-l-4" style={{background:"#e0f2f1",borderColor:"#008080"}}>
          <p className="font-bold text-sm mb-2" style={{color:"#00695f"}}>How to use this workbook</p>
          <ul className="space-y-1 text-sm" style={{color:"#2d2d2d"}}>
            {["Move in order for the strongest result.","Do not edit yourself too early.","When a page feels uncomfortable, stay with it a little longer.","Choose honesty over performance."].map((t,i) =>
              <li key={i} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rotate-45 mt-1.5 flex-shrink-0" style={{background:"#D4AF37"}}/>{t}</li>
            )}
          </ul>
        </div>
        <p className="text-base italic" style={{fontFamily:"'Georgia',serif",color:"#00695f"}}>You do not need perfect clarity to begin. You only need enough honesty to see what is here.</p>
      </PageShell>
    );

    if (p === 2) return (
      <PageShell title="Idea Dump" subtitle="Write every idea, concept, question, unfinished thought, desire, theme, problem, project, message, or possibility currently circling in your mind." pageNum={3}>
        <InstructionBox>Do not organize. Do not judge. Do not narrow yet. Empty the reservoir. At the end, place a star beside any idea that feels alive, emotionally charged, useful, or difficult to ignore.</InstructionBox>
        <Field label="Write Freely" id="ideaDump" data={data} setData={setData} tall />
      </PageShell>
    );

    if (p === 3) return (
      <PageShell title="Recurring Ideas" subtitle="What ideas keep returning, even after you dismiss them?" pageNum={4}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="List the Recurring Ideas" id="recurList" data={data} setData={setData} tall />
          <Field label="Why Do You Think These Ideas Keep Returning?" id="recurWhy" data={data} setData={setData} tall />
        </div>
      </PageShell>
    );

    if (p === 4) return (
      <PageShell title="Idea Inventory" subtitle="Choose 3 to 5 ideas from your earlier pages. Describe each one — who it helps, why it matters, and how it might begin." pageNum={5}>
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs border-collapse min-w-[500px]">
            <thead><tr>{["Idea","Why it matters","Who it could help","What excites me","What concerns me","First possible form"].map((h,i) =>
              <th key={i} className="px-2 py-2 text-left font-bold text-white" style={{background:"#00695f"}}>{h}</th>
            )}</tr></thead>
            <tbody>{[0,1,2,3,4].map(r => <tr key={r}>{[0,1,2,3,4].map(col =>
              <td key={col} className="border px-1 py-1" style={{borderColor:"#d0d0d0",background:r%2===0?"#f7f4ed":"#fff"}}>
                <input className="w-full bg-transparent text-xs py-1 px-1 focus:outline-none" style={{color:"#1a1a1a"}}
                  value={String(data[`inv_${r}_${col}`] ?? "")} onChange={e => setData(d => ({...d,[`inv_${r}_${col}`]:e.target.value}))} />
              </td>
            )}</tr>)}</tbody>
          </table>
        </div>
        <Field label="Which Idea Has Both Excitement and Meaning?" id="invBoth" data={data} setData={setData} />
      </PageShell>
    );
    if (p === 5) return (
      <PageShell title="Idea Scorecard" subtitle="Now score your top 3 ideas numerically. Rate each from 1 (low) to 10 (high) to see which idea earns the strongest case." pageNum={6}>
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs border-collapse min-w-[400px]">
            <thead><tr>{["Category","Idea 1","Idea 2","Idea 3"].map((h,i) =>
              <th key={i} className="px-2 py-2 text-left font-bold text-white" style={{background:"#00695f"}}>{h}</th>
            )}</tr></thead>
            <tbody>{["Energy (how alive it makes you feel)","Alignment (fits your values and season)","Usefulness (solves a real problem)","Readiness (you could start within 30 days)","Long-term potential (still matters in 3 years)","Emotional resistance (harder to ignore = higher)"].map((cat,r) =>
              <tr key={r}><td className="border px-2 py-2 font-medium" style={{borderColor:"#d0d0d0",background:r%2===0?"#f7f4ed":"#fff",color:"#2d2d2d"}}>{cat}</td>
              {[1,2,3].map(col => <td key={col} className="border px-1 py-1" style={{borderColor:"#d0d0d0",background:r%2===0?"#f7f4ed":"#fff"}}>
                <input type="number" min="1" max="10" className="w-full bg-transparent text-xs py-1 px-1 text-center focus:outline-none" style={{color:"#1a1a1a"}}
                  value={String(data[`sc_${r}_${col}`] ?? "")} onChange={e => setData(d => ({...d,[`sc_${r}_${col}`]:e.target.value}))} />
              </td>)}</tr>
            )}</tbody>
          </table>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Which Idea Has the Strongest Total Score?" id="scStrong" data={data} setData={setData} />
          <Field label="Which Idea Feels Most Important Now?" id="scImport" data={data} setData={setData} />
        </div>
      </PageShell>
    );

    if (p === 6) return (
      <PageShell title="Idea Filter" subtitle="Use this page to stop romanticizing the wrong idea. Choose the idea that fits your life, not just your excitement." pageNum={7}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Which Idea Fits This Season of My Life?" id="filtSeason" data={data} setData={setData} mid />
          <Field label="Which Idea Am I Emotionally Ready to Serve?" id="filtReady" data={data} setData={setData} mid />
          <Field label="Which Idea Solves a Real Problem, Not Just Interests Me?" id="filtReal" data={data} setData={setData} mid />
          <Field label="Which Idea Keeps Returning for a Reason?" id="filtReturn" data={data} setData={setData} mid />
        </div>
        <Field label="Which Idea Am I Most Tempted to Avoid Because It Matters?" id="filtAvoid" data={data} setData={setData} />
        <BottomQuote text="Do not select based on intensity alone. Select based on fit, usefulness, and honest readiness." />
      </PageShell>
    );

    if (p === 7) return (
      <PageShell title="Choose the Idea" subtitle="Choose one idea to focus on in this workbook." pageNum={8}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="The Idea I Am Choosing Is:" id="chooseIdea" data={data} setData={setData} mid />
          <Field label="I Am Choosing It Now Because:" id="chooseBecause" data={data} setData={setData} mid />
        </div>
        <Field label="I Am Not Choosing the Others Right Now Because:" id="chooseNot" data={data} setData={setData} />
        <Field label="If You Do Not Choose, You Are Still Making a Choice. What Does Delay Cost You?" id="chooseDelay" data={data} setData={setData} />
        <CompleteSentence text="For this season, this is the idea I am willing to honor." />
      </PageShell>
    );

    if (p === 8) return (
      <PageShell title="Idea Expansion Map" subtitle="Now expand the idea you chose." pageNum={9}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="What Is the Core Concept?" id="expCore" data={data} setData={setData} mid />
          <Field label="Who Is This For?" id="expWho" data={data} setData={setData} mid />
          <Field label="What Problem, Need, Desire, or Tension Does It Address?" id="expProblem" data={data} setData={setData} mid />
          <Field label="Why Does This Idea Matter to You Personally?" id="expPersonal" data={data} setData={setData} mid />
          <Field label="What Could This Become If Fully Developed?" id="expFull" data={data} setData={setData} mid />
          <Field label="What Is the Simplest First Version of It?" id="expSimple" data={data} setData={setData} mid />
        </div>
      </PageShell>
    );

    if (p === 9) return (
      <PageShell title="Ten Possible Forms" subtitle="List 10 possible ways this idea could exist." pageNum={10}>
        <div className="space-y-2">
          {[1,2,3,4,5,6,7,8,9,10].map(n => (
            <div key={n} className="flex items-center gap-3">
              <span className="text-lg font-bold flex-shrink-0 w-7 text-right" style={{fontFamily:"'Georgia',serif",color:"#008080"}}>{n}.</span>
              <input className="flex-1 border-b-2 bg-transparent py-1.5 text-sm focus:outline-none"
                style={{borderColor:"#d0d0d0",color:"#1a1a1a"}}
                value={String(data[`form_${n}`] ?? "")} onChange={e => setData(d => ({...d,[`form_${n}`]:e.target.value}))}
                placeholder={`Form ${n}...`} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Field label="Which Version Surprises Me?" id="formSurprise" data={data} setData={setData} />
          <Field label="Which Version Feels Most Alive?" id="formAlive" data={data} setData={setData} />
          <Field label="Which Is the Smartest First Version?" id="formSmart" data={data} setData={setData} />
        </div>
      </PageShell>
    );

    if (p === 10) return (
      <PageShell title="Why This Idea Matters" subtitle="Answer with honesty, not performance." pageNum={11}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Why This Idea?" id="whyIdea" data={data} setData={setData} />
          <Field label="Why Now?" id="whyNow" data={data} setData={setData} />
          <Field label="Why You?" id="whyYou" data={data} setData={setData} />
          <Field label="What Would Be Lost If You Kept Ignoring It?" id="whyLost" data={data} setData={setData} />
        </div>
        <Field label="What Might Become Possible If You Followed Through?" id="whyPossible" data={data} setData={setData} />
        <Field label="What Makes Me More Ready Than I Admit? (Skills I Already Have · Experience That Transfers · Taste and Intuition)" id="whyReady" data={data} setData={setData} />
      </PageShell>
    );

    if (p === 11) return (
      <PageShell title="One-Sentence Positioning" subtitle="Make the idea useful and communicable." pageNum={12}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="My Idea Is A..." id="posIs" data={data} setData={setData} mid />
          <Field label="For..." id="posFor" data={data} setData={setData} mid />
          <Field label="That Helps Them..." id="posHelps" data={data} setData={setData} mid />
          <Field label="By Giving Them..." id="posGiving" data={data} setData={setData} mid />
        </div>
        <CompleteSentence text="This idea is a ______ for ______ who need ______." />
      </PageShell>
    );

    if (p === 12) return (
      <PageShell title="What Am I Afraid Of, Really?" subtitle="Check all that apply, then write the real story beneath." pageNum={13}>
        <div className="space-y-0.5">
          {[
            ["fear_seen","being seen more clearly than I am comfortable with"],
            ["fear_judged","being judged, criticized, or misunderstood"],
            ["fear_fail","failing publicly"],
            ["fear_enough","not being good enough"],
            ["fear_succeed","succeeding and having to sustain it"],
            ["fear_disappoint","disappointing people I care about"],
            ["fear_outgrow","outgrowing an old version of myself"],
            ["fear_other","other"],
          ].map(([id,label]) => <Checkbox key={id} id={id} label={label} data={data} setData={setData} />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="If I Fully Pursued This Idea, I Am Afraid That..." id="fearPursue" data={data} setData={setData} mid />
          <Field label="What Is This Fear Trying to Protect Me From?" id="fearProtect" data={data} setData={setData} mid />
        </div>
      </PageShell>
    );

    if (p === 13) return (
      <PageShell title="Fear vs. Fact" subtitle="In the left column, write what fear says. In the right column, write what you actually know." pageNum={14}>
        <InstructionBox>Fear speaks in absolutes. Truth speaks in specifics.</InstructionBox>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Fear Says..." id="fearSays" data={data} setData={setData} tall />
          <Field label="Truth Says..." id="truthSays" data={data} setData={setData} tall />
        </div>
      </PageShell>
    );

    if (p === 14) return (
      <PageShell title="Creative Risk Audit + Three Scenarios" subtitle="Separate real risk from imagined risk, then look at outcomes without distortion." pageNum={15}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="What Is the Real Risk?" id="riskReal" data={data} setData={setData} mid />
          <Field label="What Is the Imagined Risk?" id="riskImagined" data={data} setData={setData} mid />
          <Field label="Cost of Doing Nothing for 6 Months?" id="riskCost" data={data} setData={setData} mid />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Worst-Case Scenario" id="scenarioWorst" data={data} setData={setData} mid />
          <Field label="Best-Case Scenario" id="scenarioBest" data={data} setData={setData} mid />
          <Field label="Most-Likely Scenario" id="scenarioLikely" data={data} setData={setData} mid />
        </div>
        <Field label="Which Scenario Have I Been Acting As If It Is Guaranteed?" id="scenarioActing" data={data} setData={setData} />
      </PageShell>
    );

    if (p === 15) return (
      <PageShell title="If I Trusted Myself" subtitle="Answer as if self-doubt were not a factor." pageNum={16}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="What Would I Do Next?" id="trustNext" data={data} setData={setData} tall />
          <Field label="What Would I Stop Delaying?" id="trustDelay" data={data} setData={setData} tall />
          <Field label="What Would I No Longer Ask Permission For?" id="trustPermit" data={data} setData={setData} tall />
          <Field label="What Decision Becomes Obvious When Fear Is Quiet?" id="trustObvious" data={data} setData={setData} tall />
        </div>
        <BottomQuote text="The gap between this page and your current behavior reveals where fear has been making decisions for you." />
      </PageShell>
    );

    if (p === 16) return (
      <PageShell title="Rewrite the Story" subtitle="Replace limiting narratives with grounded reframes." pageNum={17}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Old Story" id="storyOld" data={data} setData={setData} tall />
          <Field label="New Story" id="storyNew" data={data} setData={setData} tall />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="What Have I Survived?" id="storySurvived" data={data} setData={setData} />
          <Field label="What Have I Created?" id="storyCreated" data={data} setData={setData} />
          <Field label="Proof I Can Learn While Moving" id="storyProof" data={data} setData={setData} />
        </div>
      </PageShell>
    );

    if (p === 17) return (
      <PageShell title="Self-Authorization Statement" subtitle="Move from reflection to internal permission." pageNum={18}>
        <div className="space-y-3">
          {[
            "I give myself permission to begin before I feel fully ready.",
            "I give myself permission to create imperfectly at first.",
            "I give myself permission to take this idea seriously.",
            "I give myself permission to become visible through my work.",
          ].map((t,i) => (
            <div key={i} className="flex items-start gap-3 py-2 border-l-4 pl-3" style={{borderColor:"#008080"}}>
              <p className="text-sm italic" style={{fontFamily:"'Georgia',serif",color:"#2d2d2d"}}>{t}</p>
            </div>
          ))}
        </div>
        <Field label="I Give Myself Permission To..." id="authPermission" data={data} setData={setData} tall />
      </PageShell>
    );

    if (p === 18) return (
      <PageShell title="30-Day Action Path" subtitle="For the next 30 days, focus on this idea." pageNum={19}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="My 30-Day Goal Is:" id="goal30" data={data} setData={setData} mid />
          <Field label="By the End of 30 Days, I Want to Have:" id="goalEnd" data={data} setData={setData} mid />
          <Field label="The Three Milestones Are:" id="goalMilestones" data={data} setData={setData} mid />
          <Field label="What May Interrupt Me:" id="goalInterrupt" data={data} setData={setData} mid />
          <Field label="What I Will Do When Resistance Shows Up:" id="goalResistance" data={data} setData={setData} mid />
          <Field label="Who Will I Show This to for Accountability?" id="goalAccountability" data={data} setData={setData} mid />
        </div>
      </PageShell>
    );

    if (p === 19) return (
      <PageShell title="Tiny Next Steps" subtitle="Break your idea into the smallest possible actions." pageNum={20}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="My 10-Minute Step:" id="step10m" data={data} setData={setData} />
          <Field label="My 1-Hour Step:" id="step1h" data={data} setData={setData} />
          <Field label="My 1-Day Step:" id="step1d" data={data} setData={setData} />
          <Field label="The First Thing I Will Do After Finishing This Workbook:" id="stepFirst" data={data} setData={setData} />
          <Field label="What Does 'Good Enough to Begin' Look Like?" id="stepGood" data={data} setData={setData} />
          <Field label="What Am I No Longer Requiring Before I Start?" id="stepNoMore" data={data} setData={setData} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="The Date I Will Begin:" id="stepDate" data={data} setData={setData} />
          <Field label="What Am I No Longer Waiting For?" id="stepWaiting" data={data} setData={setData} />
        </div>
      </PageShell>
    );

    if (p === 20) return (
      <PageShell title="Creative Commitment" subtitle="Close with identity and action." pageNum={21}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="The Idea I Am Choosing to Honor Is:" id="commitIdea" data={data} setData={setData} mid />
          <Field label="The Fear I Am No Longer Letting Lead Is:" id="commitFear" data={data} setData={setData} mid />
          <Field label="My Next Real Step Is:" id="commitStep" data={data} setData={setData} mid />
          <Field label="The Version of Me I Am Becoming Is:" id="commitBecoming" data={data} setData={setData} mid />
        </div>
        <Field label="I Will Return to This Commitment On:" id="commitReturn" data={data} setData={setData} />
        <CompleteSentence text="I do not need to feel fully ready to begin. I need only to begin honestly." />
        <div className="w-full h-0.5 mt-6" style={{background:"#D4AF37"}}/>
        <p className="text-center text-xs italic mt-3" style={{color:"#888"}}>Return to this page when fear gets loud and clarity gets quiet.</p>
      </PageShell>
    );
  };

  return (
    <div className="min-h-screen" style={{background: page === 0 ? "#00695f" : "#faf6ef", transition:"background 0.4s"}}>
      <div ref={topRef} />
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b"
        style={{background: page === 0 ? "rgba(15,94,94,0.95)" : "rgba(250,246,239,0.95)", borderColor: page === 0 ? "#008080" : "#e0e0e0"}}>
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-2.5">
          <button onClick={prev} disabled={page===0} className="text-xs font-bold tracking-wider px-3 py-1.5 rounded transition-opacity disabled:opacity-30"
            style={{color: page===0?"#C7D9D2":"#00695f"}}>← PREV</button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-xs font-bold tracking-wider px-3 py-1.5"
            style={{color:"#D4AF37"}}>{PAGE_TITLES[page]} ▾</button>
          <button onClick={next} disabled={page===20} className="text-xs font-bold tracking-wider px-3 py-1.5 rounded transition-opacity disabled:opacity-30"
            style={{color: page===0?"#C7D9D2":"#00695f"}}>NEXT →</button>
        </div>
        {menuOpen && (
          <div className="absolute left-0 right-0 border-b shadow-lg max-h-80 overflow-y-auto"
            style={{background: page===0?"#0a4a4a":"#fff",borderColor:"#d0d0d0"}}>
            {PAGE_TITLES.map((t,i) => (
              <button key={i} onClick={() => go(i)}
                className="block w-full text-left text-xs px-6 py-2 transition-colors"
                style={{color: i===page ? "#D4AF37" : (page===0?"#b0d4d4":"#2d2d2d"), fontWeight: i===page?"700":"400",
                  background: i===page ? (page===0?"rgba(201,168,76,0.15)":"rgba(26,122,122,0.08)") : "transparent"}}>
                {i+1}. {t}
              </button>
            ))}
          </div>
        )}
      </nav>
      <main className="py-8 px-4">{renderPage()}</main>
      {page > 0 && (
        <div className="max-w-2xl mx-auto px-4 pb-8 flex justify-between">
          <button onClick={prev} className="text-sm font-bold px-5 py-2.5 rounded-md transition-all"
            style={{background:"#e0f2f1",color:"#00695f"}}>← Previous</button>
          {page < 20 ? (
            <button onClick={next} className="text-sm font-bold px-5 py-2.5 rounded-md text-white transition-all"
              style={{background:"#008080"}}>Next Page →</button>
          ) : (
            <div className="text-sm font-bold px-5 py-2.5 rounded-md text-white" style={{background:"#D4AF37"}}>✦ Complete</div>
          )}
        </div>
      )}
      {page === 0 && (
        <div className="text-center pb-10">
          <button onClick={next} className="text-sm font-bold px-8 py-3 rounded-md text-white transition-all hover:opacity-90"
            style={{background:"#D4AF37"}}>Begin the Workbook →</button>
        </div>
      )}
    </div>
  );
}
