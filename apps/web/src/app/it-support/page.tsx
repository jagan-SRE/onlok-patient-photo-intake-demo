"use client";

import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check,
  CheckCircle2, ChevronDown, CircleHelp, Clock3, Computer, FileText,
  Headphones, Laptop, LifeBuoy, LockKeyhole, Mail, Menu, MessageCircle,
  Monitor, Network, Paperclip, Search, Send, ShieldCheck, Smartphone,
  Sparkles, UserRound, Wifi, X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type PortalRequest = {
  id: string; subject: string; category: string; submitted: string;
  priority: string; status: string; description: string; location: string;
  contact: string; assigned: string; updates: string[];
};

const starter: PortalRequest[] = [
  { id: "IT-1002", subject: "Microsoft 365 access", category: "Account & Access", submitted: "Sep 17, 2026", priority: "Low", status: "Resolved", description: "Need access to Microsoft 365 apps on a replacement device.", location: "Remote", contact: "Email", assigned: "IT Support", updates: ["Sep 17 · Request submitted", "Sep 17 · IT Support assigned the request", "Sep 18 · Access confirmed"] },
  { id: "IT-1001", subject: "ADP login issue", category: "ADP", submitted: "Sep 18, 2026", priority: "Medium", status: "In Progress", description: "Unable to sign in to ADP after password reset.", location: "Main Office", contact: "Email", assigned: "IT Support", updates: ["Sep 18 · Request submitted", "Sep 18 · IT Support assigned the request", "Sep 19 · IT Support investigating"] },
];
const categories = [
  { name: "Account & Access", detail: "Password, permissions, MFA & sign-in", Icon: LockKeyhole },
  { name: "Hardware", detail: "Computer, monitor & peripherals", Icon: Laptop },
  { name: "Software", detail: "Microsoft 365 & applications", Icon: Computer },
  { name: "Network", detail: "Wi-Fi, VPN & connectivity", Icon: Wifi },
  { name: "ADP", detail: "Sign-in, time clock & access", Icon: Clock3 },
  { name: "Other", detail: "Something else? We can help.", Icon: CircleHelp },
];
const articles = [
  { title: "What should I do if I cannot sign in to ADP?", category: "ADP", terms: "adp login password mfa sign in" },
  { title: "How do I reset my password?", category: "Account & Access", terms: "password reset account access" },
  { title: "Setting up multi-factor authentication", category: "Account & Access", terms: "mfa security sign in" },
  { title: "Getting started with Microsoft Teams", category: "Microsoft 365", terms: "microsoft teams meetings" },
  { title: "Troubleshooting a Wi-Fi connection", category: "Network", terms: "wifi network connection internet" },
  { title: "What should I do with a suspicious email?", category: "Security", terms: "phishing suspicious email security" },
];
type View = "home" | "submit" | "requests" | "knowledge" | "contact" | "details" | "article" | "confirmation";
const STORAGE_KEY = "onlok-it-support-demo-requests";

function Badge({ children }: { children: string }) {
  const key = children.toLowerCase().replaceAll(" ", "-");
  return <span className={`badge badge-${key}`}><span className="badge-dot" />{children}</span>;
}
function IconTile({ children, tint = "sage" }: { children: React.ReactNode; tint?: string }) {
  return <span className={`icon-tile icon-${tint}`} aria-hidden="true">{children}</span>;
}

