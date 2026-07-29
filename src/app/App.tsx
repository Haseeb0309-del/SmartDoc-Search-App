import { useState, useMemo, useRef, useEffect } from "react";
import AuthPage from "./AuthPage";
import AdminPanel from "./AdminPanel";
import {
  Search, X, ArrowLeft, Users, Monitor, DollarSign,
  Clock, FileText, SlidersHorizontal, ChevronRight, ChevronDown,
  AlertCircle, BookOpen, RefreshCw, Sparkles, Home,
  Edit2, Trash2, LogOut, ShieldAlert, Mail, User, Settings, ShieldCheck, Calendar
} from "lucide-react";

type Category = "HR" | "IT" | "Finance";
type View = "dashboard" | "results" | "detail" | "admin";

interface Doc {
  id: string;
  title: string;
  category: Category;
  snippet: string;
  content: string[];
  lastUpdated: string;
}

const DOCS: Doc[] = [
  {
    id: "hr-1",
    title: "Employee Handbook 2024",
    category: "HR",
    snippet: "A comprehensive guide covering employment policies, workplace conduct, benefits, and company culture expectations for all Nexus Solutions employees.",
    content: [
      "Welcome to Nexus Solutions. This handbook outlines the policies and procedures that govern your employment relationship with us. Please read it carefully and keep it accessible throughout your tenure.",
      "Code of Conduct — All employees are expected to maintain the highest standards of professional conduct. This includes treating colleagues, clients, and vendors with respect and integrity at all times. Violations may result in disciplinary action up to and including termination.",
      "Working Hours — Standard working hours are 9:00 AM to 6:00 PM, Monday through Friday. Flexible arrangements may be available with manager approval and documented in writing with HR.",
      "Benefits Overview — Nexus Solutions offers a comprehensive benefits package including health, dental, and vision insurance; a 401(k) plan with 4% company match; 20 days of paid time off annually; and a $1,200 annual wellness stipend.",
      "Remote Work — Eligible employees may work remotely up to three days per week. Remote work eligibility is determined by role requirements and manager discretion. All remote workers must follow the Remote Work Policy.",
    ],
    lastUpdated: "March 15, 2024",
  },
  {
    id: "hr-2",
    title: "Remote Work Policy",
    category: "HR",
    snippet: "Guidelines for employees working remotely, including eligibility criteria, equipment provisions, security requirements, and communication expectations.",
    content: [
      "Nexus Solutions supports flexible work arrangements that enable employees to be productive while maintaining work-life balance. This policy applies to all employees with approved remote work agreements.",
      "Eligibility — Employees who have completed their 90-day onboarding period and whose role permits remote work are eligible to apply. Submit a Remote Work Request via Workday for manager and HR approval.",
      "Equipment — Nexus Solutions will provide a laptop and necessary peripherals. Employees are responsible for a suitable home office environment with reliable internet access (minimum 50 Mbps download / 20 Mbps upload).",
      "Communication Standards — Remote employees must be reachable during core hours (10 AM–3 PM local time) via Slack and email. Video presence is required for all team meetings. Camera-off requires explicit manager approval.",
      "Security Requirements — All remote connections must use the company VPN. Work files must not be stored on personal devices or personal cloud accounts. See the IT Security Guidelines for full requirements.",
    ],
    lastUpdated: "January 8, 2024",
  },
  {
    id: "hr-3",
    title: "PTO & Leave Guidelines",
    category: "HR",
    snippet: "Details on paid time off accrual, parental leave, sick leave, and the process for requesting time away from work.",
    content: [
      "Nexus Solutions provides generous paid leave to support employee well-being and work-life balance. All leave types described here apply to full-time employees; part-time employees receive pro-rated amounts.",
      "PTO Accrual — Full-time employees accrue 1.67 days of PTO per month (20 days annually). Unused PTO rolls over up to a maximum of 30 days. PTO balance is visible in Workday.",
      "Parental Leave — Primary caregivers receive 16 weeks of fully paid parental leave. Secondary caregivers receive 8 weeks of fully paid parental leave. Leave must begin within 12 months of birth or adoption.",
      "Sick Leave — Employees receive 10 sick days per year, which do not roll over. Notify your manager and HR before your shift begins when possible. A doctor's note may be required for absences exceeding three consecutive days.",
      "Requesting Time Off — All PTO requests must be submitted through Workday at least two weeks in advance for planned absences. Requests are subject to manager approval based on business needs. Emergency leave requests are handled case-by-case.",
    ],
    lastUpdated: "February 20, 2024",
  },
  {
    id: "hr-4",
    title: "Performance Review Process",
    category: "HR",
    snippet: "Overview of Nexus Solutions's annual performance review cycle, rating scales, goal-setting framework, and compensation adjustment timelines.",
    content: [
      "The annual performance review process at Nexus Solutions is designed to recognize achievements, provide constructive feedback, and align individual goals with company objectives.",
      "Review Cycle — Performance reviews take place annually in December, with mid-year check-ins in June. Both manager and employee complete self-assessments before the formal review meeting.",
      "Rating Scale — Performance is rated on a 5-point scale: 1 (Does Not Meet Expectations), 2 (Partially Meets), 3 (Meets Expectations), 4 (Exceeds Expectations), 5 (Outstanding). Ratings of 4 or 5 are recognized in the compensation cycle.",
      "Goal Setting — Each employee sets 3–5 SMART goals for the year in collaboration with their manager. Goals are entered into Workday by January 31st and may be adjusted at mid-year with manager approval.",
      "Compensation Adjustments — Merit increases take effect February 1st following the review. The compensation adjustment budget is determined annually by the CFO and communicated to managers in November.",
    ],
    lastUpdated: "November 5, 2023",
  },
  {
    id: "it-1",
    title: "VPN Setup Guide",
    category: "IT",
    snippet: "Step-by-step instructions for installing and configuring the company VPN on Windows, macOS, and mobile devices.",
    content: [
      "Nexus Solutions uses Cisco AnyConnect VPN to secure remote connections to corporate resources. An active VPN connection is required for access to all internal systems when working off-premises.",
      "Windows Installation — Navigate to the IT Self-Service portal at portal.nexussolutions.internal. Download the Cisco AnyConnect installer. Run the installer with administrator privileges. Enter the server address vpn.nexussolutions.in. Authenticate with your corporate SSO credentials.",
      "macOS Installation — Download AnyConnect from the Self-Service portal. Open the .dmg file and follow the installation prompts. Grant necessary system permissions when prompted in System Preferences > Security & Privacy. Connect to vpn.nexussolutions.in using your SSO credentials.",
      "Mobile Devices — Install Cisco AnyConnect from the App Store or Google Play. Add a new VPN connection with server address vpn.nexussolutions.in. Use your standard SSO credentials to authenticate. Mobile VPN access requires enrollment in the MDM program.",
      "Troubleshooting — If you experience connection issues, first verify your internet connection is active. Try disconnecting and reconnecting. If issues persist, contact the IT Help Desk at helpdesk@nexussolutions.in or ext. 4357 (available Mon–Fri, 8 AM–8 PM).",
    ],
    lastUpdated: "April 2, 2024",
  },
  {
    id: "it-2",
    title: "IT Security Guidelines",
    category: "IT",
    snippet: "Essential security practices for all employees covering password management, phishing awareness, MFA requirements, and data handling procedures.",
    content: [
      "Information security is everyone's responsibility. These guidelines apply to all Nexus Solutions employees, contractors, and vendors with access to company systems. Non-compliance may result in disciplinary action.",
      "Password Management — All passwords must be at least 14 characters and include uppercase, lowercase, numbers, and symbols. Passwords must be changed every 90 days. Use the company-approved password manager 1Password for all work credentials. Never reuse passwords across accounts.",
      "Multi-Factor Authentication — MFA is mandatory for all corporate accounts including email, Slack, and cloud services. Use the Microsoft Authenticator app for MFA tokens. Never share MFA codes with anyone, including IT staff. IT will never ask for your MFA code.",
      "Phishing Awareness — Be suspicious of unexpected emails requesting login credentials or urgent action. Verify sender addresses carefully. Report suspicious emails to security@nexussolutions.in using the Report Phishing button in Outlook. Do not click links or open attachments in suspicious emails.",
      "Data Classification — All company data must be classified as Public, Internal, Confidential, or Restricted. Restricted data (e.g., PII, financial records, trade secrets) must be encrypted at rest and in transit. Do not store Restricted data on personal devices or unapproved cloud services.",
    ],
    lastUpdated: "March 30, 2024",
  },
  {
    id: "it-3",
    title: "Software Procurement Policy",
    category: "IT",
    snippet: "Process for requesting and approving new software tools, including budget thresholds, security review requirements, and the approved vendor list.",
    content: [
      "This policy ensures all software acquired by Nexus Solutions is properly evaluated, licensed, and aligned with security and compliance requirements. Shadow IT — using unauthorized software for company work — is strictly prohibited.",
      "Request Process — Submit a Software Request via the IT Service Desk portal at help.nexussolutions.internal. IT will perform a security and compatibility review within 5 business days. You will receive email updates on your request status.",
      "Approval Thresholds — Requests under $500/year may be approved by direct managers. Requests $500–$5,000/year require VP-level approval. Requests over $5,000/year require CFO sign-off. Annual aggregate spend is monitored quarterly.",
      "Approved Vendors — A list of pre-approved software vendors is maintained on the IT intranet. Purchasing from approved vendors typically reduces procurement time from 10 days to 2 days. Common tools (Figma, Miro, Notion, Zoom) are pre-approved for standard plan tiers.",
      "Open Source Software — Open source tools used in production code require a license review by Legal. Copyleft licenses (GPL, AGPL) require explicit Legal approval before use. Permissive licenses (MIT, Apache 2.0) are generally pre-approved.",
    ],
    lastUpdated: "December 12, 2023",
  },
  {
    id: "fin-1",
    title: "Expense Reimbursement Policy",
    category: "Finance",
    snippet: "How to submit expenses for reimbursement, approved expense categories, receipt requirements, and processing timelines.",
    content: [
      "Nexus Solutions reimburses employees for reasonable and necessary business expenses incurred while performing company business. All expenses must have a clear business purpose and comply with this policy.",
      "Submission Process — All expense reports must be submitted through Concur within 30 days of the expense date. Late submissions may not be reimbursed. Managers must approve reports within 5 business days of submission.",
      "Approved Categories & Limits — Business meals: up to $75/person with clients, $50/person internal. Ground transportation: economy class required. Air travel: economy class required; business class permitted for flights over 8 hours with VP+ approval. Hotel: up to $250/night standard markets, $350/night in NYC, SF, London, and Tokyo.",
      "Receipt Requirements — Itemized receipts are required for all expenses over $25. Credit card statements are not acceptable substitutes. For meals, include a list of attendees and business purpose in the notes field. Lost receipts require a Lost Receipt Affidavit signed by your manager.",
      "Processing Timeline — Approved expenses are reimbursed within 5–7 business days via direct deposit to your account on file. International wire reimbursements may take up to 10 business days. Contact AP@nexussolutions.in for payment status inquiries.",
    ],
    lastUpdated: "February 1, 2024",
  },
  {
    id: "fin-2",
    title: "Travel & Entertainment Policy",
    category: "Finance",
    snippet: "Guidelines for booking business travel, per diem rates, entertainment expenses, and compliance with company spending limits.",
    content: [
      "Nexus Solutions's Travel & Entertainment Policy ensures business travel is conducted efficiently and cost-effectively while maintaining employee safety and comfort. All travel must have a documented business purpose.",
      "Booking Travel — All business travel must be booked through Concur Travel or the designated travel agency (Carlson Wagonlit). Personal bookings will not be reimbursed unless pre-approved in writing by your VP. Book at least 14 days in advance when possible to minimize cost.",
      "Per Diem Rates — Meal per diem is $75/day domestic and $90/day international. No receipts are required when claiming per diem. Choose either per diem or actual expenses — not a combination. Per diem may be adjusted downward if meals are provided by the conference or client.",
      "Client Entertainment — Entertainment must have a clear business purpose documented in Concur. Alcohol may be included at a maximum of 20% of total meal cost. Entertainment over $500 requires pre-approval via the Entertainment Approval Form. Gifts to clients are capped at $75/person/year.",
      "International Travel — All international travel requires VP approval at least 10 business days before departure. Notify both HR and IT for international trips to ensure travel safety briefing and device security compliance. Country-specific security advisories are available on the Travel Safety intranet page.",
    ],
    lastUpdated: "January 15, 2024",
  },
  {
    id: "fin-3",
    title: "Budget Planning Guide FY2025",
    category: "Finance",
    snippet: "The annual budget planning process, timelines, department head responsibilities, and how to submit and revise budget proposals for fiscal year 2025.",
    content: [
      "The FY2025 budget planning process follows a zero-based budgeting methodology, requiring all departments to justify each line item from first principles rather than incremental adjustments from prior-year actuals.",
      "Key Dates — August 1: Finance distributes planning templates. September 15: Initial submissions due. October 1–15: Finance review and feedback cycle. November 1: Revised submissions due. December 1: Executive approval and final budgets communicated to department heads.",
      "Submission Requirements — Budget submissions must include: headcount plans with role titles and FTEs; OpEx by category (software, travel, training, contractors, other); CapEx requests with ROI justification; and a one-page executive summary of key assumptions and strategic priorities.",
      "Zero-Based Budgeting — All departments are required to justify each line item from scratch. Reference prior year actuals for context only. Resource allocation decisions should reflect current strategic priorities, not historical inertia. Finance will challenge any line item without clear business justification.",
      "Variance Reporting — Department heads are responsible for monthly budget-vs-actual variance reports submitted to Finance by the 10th of each month. Variances over 10% require a written explanation and a reforecast. Departments with consistent >15% overruns will be subject to quarterly Finance business reviews.",
    ],
    lastUpdated: "July 3, 2024",
  },
];

