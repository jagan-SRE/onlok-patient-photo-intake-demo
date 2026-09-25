import { Check, CircleHelp, HeartHandshake, ImagePlus, LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";
import type { ReviewStatus } from "@/lib/photo-intake/types";

export type PhotoIntakePage = "home" | "form" | "confirmation" | "staff" | "review" | "architecture" | "security" | "questions" | "migration";

export function statusClass(status: string) { return `intake-status intake-status-${status.toLowerCase().replaceAll(" ", "-")}`; }
export function StatusPill({ status }: { status: ReviewStatus }) { return <span className={statusClass(status)}><i />{status}</span>; }
export function Field({ label, children, wide }: { label: string; children: ReactNode; error?: string; wide?: boolean }) { return <label className={`intake-field ${wide ? "field-wide" : ""}`}><span className="intake-field-label">{label} <i>*</i></span>{children}</label>; }
export function ErrorText({ children }: { children: ReactNode }) { return <span className="field-error"><CircleHelp size={13} />{children}</span>; }
export function StatusIcon({ status }: { status: ReviewStatus }) { if (status === "Submitted") return <ImagePlus size={17} />; if (status === "Reviewed") return <Check size={17} />; if (status === "Needs Visit") return <HeartHandshake size={17} />; if (status === "Charted") return <Check size={17} />; return <LockKeyhole size={17} />; }

export function DocsPage({ title, eyebrow, intro, active, go, children }: { title: string; eyebrow: string; intro: string; active: "architecture" | "security" | "questions" | "migration"; go: (target: PhotoIntakePage) => void; children: ReactNode }) {
  return <section className="docs-page"><div className="docs-page-head"><span className="intake-overline"><i /> {eyebrow}</span><h1>{title}</h1><p>{intro}</p></div><div className="docs-tabs">{([["architecture", "Architecture"], ["security", "Security & privacy"], ["questions", "Open questions"], ["migration", "Production plan"]] as [PhotoIntakePage, string][]).map(([key, label]) => <button key={key} className={active === key ? "docs-tab-active" : ""} onClick={() => go(key)}>{label}</button>)}</div>{children}</section>;
}

export function QuestionGroup({ title, items }: { title: string; items: string[] }) { return <section className="question-group"><h2>{title}</h2>{items.map((item) => <div key={item}><span><CircleHelp size={14} /></span>{item}</div>)}</section>; }