export default function ITSupportPortal() {
  const [view, setView] = useState<View>("home");
  const [requests, setRequests] = useState<PortalRequest[]>(starter);
  const [selectedId, setSelectedId] = useState("IT-1001");
  const [selectedArticle, setSelectedArticle] = useState(articles[0]);
  const [category, setCategory] = useState("Account & Access");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({ subject: "", description: "", location: "", priority: "Medium", contact: "Email" });
  const [comment, setComment] = useState("");
  const [lastSubmitted, setLastSubmitted] = useState<PortalRequest | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setRequests([...starter, ...JSON.parse(saved) as PortalRequest[]]);
    } catch { /* Keep the sample list if browser storage is unavailable. */ }
  }, []);

  const selectedRequest = requests.find((request) => request.id === selectedId) ?? requests[0];
  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return articles.filter((article) => !query || `${article.title} ${article.category} ${article.terms}`.toLowerCase().includes(query));
  }, [search]);

  function navigate(next: View) { setView(next); setMenuOpen(false); setNotice(""); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function startRequest(nextCategory = "Account & Access") { setCategory(nextCategory); setForm({ subject: "", description: "", location: "", priority: "Medium", contact: "Email" }); navigate("submit"); }
  function openRequest(id: string) { setSelectedId(id); navigate("details"); }
  function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextNumber = 1003 + requests.filter((request) => Number(request.id.slice(3)) >= 1003).length;
    const submitted: PortalRequest = {
      id: `IT-${nextNumber}`, subject: form.subject, category, submitted: "Sep 22, 2026",
      priority: form.priority, status: "New", description: form.description,
      location: form.location, contact: form.contact, assigned: "IT Support", updates: ["Sep 22 · Request submitted"],
    };
    const added = [...requests, submitted]; setRequests(added); setLastSubmitted(submitted); setSelectedId(submitted.id);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(added.filter((request) => Number(request.id.slice(3)) >= 1003))); } catch { /* Session still works without persistence. */ }
    navigate("confirmation");
  }
  function addComment() {
    if (!comment.trim() || !selectedRequest) return;
    const updated = requests.map((request) => request.id === selectedRequest.id ? { ...request, updates: [...request.updates, `Sep 22 · Your comment: ${comment.trim()}`] } : request);
    setRequests(updated); setComment("");
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.filter((request) => Number(request.id.slice(3)) >= 1003))); } catch { /* Optional persistence. */ }
    setNotice("Your comment has been added.");
  }
  function closeRequest() {
    if (!selectedRequest || selectedRequest.status === "Closed") return;
    const updated = requests.map((request) => request.id === selectedRequest.id ? { ...request, status: "Closed", updates: [...request.updates, "Sep 22 · Request closed"] } : request);
    setRequests(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.filter((request) => Number(request.id.slice(3)) >= 1003))); } catch { /* Optional persistence. */ }
    setNotice("This demo request is now closed.");
  }

  const navItems: [string, View][] = [["Home", "home"], ["Submit Request", "submit"], ["My Requests", "requests"], ["Knowledge Base", "knowledge"], ["Contact IT", "contact"]];
  const heading: Record<View, [string, string]> = {
    home: ["Welcome to IT Support", "A little help goes a long way. Find answers and get back to what matters."],
    submit: ["Tell us how we can help", "Share a few details and we’ll get your request to the right team."],
    requests: ["Your support requests", "Keep track of updates and see where things stand."],
    knowledge: ["Find a quick answer", "Practical guides for the questions we hear most often."],
    contact: ["We’re here to help", "Choose the best way to reach the IT Support team."],
    details: ["Request details", "Review the latest status and updates on your request."],
    article: ["Knowledge Base", "A little guidance can make a big difference."],
    confirmation: ["You’re all set", "Your request is on its way to the IT Support team."],
  };

  return (
    <div className="portal-shell">
      <div className="demo-bar"><Sparkles size={13} /> <span>DEMO ENVIRONMENT</span><span className="demo-bar-copy">A preview of an employee support experience</span></div>
      <header className="site-header">
        <button className="brand" onClick={() => navigate("home")} aria-label="On Lok IT Support Portal home">
          <span className="brand-symbol" aria-hidden="true"><span /><span /><span /></span>
          <span className="brand-text"><strong>On Lok</strong><span>IT SUPPORT PORTAL</span></span>
        </button>
        <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
        <nav className={`main-nav ${menuOpen ? "nav-open" : ""}`} aria-label="Main navigation">
          {navItems.map(([label, target]) => <button key={label} onClick={() => target === "submit" ? startRequest() : navigate(target)} className={`nav-link ${view === target ? "nav-current" : ""}`}>{label}</button>)}
        </nav>
        <button className="profile-pill" onClick={() => setNotice("Signed in as Demo Employee for this preview.")}><span className="profile-avatar">D</span><span>Demo Employee</span><ChevronDown size={14} /></button>
      </header>

      <main id="main-content">
        <div className="page-heading">
          <div className="eyebrow"><span /> EMPLOYEE SERVICES <span className="eyebrow-divider">/</span> IT SUPPORT</div>
          <h1>{heading[view][0]}</h1><p>{heading[view][1]}</p>
        </div>
        {notice && <div className="notice" role="status"><CheckCircle2 size={17} />{notice}<button onClick={() => setNotice("")} aria-label="Dismiss message"><X size={16} /></button></div>}

        {view === "home" && <>
          <section className="welcome-panel">
            <div className="welcome-copy"><span className="section-kicker">HERE FOR YOUR WORKDAY</span><h2>How can we<br />help you today?</h2><p>Find the support you need, so you can focus on the people who count on you.</p><div className="welcome-actions"><button className="button button-primary" onClick={() => startRequest()}>Get IT support <ArrowRight size={16} /></button><button className="button button-ghost" onClick={() => navigate("knowledge")}>Explore help articles <ArrowRight size={16} /></button></div></div>
            <div className="welcome-art" aria-hidden="true"><div className="art-circle circle-back" /><div className="art-circle circle-front" /><div className="art-window"><div className="art-window-dots"><i /><i /><i /></div><div className="art-window-content"><div className="art-spark"><Sparkles size={22} /></div><span className="art-line art-line-long" /><span className="art-line art-line-short" /><div className="art-check"><Check size={16} /></div></div></div><div className="art-float art-float-one"><Headphones size={18} /></div><div className="art-float art-float-two"><CheckCircle2 size={18} /></div><span className="art-caption">A helping hand, whenever you need it</span></div>
            <div className="welcome-foot"><span><ShieldCheck size={15} /> Here when you need us</span><span className="welcome-foot-right">Simple support. One step at a time.</span></div>
          </section>
          <section className="section-block"><div className="section-title-row"><div><span className="section-kicker">A GOOD PLACE TO START</span><h2>What do you need help with?</h2></div><button className="text-link" onClick={() => startRequest()}>All support options <ArrowRight size={15} /></button></div>
            <div className="quick-grid">{[{ title: "Submit a request", text: "Tell us what’s going on. We’ll take it from there.", label: "Start a request", Icon: Send, tint: "sage", target: "submit" as View }, { title: "My requests", text: "Pick up where you left off and see the latest updates.", label: "View your requests", Icon: FileText, tint: "blue", target: "requests" as View }, { title: "Knowledge Base", text: "Friendly how-to guides for everyday IT questions.", label: "Browse help articles", Icon: BookOpen, tint: "gold", target: "knowledge" as View }, { title: "Contact IT", text: "Find the right support channel for your situation.", label: "Ways to get in touch", Icon: MessageCircle, tint: "rose", target: "contact" as View }].map(({ title, text, label, Icon, tint, target }) => <button key={title} className="quick-card" onClick={() => target === "submit" ? startRequest() : navigate(target)}><span className="quick-card-top"><IconTile tint={tint}><Icon size={19} /></IconTile><ArrowUpRight className="card-arrow" size={18} /></span><strong>{title}</strong><span className="quick-desc">{text}</span><span className="quick-link">{label}<ArrowRight size={14} /></span></button>)}</div>
          </section>
          <section className="section-block category-section"><div className="section-title-row"><div><span className="section-kicker">COMMON REQUESTS</span><h2>What’s getting in your way?</h2><p className="section-subtitle">Choose a topic and we’ll point you in the right direction.</p></div></div><div className="category-grid">{categories.map(({ name, detail, Icon }) => <button className="category-card" key={name} onClick={() => startRequest(name)}><IconTile><Icon size={19} /></IconTile><span className="category-card-copy"><strong>{name}</strong><span>{detail}</span></span><ArrowRight size={16} className="category-arrow" /></button>)}</div></section>
          <section className="support-strip"><div className="support-strip-icon"><Headphones size={22} /></div><div className="support-strip-copy"><span className="section-kicker">NEED A HAND?</span><h2>Not sure where to start?</h2><p>We’ll help you find the right next step.</p></div><div className="support-strip-action"><span>IT Support Contact Information</span><button className="button button-outline" onClick={() => navigate("contact")}>See contact options <ArrowRight size={15} /></button></div></section>
        </>}

        {view === "submit" && <section className="form-layout"><form className="surface-card request-form" onSubmit={submitRequest}><div className="form-intro"><IconTile><Headphones size={19} /></IconTile><div><strong>New support request</strong><span>Fields marked with <b>*</b> are required.</span></div></div><div className="form-divider" />
          <label className="field-label" htmlFor="category">What can we help with? <b>*</b></label><select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>{["Account & Access", "Hardware", "Software", "Network", "ADP", "Microsoft 365", "Security", "Other"].map((option) => <option key={option}>{option}</option>)}</select>
          <label className="field-label" htmlFor="subject">Give your request a short title <b>*</b></label><input id="subject" required maxLength={100} placeholder="For example, ‘Can’t connect to Wi-Fi’" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <label className="field-label" htmlFor="description">A little more detail <b>*</b></label><textarea id="description" required rows={5} placeholder="What were you trying to do? What happened? Include any error message that might help." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="field-pair"><div><label className="field-label" htmlFor="location">Your work location</label><select id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}><option value="">Choose a location</option>{["Main Office", "San Francisco", "Union City", "Site / Facility", "Remote", "Other"].map((option) => <option key={option}>{option}</option>)}</select></div><div><label className="field-label" htmlFor="priority">How urgent is it?</label><select id="priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>{["Low", "Medium", "High", "Urgent"].map((option) => <option key={option}>{option}</option>)}</select></div></div>
          <div className="priority-hint"><CircleHelp size={15} /><span><b>{form.priority}:</b> {{ Low: "A general question or something that can wait.", Medium: "Your usual work is affected, but you have a workaround.", High: "Your work is significantly affected.", Urgent: "A critical business function is affected." }[form.priority]}</span></div>
          <label className="field-label" htmlFor="attachment">Add a screenshot or file <span className="optional">OPTIONAL</span></label><label className="upload-field" htmlFor="attachment"><Paperclip size={16} /><span>Choose a file <small>Attach a screenshot that might help us understand the issue.</small></span><input id="attachment" type="file" /></label>
          <label className="field-label" htmlFor="contact">How would you prefer we reach you?</label><select id="contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })}>{["Email", "Teams", "Phone"].map((option) => <option key={option}>{option}</option>)}</select>
          <div className="form-actions"><span><ShieldCheck size={14} /> Your request is only visible to you and IT Support.</span><button className="button button-primary" type="submit">Send my request <ArrowRight size={16} /></button></div>
        </form><aside className="form-aside"><div className="aside-card aside-help"><IconTile tint="blue"><BookOpen size={18} /></IconTile><h3>Could a quick answer help?</h3><p>We have simple guides for the things people ask about most.</p><button className="text-link" onClick={() => navigate("knowledge")}>Browse the Knowledge Base <ArrowRight size={14} /></button></div><div className="aside-card aside-tip"><span className="section-kicker">A LITTLE CONTEXT HELPS</span><p>Let us know what you were doing and what you expected to happen. Please leave out passwords or sensitive personal information.</p></div><div className="aside-card aside-contact"><Headphones size={17} /><span>Need immediate assistance?</span><button onClick={() => navigate("contact")}>View contact options <ArrowRight size={14} /></button></div></aside></section>}

        {view === "confirmation" && lastSubmitted && <section className="confirmation-card surface-card"><span className="confirmation-check"><Check size={27} /></span><span className="section-kicker">REQUEST RECEIVED</span><h2>Thanks for reaching out.</h2><p>Your request has been submitted. Our IT Support team will take a look and follow up using your preferred contact method.</p><div className="confirmation-details"><div><span>REQUEST NUMBER</span><strong>{lastSubmitted.id}</strong></div><div><span>STATUS</span><Badge>New</Badge></div><div><span>PRIORITY</span><Badge>{lastSubmitted.priority}</Badge></div></div><div className="confirmation-actions"><button className="button button-primary" onClick={() => navigate("requests")}>View my requests <ArrowRight size={16} /></button><button className="button button-ghost" onClick={() => navigate("home")}>Back to home</button></div><div className="confirmation-demo"><Sparkles size={14} /> This is a demo confirmation. No request was sent to a live IT system.</div></section>}

        {view === "requests" && <section className="surface-card requests-panel"><div className="requests-toolbar"><div><span className="section-kicker">YOUR ACTIVITY</span><h2>Request history <span>{requests.length}</span></h2></div><button className="button button-primary" onClick={() => startRequest()}><Send size={15} /> New request</button></div><div className="request-table-wrap"><table className="request-table"><thead><tr><th>REQUEST</th><th>SUBJECT</th><th>CATEGORY</th><th>SUBMITTED</th><th>PRIORITY</th><th>STATUS</th><th aria-label="Open details" /></tr></thead><tbody>{[...requests].reverse().map((request) => <tr key={request.id} onClick={() => openRequest(request.id)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && openRequest(request.id)}><td className="request-number">{request.id}</td><td className="request-subject">{request.subject}</td><td>{request.category}</td><td>{request.submitted}</td><td><Badge>{request.priority}</Badge></td><td><Badge>{request.status}</Badge></td><td><ArrowRight size={16} className="table-arrow" /></td></tr>)}</tbody></table></div><div className="request-table-mobile">{[...requests].reverse().map((request) => <button key={request.id} onClick={() => openRequest(request.id)}><span className="mobile-request-top"><b>{request.id}</b><Badge>{request.status}</Badge></span><strong>{request.subject}</strong><span className="mobile-request-meta">{request.category} <span>·</span> {request.submitted}</span><ArrowRight size={16} /></button>)}</div><div className="list-footer"><span><ShieldCheck size={14} /> Only you can see your requests in this demo.</span><button className="text-link" onClick={() => navigate("contact")}>Need a hand? Contact IT <ArrowRight size={14} /></button></div></section>}

        {view === "details" && selectedRequest && <section className="detail-layout"><div className="surface-card detail-main"><button className="back-link" onClick={() => navigate("requests")}><ArrowLeft size={15} /> Back to my requests</button><div className="detail-title-row"><div><span className="section-kicker">{selectedRequest.id}</span><h2>{selectedRequest.subject}</h2></div><Badge>{selectedRequest.status}</Badge></div><p className="detail-description">{selectedRequest.description}</p><div className="detail-properties"><div><span>CATEGORY</span><strong>{selectedRequest.category}</strong></div><div><span>PRIORITY</span><Badge>{selectedRequest.priority}</Badge></div><div><span>SUBMITTED</span><strong>{selectedRequest.submitted}</strong></div><div><span>LOCATION</span><strong>{selectedRequest.location || "Not specified"}</strong></div></div><div className="activity-heading"><div><span className="section-kicker">WHAT’S HAPPENING</span><h3>Updates</h3></div><span className="activity-count">{selectedRequest.updates.length} updates</span></div><div className="timeline">{selectedRequest.updates.map((update, index) => <div className="timeline-item" key={`${update}-${index}`}><span className={`timeline-dot ${index === 0 ? "timeline-dot-first" : ""}`} /><span>{update}</span></div>)}</div><div className="comment-box"><label className="field-label" htmlFor="comment">Add a comment</label><textarea id="comment" rows={3} placeholder="Share any extra details with IT Support…" value={comment} onChange={(e) => setComment(e.target.value)} /><button className="button button-primary" onClick={addComment} disabled={!comment.trim()}>Add comment <ArrowRight size={15} /></button></div></div><aside className="detail-side"><div className="aside-card"><span className="section-kicker">REQUEST OWNER</span><div className="assigned-person"><span className="assigned-icon"><Headphones size={17} /></span><div><strong>{selectedRequest.assigned}</strong><span>Support team</span></div></div><div className="side-divider" /><span className="side-meta-label">PREFERRED CONTACT</span><strong>{selectedRequest.contact}</strong></div><div className="aside-card close-card"><span className="section-kicker">ALL TAKEN CARE OF?</span><p>If you no longer need help, you can close this request.</p><button className="button button-outline" disabled={selectedRequest.status === "Closed" || selectedRequest.status === "Resolved"} onClick={closeRequest}>{selectedRequest.status === "Closed" || selectedRequest.status === "Resolved" ? "Request complete" : "Close request"}</button></div></aside></section>}

        {view === "knowledge" && <><div className="knowledge-search"><Search size={18} /><input aria-label="Search help articles" placeholder="Search for an IT issue…" value={search} onChange={(e) => setSearch(e.target.value)} /><span>Try “password” or “Wi-Fi”</span></div><section className="knowledge-layout"><div className="article-list surface-card"><div className="article-list-heading"><div><span className="section-kicker">HELPFUL GUIDES</span><h2>{search ? `${filteredArticles.length} results` : "Browse all articles"}</h2></div><span>{filteredArticles.length} articles</span></div>{filteredArticles.length ? filteredArticles.map((article, index) => <button className="article-row" key={article.title} onClick={() => { setSelectedArticle(article); navigate("article"); }}><span className={`article-icon article-icon-${index % 3}`}><FileText size={17} /></span><span><b>{article.title}</b><small>{article.category} <span>·</span> 3 min read</small></span><ArrowRight size={16} /></button>) : <div className="empty-state"><Search size={20} /><strong>No articles found</strong><span>Try another search, or submit a request and we’ll help.</span><button className="text-link" onClick={() => startRequest()}>Submit a request <ArrowRight size={14} /></button></div>}</div><aside className="knowledge-side"><div className="aside-card"><span className="section-kicker">BROWSE BY TOPIC</span>{["Account & Access", "Microsoft 365", "ADP", "Hardware", "Network", "Security"].map((topic) => <button className="topic-link" key={topic} onClick={() => setSearch(topic)}>{topic}<ArrowRight size={14} /></button>)}</div><div className="aside-card knowledge-ask"><IconTile tint="gold"><MessageCircle size={17} /></IconTile><h3>Still looking for an answer?</h3><p>Send us a note. We’re happy to help.</p><button className="text-link" onClick={() => startRequest()}>Ask IT Support <ArrowRight size={14} /></button></div></aside></section></>}

        {view === "article" && <section className="article-detail surface-card"><button className="back-link" onClick={() => navigate("knowledge")}><ArrowLeft size={15} /> All help articles</button><span className="article-category-pill">{selectedArticle.category.toUpperCase()} <span>·</span> 3 MIN READ</span><h2>{selectedArticle.title}</h2><div className="sample-note"><Sparkles size={15} /><span><b>Sample article</b> · Demo guidance for preview purposes. Replace with approved On Lok documentation before production use.</span></div><p className="article-lead">A few simple things to check before you request more help:</p><ol className="article-steps"><li><span>1</span><div><b>Check your username</b><p>Make sure you are using the correct username for your account.</p></div></li><li><span>2</span><div><b>Check your password</b><p>Confirm your password is correct and try entering it again carefully.</p></div></li><li><span>3</span><div><b>Complete multi-factor authentication</b><p>Follow any prompts to verify your identity.</p></div></li><li><span>4</span><div><b>Try signing in again</b><p>Close the sign-in page, reopen it, and try once more.</p></div></li><li><span>5</span><div><b>Still having trouble?</b><p>Submit an IT Support request so the team can take a closer look.</p></div></li></ol><div className="article-bottom"><div><strong>Still need a hand?</strong><span>We’re happy to help you work through it.</span></div><button className="button button-primary" onClick={() => startRequest(selectedArticle.category)}>Submit a request <ArrowRight size={15} /></button></div></section>}

        {view === "contact" && <><section className="contact-intro surface-card"><IconTile tint="blue"><Headphones size={20} /></IconTile><div><span className="section-kicker">HERE WHEN YOU NEED US</span><h2>Choose what works for you.</h2><p>For urgent issues, use the approved On Lok support channel. The details below are placeholders for this demo.</p></div></section><div className="contact-grid"><article className="contact-card"><IconTile><LifeBuoy size={20} /></IconTile><span className="section-kicker">ONLINE, ANYTIME</span><h3>IT Support Portal</h3><p>Submit an issue and keep an eye on it from one place.</p><button className="text-link" onClick={() => startRequest()}>Submit a request <ArrowRight size={15} /></button></article><article className="contact-card"><IconTile tint="blue"><Smartphone size={20} /></IconTile><span className="section-kicker">GIVE US A CALL</span><h3>Phone support</h3><p>For a time-sensitive issue, call your IT Support team.</p><div className="contact-placeholder">[Official IT Support Number]</div></article><article className="contact-card"><IconTile tint="gold"><Mail size={20} /></IconTile><span className="section-kicker">DROP US A NOTE</span><h3>Email support</h3><p>Send a message and the team will follow up.</p><div className="contact-placeholder">[Official IT Support Email]</div></article><article className="contact-card"><IconTile tint="rose"><MessageCircle size={20} /></IconTile><span className="section-kicker">CHAT WITH THE TEAM</span><h3>Microsoft Teams</h3><p>Reach out through your approved support channel.</p><div className="contact-placeholder">[Official IT Support Teams Channel]</div></article></div><div className="contact-note"><ShieldCheck size={16} /><span>Contact details have been left as placeholders. Please confirm the approved support channels before sharing this portal.</span></div></>}
      </main>

      <footer className="site-footer"><div className="footer-main"><button className="brand footer-brand" onClick={() => navigate("home")}><span className="brand-symbol" aria-hidden="true"><span /><span /><span /></span><span className="brand-text"><strong>On Lok</strong><span>IT SUPPORT PORTAL</span></span></button><p>Helpful technology support,<br />one step at a time.</p><nav aria-label="Footer navigation">{navItems.map(([label, target]) => <button key={label} onClick={() => target === "submit" ? startRequest() : navigate(target)}>{label}</button>)}</nav></div><div className="footer-bottom"><span>© On Lok · IT Support Portal</span><span className="footer-demo"><span /> Prototype / Demo</span><span>Sample experience · No live systems connected</span></div></footer>
      <a href="#main-content" className="skip-link">Skip to main content</a>
    </div>
  );
}