const RECENTLY_VIEWED_IDS = ["hr-1", "it-1", "fin-1", "hr-3", "it-2"];

const CAT_CONFIG: Record<Category, {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  tagBg: string;
  tagText: string;
  tagBorder: string;
  desc: string;
}> = {
  HR: {
    icon: Users,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
    tagBg: "bg-emerald-50",
    tagText: "text-emerald-700",
    tagBorder: "border-emerald-200",
    desc: "Policies, benefits, leave, and workplace guidelines",
  },
  IT: {
    icon: Monitor,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
    tagBg: "bg-blue-50",
    tagText: "text-blue-700",
    tagBorder: "border-blue-200",
    desc: "Tech support, security, software, and infrastructure",
  },
  Finance: {
    icon: DollarSign,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
    tagBg: "bg-amber-50",
    tagText: "text-amber-700",
    tagBorder: "border-amber-200",
    desc: "Expenses, budgets, procurement, and travel",
  },
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// ─── Category Tag ────────────────────────────────────────────────────────────
function CategoryTag({ category }: { category: Category }) {
  const cfg = CAT_CONFIG[category];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.tagBg} ${cfg.tagText} ${cfg.tagBorder}`}
    >
      {category}
    </span>
  );
}

// ─── Search Input ─────────────────────────────────────────────────────────────
function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  size = "md",
  autoFocus = false,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
  placeholder?: string;
  size?: "md" | "lg";
  autoFocus?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    try {
      const hist = JSON.parse(localStorage.getItem("search_history") || "[]");
      setHistory(hist);
    } catch (e) {}
  }, [value, showDropdown]);

  useEffect(() => {
    if (!value || value.length < 2) {
      setSuggestions([]);
      return;
    }
    const delayDebounce = setTimeout(() => {
      fetch("/autocomplete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: value, top: 5 })
      })
        .then(res => res.ok ? res.json() : { suggestions: [] })
        .then(data => {
          if (data && data.suggestions) {
            setSuggestions(data.suggestions);
          }
        })
        .catch(() => {});
    }, 200);
    return () => clearTimeout(delayDebounce);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSubmit(value);
      setShowDropdown(false);
    }
  };

  return (
    <div ref={containerRef} className="relative flex items-center w-full group">
      <Search
        className={`absolute left-4 text-muted-foreground pointer-events-none transition-colors group-focus-within:text-accent ${size === "lg" ? "size-5" : "size-4"}`}
      />
      <input
        ref={ref}
        type="text"
        value={value}
        onFocus={() => setShowDropdown(true)}
        onChange={(e) => {
          onChange(e.target.value);
          setShowDropdown(true);
        }}
        onKeyDown={handleKey}
        placeholder={placeholder ?? "Search documents…"}
        className={`w-full bg-white border border-border rounded-xl pl-11 pr-12 outline-none transition-all
          placeholder:text-muted-foreground text-foreground
          focus:border-accent focus:ring-2 focus:ring-accent/15
          ${size === "lg" ? "py-4 text-base shadow-sm" : "py-2.5 text-sm shadow-sm"}`}
      />
      {value && (
        <button
          onClick={() => {
            onChange("");
            setSuggestions([]);
          }}
          className="absolute right-12 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="size-3.5" />
        </button>
      )}
      <button
        onClick={() => {
          onSubmit(value);
          setShowDropdown(false);
        }}
        className={`absolute right-2 bg-primary text-primary-foreground rounded-lg transition-all hover:bg-accent active:scale-95
          ${size === "lg" ? "px-3 py-2 text-sm" : "px-2.5 py-1.5 text-xs"} font-medium`}
      >
        Search
      </button>

      {showDropdown && (suggestions.length > 0 || history.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-border rounded-xl shadow-lg z-50 overflow-hidden py-2 max-h-60 overflow-y-auto">
          {suggestions.length > 0 ? (
            <div>
              <div className="px-3 py-1.5 text-xs font-semibold text-accent uppercase tracking-wider bg-accent/5 flex items-center gap-1.5">
                <Sparkles className="size-3" /> Suggestions
              </div>
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onChange(s);
                    onSubmit(s);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <Search className="size-3.5 text-muted-foreground" />
                  {s}
                </button>
              ))}
            </div>
          ) : null}
          {history.length > 0 && suggestions.length === 0 ? (
            <div>
              <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/30 flex items-center gap-1.5">
                <Clock className="size-3" /> Recent Searches
              </div>
              {history.map((h, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onChange(h);
                    onSubmit(h);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <Search className="size-3.5 text-muted-foreground/50" />
                  {h}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}


// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({
  onLogoClick,
  view,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onDraftClick,
  onAdminClick,
  onLogout,
  userName,
  userEmail,
  onProfileClick,
}: {
  onLogoClick: () => void;
  view: View;
  searchValue: string;
  onSearchChange: (v: string) => void;
  onSearchSubmit: (v: string) => void;
  onDraftClick: () => void;
  onAdminClick: () => void;
  onLogout: () => void;
  userName: string;
  userEmail: string;
  onProfileClick: () => void;
}) {
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/health")
      .then(res => res.ok ? res.json() : null)
      .then(data => setServerOnline(data?.status === "online"))
      .catch(() => setServerOnline(false));
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = userName.split(' ').map(n => n.charAt(0).toUpperCase()).join('').slice(0, 2);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border h-14 flex items-center">
      <div className="max-w-[1440px] w-full mx-auto px-6 md:px-10 flex items-center gap-3">
        {/* Logo */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2 shrink-0 group"
        >
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center shadow-sm group-hover:bg-accent transition-colors">
            <BookOpen className="size-4 text-white" />
          </div>
          <span className="font-semibold text-foreground text-sm hidden sm:block tracking-tight">
            Smart<span className="text-accent">Doc</span>
          </span>
        </button>

        {/* Separator */}
        <div className="hidden sm:block w-px h-6 bg-border" />

        {/* Server status */}
        <div
          title={serverOnline === null ? "Checking server..." : serverOnline ? "ML Server: Online" : "ML Server: Offline"}
          className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
        >
          <div className={`size-1.5 rounded-full ${serverOnline === null ? "bg-slate-400 animate-pulse" : serverOnline ? "bg-emerald-500" : "bg-red-500"}`} />
          <span className="hidden lg:inline text-muted-foreground">
            {serverOnline === null ? "Connecting" : serverOnline ? "AI Ready" : "Offline"}
          </span>
        </div>

        {/* Center search (visible on results/detail) */}
        {(view === "results" || view === "detail") && (
          <div className="flex-1 max-w-xl mx-auto hidden md:block">
            <SearchInput
              value={searchValue}
              onChange={onSearchChange}
              onSubmit={onSearchSubmit}
              placeholder="Search documents…"
              size="md"
            />
          </div>
        )}

        <div className="flex-1 md:flex-none" />

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Draft button */}
          <button
            onClick={onDraftClick}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-accent hover:bg-accent/90 px-3 py-1.5 rounded-lg transition-all active:scale-95 shadow-sm"
          >
            <Sparkles className="size-3.5" />
            <span className="hidden sm:inline">New Draft</span>
          </button>

          {/* Admin button */}
          <button
            onClick={onAdminClick}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted px-2.5 py-1.5 rounded-lg transition-all"
          >
            <ShieldAlert className="size-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </button>

          {/* Separator */}
          <div className="w-px h-6 bg-border mx-0.5" />

          {/* User profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted/60 transition-all"
            >
              <div className="size-7 rounded-full bg-primary flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-semibold">{initials}</span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-medium text-foreground leading-tight">{userName}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{userEmail}</p>
              </div>
              <ChevronDown className={`size-3 text-muted-foreground hidden md:block transition-transform ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl border border-border shadow-xl py-2 animate-scale-in z-50">
                {/* User info section */}
                <div 
                  onClick={() => { onProfileClick(); setProfileOpen(false); }}
                  className="px-4 py-3 border-b border-border hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-primary flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-semibold">{initials}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{userName}</p>
                      <p className="text-xs text-muted-foreground">{userEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <button
                    onClick={() => { onProfileClick(); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors text-left"
                  >
                    <User className="size-4 text-muted-foreground" />
                    My Profile Details
                  </button>
                  <button
                    onClick={() => { onAdminClick(); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors text-left"
                  >
                    <ShieldAlert className="size-4 text-muted-foreground" />
                    Admin Dashboard
                  </button>
                  <button
                    onClick={() => { onDraftClick(); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors text-left"
                  >
                    <Sparkles className="size-4 text-muted-foreground" />
                    Draft Document
                  </button>
                </div>

                <div className="border-t border-border pt-1">
                  <button
                    onClick={() => { onLogout(); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="size-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-border p-5 shadow-sm animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="h-4 bg-muted rounded w-16" />
        <div className="h-4 bg-muted rounded w-10" />
      </div>
      <div className="h-5 bg-muted rounded w-3/4 mb-2" />
      <div className="h-4 bg-muted rounded w-full mb-1.5" />
      <div className="h-4 bg-muted rounded w-5/6" />
    </div>
  );
}

function SkeletonRecentCard() {
  return (
    <div className="bg-white rounded-xl border border-border p-4 min-w-48 animate-pulse">
      <div className="h-3 bg-muted rounded w-12 mb-3" />
      <div className="h-4 bg-muted rounded w-full mb-1.5" />
      <div className="h-3 bg-muted rounded w-3/4" />
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onCategoryClick,
  onDocClick,
  recentDocs,
  docs,
  userName,
}: {
  searchValue: string;
  onSearchChange: (v: string) => void;
  onSearchSubmit: (v: string) => void;
  onCategoryClick: (cat: Category) => void;
  onDocClick: (doc: Doc) => void;
  recentDocs: Doc[];
  docs: Doc[];
  userName: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastName = userName.split(' ').pop() || userName;

  return (
    <main className="max-w-[1440px] mx-auto px-6 md:px-10 py-10 md:py-16">
      {/* Welcome Hero */}
      <section className="mb-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-medium text-accent mb-2 tracking-wide uppercase">
            {getGreeting()}, {lastName}
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-2 tracking-tight">
            What are you looking for today?
          </h1>
          <p className="text-muted-foreground mb-8 text-base">
            Search across HR, IT, and Finance documents — or browse by category below.
          </p>
          <SearchInput
            value={searchValue}
            onChange={onSearchChange}
            onSubmit={onSearchSubmit}
            placeholder="Ask anything about company policies, IT, or finance…"
            size="lg"
            autoFocus
          />
          <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
            {["expense reimbursement", "VPN setup", "parental leave", "budget planning"].map((s) => (
              <button
                key={s}
                onClick={() => onSearchSubmit(s)}
                className="text-xs text-muted-foreground border border-border rounded-full px-3 py-1.5 bg-white hover:border-accent hover:text-accent transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
          Browse by category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(["HR", "IT", "Finance"] as Category[]).map((cat) => {
            const cfg = CAT_CONFIG[cat];
            const Icon = cfg.icon;
            const count = docs.filter((d) => d.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => onCategoryClick(cat)}
                className="group bg-white border border-border rounded-2xl p-6 text-left hover:border-accent hover:shadow-md transition-all duration-200 shadow-sm"
              >
                <div className={`size-11 rounded-xl ${cfg.iconBg} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                  <Icon className={`size-5 ${cfg.iconColor}`} />
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-semibold text-foreground text-base">{cat}</h3>
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{cfg.desc}</p>
                <p className={`text-xs font-medium mt-3 ${cfg.iconColor}`}>{count} documents</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Recently Viewed */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="size-4 text-muted-foreground" />
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Recently viewed
          </h2>
        </div>
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {recentDocs.map((doc) => {
            const cfg = CAT_CONFIG[doc.category];
            return (
              <button
                key={doc.id}
                onClick={() => onDocClick(doc)}
                className="group bg-white border border-border rounded-xl p-4 text-left min-w-[220px] max-w-[260px] hover:border-accent hover:shadow-md transition-all duration-200 shadow-sm shrink-0"
              >
                <CategoryTag category={doc.category} />
                <p className="text-sm font-medium text-foreground mt-2.5 mb-1 line-clamp-2 leading-snug group-hover:text-accent transition-colors">
                  {doc.title}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3" />
                  {doc.lastUpdated}
                </p>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}

// ─── Results ──────────────────────────────────────────────────────────────────
function Results({
  query,
  results,
  totalCount,
  currentPage,
  setCurrentPage,
  sortBy,
  setSortBy,
  loading,
  filters,
  onToggleFilter,
  onClearFilters,
  onDocClick,
  onBackToHome,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  docs,
  predictedCategory,
  azureResults,
  azureSearchActive,
}: {
  query: string;
  results: Doc[];
  totalCount: number;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  loading: boolean;
  filters: Category[];
  onToggleFilter: (c: Category) => void;
  onClearFilters: () => void;
  onDocClick: (doc: Doc) => void;
  onBackToHome: () => void;
  searchValue: string;
  onSearchChange: (v: string) => void;
  onSearchSubmit: (v: string) => void;
  docs: Doc[];
  predictedCategory: Category | null;
  azureResults: { id: string; text: string; category: string; snippet: string; score: number }[] | null;
  azureSearchActive: boolean;
}) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categoryCounts = useMemo(() => {
    const allFiltered = docs.filter((d) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.snippet.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      );
    });
    return {
      HR: allFiltered.filter((d) => d.category === "HR").length,
      IT: allFiltered.filter((d) => d.category === "IT").length,
      Finance: allFiltered.filter((d) => d.category === "Finance").length,
    };
  }, [query, docs]);

  const SidebarContent = () => (
    <>
      {/* Back to Home */}
      <button
        onClick={onBackToHome}
        className="flex items-center gap-2 w-full px-3 py-2.5 mb-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors group"
      >
        <Home className="size-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Home
      </button>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Filters
        </h3>
        {filters.length > 0 && (
          <button
            onClick={onClearFilters}
            className="text-xs text-accent hover:text-primary transition-colors font-medium"
          >
            Clear all
          </button>
        )}
      </div>
      <p className="text-xs font-medium text-foreground mb-3">Category</p>
      <div className="flex flex-col gap-2">
        {(["HR", "IT", "Finance"] as Category[]).map((cat) => {
          const cfg = CAT_CONFIG[cat];
          const Icon = cfg.icon;
          const count = categoryCounts[cat];
          const checked = filters.includes(cat);
          return (
            <label
              key={cat}
              className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all ${
                checked ? "bg-secondary border border-accent/20" : "hover:bg-muted"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggleFilter(cat)}
                className="sr-only"
              />
              <div
                className={`size-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                  checked
                    ? "bg-accent border-accent"
                    : "border-border bg-white"
                }`}
              >
                {checked && (
                  <svg viewBox="0 0 12 10" className="size-2.5 fill-white">
                    <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div className={`size-6 rounded-md ${cfg.iconBg} flex items-center justify-center`}>
                <Icon className={`size-3.5 ${cfg.iconColor}`} />
              </div>
              <span className={`text-sm flex-1 ${checked ? "text-foreground font-medium" : "text-foreground"}`}>
                {cat}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">{count}</span>
            </label>
          );
        })}
      </div>
    </>
  );

  return (
    <main className="max-w-[1440px] mx-auto px-6 md:px-10 py-8">
      {/* Mobile: back to home + search bar */}
      <div className="md:hidden mb-5 space-y-3">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <Home className="size-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </button>
        <SearchInput
          value={searchValue}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
          placeholder="Search documents…"
          size="md"
        />
      </div>

      {/* Mobile filter toggle */}
      <div className="md:hidden mb-4 flex items-center gap-2">
        <button
          onClick={() => setMobileFiltersOpen((o) => !o)}
          className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border transition-colors ${
            mobileFiltersOpen || filters.length > 0
              ? "border-accent text-accent bg-secondary"
              : "border-border text-muted-foreground bg-white"
          }`}
        >
          <SlidersHorizontal className="size-3.5" />
          Filters
          {filters.length > 0 && (
            <span className="bg-accent text-white text-xs rounded-full size-4 flex items-center justify-center">
              {filters.length}
            </span>
          )}
        </button>
        {filters.length > 0 && (
          <button onClick={onClearFilters} className="text-xs text-accent font-medium">
            Clear all
          </button>
        )}
      </div>

      {/* Mobile filter panel */}
      {mobileFiltersOpen && (
        <div className="md:hidden bg-white border border-border rounded-xl p-4 mb-5 shadow-sm">
          <SidebarContent />
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm sticky top-20">
            <SidebarContent />
          </div>
        </aside>

        {/* Results column */}
        <div className="flex-1 min-w-0">
          {/* Back button for search results */}
          <button
            onClick={onBackToHome}
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-1.5 rounded-lg border border-border transition-all mb-4 group cursor-pointer"
          >
            <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </button>

          {/* AI Predict Banner */}
          {!loading && predictedCategory && !filters.includes(predictedCategory) && (
            <div className="mb-6 bg-blue-50/70 border border-blue-100/50 rounded-xl p-4 flex items-center justify-between shadow-sm animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Sparkles className="size-4 animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Nexus Solutions AI classifies this query as <span className="font-semibold text-accent">{predictedCategory}</span>.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Filter results to show only {predictedCategory} department documents?
                  </p>
                </div>
              </div>
              <button
                onClick={() => onToggleFilter(predictedCategory)}
                className="text-xs font-semibold text-white bg-accent hover:bg-accent/90 px-3.5 py-2 rounded-lg transition-all active:scale-95 shadow-sm shrink-0"
              >
                Apply Filter
              </button>
            </div>
          )}

          {/* Azure AI Search Results Panel */}
          {!loading && azureSearchActive && azureResults && azureResults.length > 0 && (
            <div className="mb-8 animate-fade-in">
              {/* Section header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="size-5 rounded-md bg-blue-600 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 16 16" className="size-3 fill-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 1.5a6.5 6.5 0 1 0 0 13A6.5 6.5 0 0 0 8 1.5zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"/>
                    <path d="M8 4a.75.75 0 0 1 .75.75v3.5h2a.75.75 0 0 1 0 1.5h-2.75A.75.75 0 0 1 7.25 9V4.75A.75.75 0 0 1 8 4z"/>
                  </svg>
                </div>
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-widest">
                  AI Semantic Search &mdash; Results
                </p>
                <span className="ml-auto text-xs text-muted-foreground bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">
                  {azureResults.length} from index
                </span>
              </div>

              {/* Result cards */}
              <div className="flex flex-col gap-2.5">
                {azureResults.map((hit, i) => {
                  const cat = (hit.category || "HR") as Category;
                  const cfg = CAT_CONFIG[cat] || CAT_CONFIG["HR"];
                  return (
                    <button
                      key={hit.id || i}
                      onClick={() => {
                        const fullDoc = docs.find(d => d.id === hit.id) || {
                          id: hit.id,
                          title: hit.text.split('.')[0] || "Semantic Document",
                          category: cat,
                          snippet: hit.snippet,
                          content: [hit.text],
                          lastUpdated: "Today"
                        };
                        onDocClick(fullDoc);
                      }}
                      className="text-left w-full group bg-gradient-to-r from-blue-50/60 to-white border border-blue-100 rounded-xl p-4 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.tagBg} ${cfg.tagText} ${cfg.tagBorder}`}>
                          {cat}
                        </span>
                        <span className="text-xs text-muted-foreground tabular-nums group-hover:text-blue-600 transition-colors">
                          Score: {hit.score.toFixed(3)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed line-clamp-3">
                        {hit.snippet || hit.text}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mt-6 mb-2">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">Local documents below</span>
                <div className="flex-1 h-px bg-border" />
              </div>
            </div>
          )}

          {/* Result count / query + Sort dropdown */}
          {!loading && (
            <div className="mb-5 flex items-center justify-between gap-2 flex-wrap border-b border-border pb-3">
              {query && (
                <p className="text-sm text-muted-foreground">
                  {totalCount > 0
                    ? <>Showing <span className="font-semibold text-foreground">{totalCount}</span> results for{" "}
                      <span className="font-semibold text-foreground">&ldquo;{query}&rdquo;</span></>
                    : <>No results for <span className="font-semibold text-foreground">&ldquo;{query}&rdquo;</span></>
                  }
                </p>
              )}
              {!query && filters.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{totalCount}</span> documents in{" "}
                  <span className="font-semibold text-foreground">{filters.join(", ")}</span>
                </p>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-muted-foreground">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-border rounded-lg text-xs px-2.5 py-1 outline-none text-foreground cursor-pointer focus:border-accent"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Date Updated</option>
                </select>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && results.length === 0 && (!azureResults || azureResults.length === 0) && (
            <div className="bg-white border border-border rounded-2xl p-12 text-center shadow-sm">
              <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
                <AlertCircle className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No documents found</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try different keywords or
                browse by category.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  onClick={onClearFilters}
                  className="text-sm text-accent font-medium hover:underline"
                >
                  Clear filters
                </button>
                <span className="text-muted-foreground text-xs">or try</span>
                {["expense policy", "VPN guide", "PTO leave"].map((s) => (
                  <button
                    key={s}
                    onClick={() => onSearchSubmit(s)}
                    className="text-xs text-muted-foreground border border-border rounded-full px-3 py-1.5 bg-white hover:border-accent hover:text-accent transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results list */}
          {!loading && results.length > 0 && (
            <div className="flex flex-col gap-3">
              {results.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => onDocClick(doc)}
                  className="group bg-white border border-border rounded-2xl p-5 text-left hover:border-accent hover:shadow-md transition-all duration-200 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <CategoryTag category={doc.category} />
                    <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                      <RefreshCw className="size-3" />
                      {doc.lastUpdated}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1.5 group-hover:text-accent transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {doc.snippet}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Open document <ChevronRight className="size-3" />
                  </div>
                </button>
              ))}

              {/* Pagination controls */}
              {totalCount > 10 && (
                <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-accent disabled:opacity-40 disabled:hover:text-muted-foreground bg-white border border-border px-3 py-1.5 rounded-lg transition-all active:scale-95 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                  >
                    &larr; Previous
                  </button>
                  <span className="text-xs text-muted-foreground font-medium">
                    Page {currentPage} of {Math.ceil(totalCount / 10)}
                  </span>
                  <button
                    disabled={currentPage >= Math.ceil(totalCount / 10)}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-accent disabled:opacity-40 disabled:hover:text-muted-foreground bg-white border border-border px-3 py-1.5 rounded-lg transition-all active:scale-95 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                  >
                    Next &rarr;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// ─── Detail ───────────────────────────────────────────────────────────────────
function Detail({ doc, onBack, onBackToHome, onEdit, onDelete, userEmail, userId }: {
  doc: Doc;
  onBack: () => void;
  onBackToHome: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  userEmail: string;
  userId: string | number;
}) {
  const cfg = CAT_CONFIG[doc.category];
  const Icon = cfg.icon;

  return (
    <main className="max-w-[1440px] mx-auto px-6 md:px-10 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Navigation breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <Home className="size-3.5" />
            <span>Home</span>
          </button>
          <ChevronRight className="size-3 text-muted-foreground" />
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Results
          </button>
          <ChevronRight className="size-3 text-muted-foreground" />
          <span className="text-sm text-foreground font-medium truncate max-w-[200px]">{doc.title}</span>
        </div>

        {/* Document card */}
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-8 py-7 border-b border-border">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <CategoryTag category={doc.category} />
                <h1 className="text-2xl font-semibold text-foreground mt-3 leading-tight">
                  {doc.title}
                </h1>
              </div>
              <div className={`size-12 rounded-xl ${cfg.iconBg} flex items-center justify-center shrink-0`}>
                <Icon className={`size-6 ${cfg.iconColor}`} />
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <RefreshCw className="size-3.5" />
                <span>Last updated {doc.lastUpdated}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <FileText className="size-3.5" />
                <span>{doc.category} Department</span>
              </div>

              <div className="flex items-center gap-2 mt-4 w-full flex-wrap">
                {doc.id.startsWith("custom-") && onEdit && onDelete && (
                  <>
                    <button onClick={onEdit} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 cursor-pointer">
                      <Edit2 className="size-3.5" /> Edit
                    </button>
                    <button onClick={onDelete} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200 cursor-pointer">
                      <Trash2 className="size-3.5" /> Delete
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    const text = `${doc.title}\nCategory: ${doc.category}\nLast Updated: ${doc.lastUpdated}\n\n${doc.content.join("\n\n")}`;
                    const blob = new Blob([text], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${doc.title.replace(/\s+/g, "_")}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="size-3.5 fill-none stroke-current stroke-2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                  Download .txt
                </button>
              </div>

            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-8">
            <div className="prose prose-sm max-w-none">
              {doc.content.map((paragraph, i) => {
                const isHeader = paragraph.includes(" — ");
                if (isHeader) {
                  const [title, ...rest] = paragraph.split(" — ");
                  return (
                    <div key={i} className="mb-5 last:mb-0">
                      <h3 className="font-semibold text-foreground text-base mb-1.5">{title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{rest.join(" — ")}</p>
                    </div>
                  );
                }
                return (
                  <p key={i} className="text-muted-foreground text-sm leading-relaxed mb-5 last:mb-0">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 bg-muted/40 border-t border-border flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Mail className="size-3.5" />
              Questions about this document? Contact the Administrator (ID: #{userId}) at{" "}
              <span className="text-accent font-medium hover:underline cursor-pointer">
                {userEmail}
              </span>
            </p>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors font-medium"
            >
              <ArrowLeft className="size-3" />
              Back to results
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [query, setQuery] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Category[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);

  const [docsList, setDocsList] = useState<Doc[]>(() => {
    try {
      const saved = localStorage.getItem('smart_docs_custom');
      if (saved) return [...JSON.parse(saved), ...DOCS];
    } catch (e) {}
    return DOCS;
  });
  const [predictedCategory, setPredictedCategory] = useState<Category | null>(null);

  // Azure AI Search state
  const [azureResults, setAzureResults] = useState<{ id: string; text: string; category: string; snippet: string; score: number }[] | null>(null);
  const [azureSearchActive, setAzureSearchActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("relevance");

  // Modal State
  const [draftModalOpen, setDraftModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [draftCategory, setDraftCategory] = useState<Category | "">("");
  const [isClassifying, setIsClassifying] = useState(false);
  const [classifyError, setClassifyError] = useState("");
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Stop-words to ignore when splitting natural-language queries into keywords
  const STOP_WORDS = new Set([
    "a","an","the","is","are","was","were","be","been","being",
    "have","has","had","do","does","did","will","would","could","should",
    "may","might","must","can","i","my","me","we","our","you","your",
    "he","she","it","they","them","this","that","these","those",
    "to","of","in","on","at","by","for","with","from","about","how",
    "what","when","where","which","who","why","and","or","but","not",
    "if","so","then","than","up","out","no","its","just","get","go",
  ]);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return docsList.filter((d) => filters.length === 0 || filters.includes(d.category));

    // Split into meaningful keywords, stripping stop-words and short tokens
    const keywords = q
      .replace(/[?.,!;:]/g, " ")
      .split(/\s+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

    return docsList.filter((d) => {
      const matchesFilter = filters.length === 0 || filters.includes(d.category);
      if (!matchesFilter) return false;

      const haystack = [
        d.title,
        d.snippet,
        d.category,
        ...(d.content || []),
      ].join(" ").toLowerCase();

      // Exact phrase match wins; otherwise require at least half the keywords to be present
      if (haystack.includes(q)) return true;
      if (keywords.length === 0) return haystack.includes(q);
      const matchCount = keywords.filter((kw) => haystack.includes(kw)).length;
      return matchCount >= Math.ceil(keywords.length / 2);
    });
  }, [query, filters, docsList]);

  // Paginate and sort local keyword results.
  // (Backend semantic results are shown separately in the Azure AI panel inside Results component.)
  const sortedAndPaginatedResults = useMemo(() => {
    let list = [...results];
    if (sortBy === "date") {
      list.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    }
    const start = (currentPage - 1) * 10;
    return list.slice(start, start + 10);
  }, [results, sortBy, currentPage]);

  const recentDocs = RECENTLY_VIEWED_IDS.map((id) =>
    docsList.find((d) => d.id === id)
  ).filter(Boolean) as Doc[];

  const handleSearch = (v: string, pageNum = 1, sortVal = "relevance", currentFilters = filters) => {
    if (!v.trim()) return;
    setQuery(v);
    setSearchValue(v);
    setCurrentPage(pageNum);
    setSortBy(sortVal);
    setLoading(true);
    setView("results");
    setPredictedCategory(null);
    setAzureResults(null);
    setAzureSearchActive(false);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Save to search history
    try {
      const hist = JSON.parse(localStorage.getItem("search_history") || "[]");
      if (!hist.includes(v)) {
        localStorage.setItem("search_history", JSON.stringify([v, ...hist].slice(0, 10)));
      }
      if (user?.id) {
        fetch("/search-history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id, query: v })
        }).catch(() => {});
      }
    } catch (e) {}

    // Minimum visual loading delay for premium feel
    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 850));

    // (1) ML category prediction
    const predictPromise = fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: v })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.category) {
          setPredictedCategory(data.category as Category);
        }
      })
      .catch(() => { /* ML server offline - silently skip */ });

    // (2) Semantic search
    const azurePromise = fetch("/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: v, filters: currentFilters, top: 10, page: pageNum, sort: sortVal })
    })
      .then((res) => {
        if (!res.ok) return null; // 503 = not configured, skip
        return res.json();
      })
      .then((data) => {
        if (data && data.azure && data.results?.length > 0) {
          setAzureResults(data.results);
          setAzureSearchActive(true);
        } else {
          setAzureResults([]);
          setAzureSearchActive(true);
        }
      })
      .catch(() => { /* Not reachable - silently skip */ });

    Promise.all([timeoutPromise, predictPromise, azurePromise]).finally(() => {
      setLoading(false);
    });
  };


  const handleCategoryClick = (cat: Category) => {
    setQuery("");
    setSearchValue("");
    setFilters([cat]);
    setLoading(true);
    setView("results");
    setPredictedCategory(null);
    setAzureResults(null);
    setAzureSearchActive(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setLoading(false), 850);
  };

  const handleDocClick = (doc: Doc) => {
    setSelectedDoc(doc);
    setView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setView("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogoClick = () => {
    setView("dashboard");
    setQuery("");
    setSearchValue("");
    setFilters([]);
    setPredictedCategory(null);
    setAzureResults(null);
    setAzureSearchActive(false);
  };

  const handleAutoClassify = async () => {
    if (!draftContent.trim()) {
      setClassifyError("Please add some content first to classify.");
      return;
    }
    setIsClassifying(true);
    setClassifyError("");
    try {
      const response = await fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: draftContent })
      });
      const data = await response.json();
      if (data.success && data.category) {
        setDraftCategory(data.category as Category);
      } else {
        setClassifyError("ML server returned an error: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      setClassifyError("ML server offline. Please make sure server.py is running on port 5000.");
    } finally {
      setIsClassifying(false);
    }
  };

  const handlePublishDraft = async () => {
    if (!draftTitle.trim() || !draftContent.trim() || !draftCategory) {
      alert("Please fill in all fields (Title, Content, and Category) before publishing.");
      return;
    }
    
    const docId = editingDocId || `custom-${Date.now()}`;
    const newDoc: Doc = {
      id: docId,
      title: draftTitle,
      category: draftCategory as Category,
      snippet: draftContent.slice(0, 150) + (draftContent.length > 150 ? "..." : ""),
      content: draftContent.split("\n\n").filter(p => p.trim() !== ""),
      lastUpdated: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    };

    const endpoint = editingDocId ? "/update-doc" : "/add-doc";

    try {
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newDoc.id,
          text: draftTitle + ". " + draftContent,
          category: newDoc.category,
          snippet: newDoc.snippet
        })
      });
    } catch (e) {
      console.error(`Failed to ${editingDocId ? 'update' : 'add'} AI index:`, e);
    }

    setDocsList(prev => {
      const updated = editingDocId ? prev.map(d => d.id === docId ? newDoc : d) : [newDoc, ...prev];
      localStorage.setItem('smart_docs_custom', JSON.stringify(updated.filter(d => d.id.startsWith('custom-'))));
      return updated;
    });
    setDraftModalOpen(false);
    setDraftTitle("");
    setDraftContent("");
    setDraftCategory("");
    setClassifyError("");
    setEditingDocId(null);
    
    setSelectedDoc(newDoc);
    setView("detail");
  };

  if (!user) {
    return <AuthPage onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-background font-[Inter,_system-ui,_sans-serif]">
      <Navbar
        onLogoClick={handleLogoClick}
        view={view}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearchSubmit={handleSearch}
        onDraftClick={() => setDraftModalOpen(true)}
        onAdminClick={() => setView("admin")}
        onLogout={() => setUser(null)}
        userName={user.name}
        userEmail={user.email}
        onProfileClick={() => setProfileModalOpen(true)}
      />

      {view === "dashboard" && (
        <Dashboard
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearchSubmit={handleSearch}
          onCategoryClick={handleCategoryClick}
          onDocClick={handleDocClick}
          recentDocs={recentDocs}
          docs={docsList}
          userName={user.name}
        />
      )}

      {view === "results" && (
        <Results
          query={query}
          results={sortedAndPaginatedResults}
          totalCount={results.length}
          currentPage={currentPage}
          setCurrentPage={(pageNum) => {
            setCurrentPage(pageNum);
            handleSearch(query, pageNum, sortBy, filters);
          }}
          sortBy={sortBy}
          setSortBy={(sortVal) => {
            setSortBy(sortVal);
            setCurrentPage(1);
            handleSearch(query, 1, sortVal, filters);
          }}
          loading={loading}
          filters={filters}
          onToggleFilter={(cat) => {
            const newFilters = filters.includes(cat) ? filters.filter(c => c !== cat) : [...filters, cat];
            setFilters(newFilters);
            setCurrentPage(1);
            handleSearch(query, 1, sortBy, newFilters);
          }}
          onClearFilters={() => {
            setFilters([]);
            setCurrentPage(1);
            handleSearch(query, 1, sortBy, []);
          }}
          onDocClick={handleDocClick}
          onBackToHome={handleLogoClick}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearchSubmit={(val) => handleSearch(val, 1, sortBy, filters)}
          docs={docsList}
          predictedCategory={predictedCategory}
          azureResults={azureResults}
          azureSearchActive={azureSearchActive}
        />
      )}

      {view === "detail" && selectedDoc && (
        <Detail 
          doc={selectedDoc} 
          onBack={handleBack}
          onBackToHome={handleLogoClick}
          userEmail={user.email}
          userId={user.id}
          onEdit={() => {
            setDraftTitle(selectedDoc.title);
            setDraftContent(selectedDoc.content.join("\n\n"));
            setDraftCategory(selectedDoc.category);
            setEditingDocId(selectedDoc.id);
            setDraftModalOpen(true);
          }}
          onDelete={async () => {
            if (confirm("Are you sure you want to delete this document? It will be permanently removed from the AI Search Index.")) {
              try {
                await fetch("/delete-doc", { 
                  method: "POST", 
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id: selectedDoc.id }) 
                });
              } catch (e) {}
              
              setDocsList(prev => {
                const updated = prev.filter(d => d.id !== selectedDoc.id);
                localStorage.setItem('smart_docs_custom', JSON.stringify(updated.filter(d => d.id.startsWith('custom-'))));
                return updated;
              });
              setView("dashboard");
              setSelectedDoc(null);
            }
          }}
        />
      )}

      {view === "admin" && (
        <AdminPanel onBack={() => setView("dashboard")} />
      )}

      {/* Draft Modal */}
      {draftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-border w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-accent/15 flex items-center justify-center text-accent">
                  <Sparkles className="size-4" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{editingDocId ? "Edit Document" : "Draft New Document"}</h2>
              </div>
              <button
                onClick={() => {
                  setDraftModalOpen(false);
                  setClassifyError("");
                  setEditingDocId(null);
                }}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Document Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maternity Leave Policy Update"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="w-full bg-white border border-border rounded-xl px-4 py-2.5 outline-none transition-all text-sm placeholder:text-muted-foreground text-foreground focus:border-accent focus:ring-2 focus:ring-accent/15"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Content
                </label>
                <textarea
                  placeholder="Write or paste your document content here..."
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  rows={6}
                  className="w-full bg-white border border-border rounded-xl px-4 py-2.5 outline-none transition-all text-sm placeholder:text-muted-foreground text-foreground focus:border-accent focus:ring-2 focus:ring-accent/15 resize-none font-sans"
                />
              </div>

              {/* Auto Classify Actions */}
              <div className="bg-muted/40 p-4 rounded-xl space-y-3 border border-border">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="text-xs font-semibold text-foreground">AI Auto-Tagging</p>
                    <p className="text-xxs text-muted-foreground">Predict category based on document text</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoClassify}
                    disabled={isClassifying}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all active:scale-95 cursor-pointer
                      ${isClassifying 
                        ? "bg-muted border-border text-muted-foreground cursor-not-allowed" 
                        : "bg-white border-accent/20 text-accent hover:border-accent hover:bg-accent/5"}`}
                  >
                    {isClassifying ? (
                      <>
                        <RefreshCw className="size-3 animate-spin" />
                        Classifying...
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-3" />
                        Auto-Classify with ML
                      </>
                    )}
                  </button>
                </div>

                {classifyError && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1.5 bg-red-50 p-2.5 rounded-lg border border-red-100/50">
                    <AlertCircle className="size-4 shrink-0" />
                    {classifyError}
                  </p>
                )}

                {/* Category selection */}
                <div>
                  <label className="block text-xxs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Assigned Category
                  </label>
                  <div className="flex gap-2">
                    {(["HR", "IT", "Finance"] as Category[]).map((cat) => {
                      const active = draftCategory === cat;
                      const cfg = CAT_CONFIG[cat];
                      const Icon = cfg.icon;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setDraftCategory(cat)}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-medium transition-all flex-1 justify-center active:scale-95 cursor-pointer
                            ${active 
                              ? `${cfg.tagBg} ${cfg.tagText} ${cfg.tagBorder} scale-102 shadow-sm ring-1 ring-accent/25` 
                              : "bg-white border-border text-muted-foreground hover:bg-muted/30"}`}
                        >
                          <Icon className="size-3.5" />
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-muted/20 border-t border-border flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setDraftModalOpen(false);
                  setClassifyError("");
                }}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePublishDraft}
                className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-accent rounded-xl transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                Publish Document
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Profile Details Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-border w-full max-w-sm shadow-xl overflow-hidden flex flex-col animate-scale-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">User Profile</h2>
              <button
                onClick={() => setProfileModalOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 text-center space-y-4">
              <div className="size-20 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-md mx-auto ring-4 ring-secondary">
                <span className="text-white text-2xl font-bold">
                  {user.name.split(' ').map((n: string) => n.charAt(0).toUpperCase()).join('').slice(0, 2)}
                </span>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-foreground">{user.name}</h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 mt-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                  <ShieldCheck className="size-3" />
                  System Administrator
                </span>
              </div>

              <div className="border-t border-border pt-4 text-left space-y-3">
                <div>
                  <label className="block text-xxs font-semibold text-muted-foreground uppercase tracking-wider">
                    Admin ID
                  </label>
                  <p className="text-sm font-semibold text-foreground mt-0.5">#{user.id}</p>
                </div>
                <div>
                  <label className="block text-xxs font-semibold text-muted-foreground uppercase tracking-wider">
                    Email Address
                  </label>
                  <p className="text-sm font-medium text-foreground mt-0.5 flex items-center gap-1.5">
                    <Mail className="size-4 text-muted-foreground shrink-0" />
                    {user.email}
                  </p>
                </div>
                {user.created_at && (
                  <div>
                    <label className="block text-xxs font-semibold text-muted-foreground uppercase tracking-wider">
                      Joined Date
                    </label>
                    <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      <Calendar className="size-4 text-muted-foreground shrink-0" />
                      {new Date(user.created_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-muted/20 border-t border-border flex items-center justify-end">
              <button
                onClick={() => setProfileModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-accent rounded-xl transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
