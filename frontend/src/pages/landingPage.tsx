import { useState, useEffect, useRef } from "react";
import { Shield, Check, Menu, X, Zap, Lock, Globe, BarChart2, Users, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

const NAV_LINKS = ["Solutions", "Products", "Pricing", "Partners", "Resources", "Company"];

const FEATURES = [
  { icon: <Shield className="w-6 h-6" />, title: "nftables Enforcement", desc: "Rules compiled directly to Linux kernel firewall. Zero overhead, maximum performance.", color: "text-blue-500", glow: "rgba(59,130,246,0.15)" },
  { icon: <Zap className="w-6 h-6" />, title: "30-Second Deployment", desc: "Push policies to any device globally. Agent picks up changes in under 30 seconds.", color: "text-yellow-500", glow: "rgba(234,179,8,0.15)" },
  { icon: <Globe className="w-6 h-6" />, title: "Multi-Site Management", desc: "Manage firewalls across offices, data centers, and remote sites from one console.", color: "text-purple-500", glow: "rgba(168,85,247,0.15)" },
  { icon: <BarChart2 className="w-6 h-6" />, title: "Real-Time Traffic Analytics", desc: "See allowed vs blocked traffic, attack patterns, and protocol distribution live.", color: "text-green-500", glow: "rgba(34,197,94,0.15)" },
  { icon: <Users className="w-6 h-6" />, title: "Role-Based Access Control", desc: "Admin, Operator, Viewer roles. Your team gets exactly the access they need.", color: "text-orange-500", glow: "rgba(249,115,22,0.15)" },
  { icon: <Lock className="w-6 h-6" />, title: "Policy Version Control", desc: "Every change tracked. Roll back any policy to any previous version in one click.", color: "text-red-500", glow: "rgba(239,68,68,0.15)" },
];

const STEPS = [
  { num: "01", title: "Install the Agent", desc: "One command installs the FirewallX agent on any Linux device. Takes 2 minutes.", code: "curl -fsSL https://get.firewallx.ai | sh" },
  { num: "02", title: "Create a Policy", desc: "Define firewall rules — allow, deny, or drop traffic by IP, port, and protocol.", code: 'policy: "Block SSH" → DENY TCP port 22' },
  { num: "03", title: "Deploy & Monitor", desc: "Push the policy. Agent applies it via nftables in 30 seconds. Monitor in real time.", code: "✓ Deployed to 12 devices in 28s" },
];

const PLANS = [
  { name: "Free", price: 0, period: "forever", color: "border-gray-200 dark:border-gray-700", badge: null, features: ["1 device", "3 policies", "Basic monitoring", "Community support"], cta: "Get Started Free", ctaStyle: "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800" },
  { name: "Starter", price: 49, period: "per month", color: "border-blue-200 dark:border-blue-800", badge: null, features: ["5 devices", "10 policies", "Traffic analytics", "Email support", "Heartbeat monitoring"], cta: "Start Free Trial", ctaStyle: "border border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20" },
  { name: "Pro", price: 299, period: "per month", color: "border-blue-500 dark:border-blue-500", badge: "Most Popular", features: ["25 devices", "Unlimited policies", "Full analytics", "Priority support", "Policy versioning", "Role-based access", "API access"], cta: "Start Free Trial", ctaStyle: "bg-blue-600 hover:bg-blue-700 text-white" },
  { name: "Enterprise", price: null, period: "custom pricing", color: "border-purple-200 dark:border-purple-800", badge: null, features: ["Unlimited devices", "Unlimited policies", "Dedicated support", "Custom SLA", "SSO / SAML", "On-premise option", "Compliance reports"], cta: "Contact Sales", ctaStyle: "border border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20" },
];

const TESTIMONIALS = [
  { quote: "SecureShield helped us pass our SOC 2 audit. We finally have full visibility into network traffic across all offices.", author: "Sarah K.", role: "Security Lead, B2B SaaS Startup" },
  { quote: "Replaced Cisco Firepower at 1/10th the cost. Deployment takes seconds instead of hours. Our team loves it.", author: "Mohammed A.", role: "IT Director, FinTech Company" },
  { quote: "Managing 50+ devices used to be a nightmare. Now it's one dashboard. The policy versioning saved us twice already.", author: "James T.", role: "CTO, E-commerce Platform" },
];

const LOGOS = ["Cisco", "AWS", "Microsoft", "Google", "IBM", "Oracle"];

const TICKER_ITEMS = [
  "🛡️ 12,847 threats blocked today",
  "✅ 247 devices protected globally",
  "⚡ 28s average deployment time",
  "🔒 SOC 2 Type II certified",
  "🌍 50+ countries served",
  "📊 99.97% platform uptime",
  "🚀 500+ companies trust us",
  "🔥 Zero-trust architecture built-in",
];

const useInView = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
};

const Counter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// ── DEMO REQUEST MODAL ──────────────────────────────────────────────────────
const DemoModal = ({ onClose }: { onClose: () => void }) => {
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", employees: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.company) return setError("Name, email and company are required");
    setLoading(true); setError("");
    try {
      await api.post("/account-requests", {
        name: form.name,
        email: form.email,
        company: form.company,
        phone: form.phone,
        employeeCount: form.employees,
        message: form.message,
        type: "demo",
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ animation: "fadeIn 0.2s ease" }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        style={{ animation: "slideUp 0.3s ease" }}>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 rounded-lg"><Shield className="w-4 h-4 text-white" /></div>
                <span className="text-white font-bold text-sm">FirewallX · firewall-x.in</span>
              </div>
              <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-2xl font-black text-white">Request a Demo</h2>
            <p className="text-blue-100 text-sm mt-1">See SecureShield in action — our team will reach out within 24 hours</p>
          </div>
        </div>

        {submitted ? (
          <div className="p-10 text-center" style={{ animation: "fadeIn 0.4s ease" }}>
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Request Submitted! 🎉</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-2">Thank you, <strong>{form.name}</strong>!</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              We've received your demo request for <strong>{form.company}</strong>. Our team will contact you at <strong>{form.email}</strong> within 24 hours.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-700 dark:text-blue-300 mb-6">
              In the meantime, you can <strong>start for free</strong> — no credit card required.
            </div>
            <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-colors">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {[
                { key: "name", label: "Full Name *", placeholder: "John Smith", type: "text" },
                { key: "email", label: "Work Email *", placeholder: "john@company.com", type: "email" },
                { key: "company", label: "Company Name *", placeholder: "Acme Corp", type: "text" },
                { key: "phone", label: "Phone Number", placeholder: "+1 (555) 000-0000", type: "tel" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder}
                    value={(form as any)[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                </div>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Size</label>
              <select value={form.employees} onChange={e => setForm({ ...form, employees: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select company size</option>
                {["1-10 employees", "11-50 employees", "51-200 employees", "201-500 employees", "500+ employees"].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">What are you looking to solve?</label>
              <textarea placeholder="Tell us about your network security challenges..." rows={3}
                value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>

            {error && (
              <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="flex items-center gap-4">
              <button type="submit" disabled={loading}
                className="flex-1 relative overflow-hidden group bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70">
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Submitting...</>
                  ) : (<>Request Demo <ArrowRight className="w-4 h-4" /></>)}
                </span>
              </button>
              <button type="button" onClick={onClose}
                className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-sm transition-all">
                Cancel
              </button>
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-600 text-center mt-4">
              By submitting, you agree to our Privacy Policy. No spam, ever.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showDemoModal, setShowDemoModal] = useState(false);
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    const onMouse = (e: MouseEvent) => setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", onMouse);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("mousemove", onMouse); };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const dots: { x: number; y: number; vx: number; vy: number; r: number }[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 0.5,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(59,130,246,0.4)"; ctx.fill();
      });
      dots.forEach((a, i) => dots.forEach((b, j) => {
        if (i >= j) return;
        const dx = a.x - b.x, dy = a.y - b.y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(59,130,246,${(1 - dist / 120) * 0.15})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }));
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  const feat1 = useInView(); const feat2 = useInView(); const feat3 = useInView();
  const featRefs = [feat1, feat2, feat3, useInView(), useInView(), useInView()];
  const statsRef = useInView();
  const stepsRef = useInView();
  const pricingRef = useInView();
  const demoRef = useInView();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden">

      {showDemoModal && <DemoModal onClose={() => setShowDemoModal(false)} />}

      {/* TICKER */}
      <div className="bg-blue-600 text-white text-xs py-2 overflow-hidden relative">
        <div className="flex whitespace-nowrap" style={{ animation: "ticker 30s linear infinite" }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="mx-8 font-medium tracking-wide">{item}</span>
          ))}
        </div>
      </div>

      {/* NAVBAR */}
      <nav className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 10 ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-lg shadow-blue-500/5 border-b border-gray-100 dark:border-gray-800" : "bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900"}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/Professional_minimalist_logo_design_for_202606230119.jpeg" alt="FirewallX" className="h-10 w-auto rounded-lg" />
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">FirewallX</span>
              <span className="text-xs text-gray-500 leading-tight">by Secure Shield</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a key={link} href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group">
                {link}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300 rounded-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/login")} className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
              Login
            </button>
            <button onClick={() => setShowDemoModal(true)}
              className="relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 active:scale-95">
              <span className="relative z-10">Request Demo</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 opacity-0 hover:opacity-100 transition-opacity" />
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white dark:bg-gray-950 pt-16 px-6 animate-fade-in">
          {NAV_LINKS.map(l => <a key={l} href="#" className="block py-4 border-b border-gray-100 dark:border-gray-800 text-lg font-medium">{l}</a>)}
          <button onClick={() => navigate("/login")} className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold">Login</button>
        </div>
      )}

      {/* HERO */}
      <section ref={heroRef} className="pt-24 pb-16 px-6 relative overflow-hidden min-h-[90vh] flex items-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-60" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-20 transition-transform duration-1000"
            style={{ background: "radial-gradient(circle, #3b82f6, #8b5cf6)", top: "-100px", right: "-100px", transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)` }} />
          <div className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-10 transition-transform duration-1000"
            style={{ background: "radial-gradient(circle, #06b6d4, #3b82f6)", bottom: "0", left: "0", transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)` }} />
        </div>

        <div className="max-w-7xl mx-auto relative w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full px-4 py-1.5 mb-8"
              style={{ animation: "fadeSlideDown 0.6s ease-out" }}>
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-blue-500 animate-ping opacity-75" />
              </div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Enterprise Firewall Management — SaaS</span>
              <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">NEW</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6" style={{ animation: "fadeSlideDown 0.7s ease-out" }}>
              One Platform to
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-size-200 animate-gradient"> Secure</span>
              <br />Your Entire Network
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl leading-relaxed" style={{ animation: "fadeSlideDown 0.8s ease-out" }}>
              SecureShield gives IT teams centralized firewall management across all devices —
              on-premise, cloud, or remote. Deploy policies in 30 seconds. Monitor everything in real time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8" style={{ animation: "fadeSlideDown 0.9s ease-out" }}>
              <button onClick={() => navigate("/login")}
                className="group relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-lg shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95">
                <span className="relative z-10 flex items-center gap-2">Start Free Trial <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              <button onClick={() => setShowDemoModal(true)}
                className="group border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-blue-400 dark:hover:border-blue-600 transition-all flex items-center justify-center gap-2 text-lg">
                📅 Request Demo
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400" style={{ animation: "fadeSlideDown 1s ease-out" }}>
              {["No credit card required", "14-day free trial", "Cancel anytime"].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-green-500" />{t}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 relative" style={{ animation: "fadeSlideUp 1s ease-out" }}>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-3xl blur-md opacity-20 animate-pulse" />
            <div className="relative bg-gray-900 dark:bg-gray-800 rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700/50 bg-gray-800/80 backdrop-blur-sm">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs text-gray-400 ml-2 font-mono">FirewallX — Operations Center · firewall-x.in</span>
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-400 font-mono">LIVE</span>
                </div>
              </div>
              <div className="p-6 grid grid-cols-4 gap-4">
                {[
                  { label: "Protected Devices", value: "247", color: "text-blue-400", bg: "bg-blue-500/10" },
                  { label: "Active Policies", value: "89", color: "text-purple-400", bg: "bg-purple-500/10" },
                  { label: "Threats Blocked", value: "12,847", color: "text-red-400", bg: "bg-red-500/10" },
                  { label: "Uptime", value: "99.97%", color: "text-green-400", bg: "bg-green-500/10" },
                ].map((s, i) => (
                  <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all duration-300 hover:scale-105`}
                    style={{ animation: `fadeSlideUp ${0.3 + i * 0.1}s ease-out` }}>
                    <p className="text-xs text-gray-400 mb-1 font-mono">{s.label}</p>
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-6">
                <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
                  <div className="px-4 py-2 border-b border-gray-700/30 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-mono">RECENT DEPLOYMENTS</span>
                    <span className="text-xs text-blue-400 font-mono cursor-pointer hover:text-blue-300">VIEW ALL →</span>
                  </div>
                  {[
                    { device: "HQ-Firewall-01", policy: "Block Social Media", status: "success", time: "2s ago" },
                    { device: "Branch-Dubai", policy: "Corporate Policy", status: "success", time: "1m ago" },
                    { device: "DC-Rack-07", policy: "Zero Trust Rules", status: "deploying", time: "Just now" },
                  ].map((d, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-gray-700/20 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${d.status === "success" ? "bg-green-400" : "bg-yellow-400 animate-pulse"}`}
                          style={{ boxShadow: d.status === "success" ? "0 0 6px #22c55e" : "0 0 6px #f59e0b" }} />
                        <span className="text-xs text-gray-300 font-mono">{d.device}</span>
                        <span className="text-xs text-gray-500">→ {d.policy}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold ${d.status === "success" ? "text-green-400" : "text-yellow-400"}`}>{d.status}</span>
                        <span className="text-xs text-gray-600">{d.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGO SLIDER */}
      <section className="py-10 border-y border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/50 overflow-hidden relative">
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mb-6 font-mono tracking-widest uppercase">Trusted by security teams at</p>
        <div className="flex gap-16 items-center" style={{ animation: "slideLeft 20s linear infinite" }}>
          {[...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
            <span key={i} className="text-xl font-black text-gray-300 dark:text-gray-700 whitespace-nowrap hover:text-blue-400 dark:hover:text-blue-500 transition-colors cursor-default select-none">{logo}</span>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-xs font-mono text-blue-500 tracking-widest uppercase mb-3 block">Capabilities</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything you need to<br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">manage firewalls at scale</span>
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">From a single office to 500 devices across 50 locations — SecureShield handles it all.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const { ref, inView } = featRefs[i];
              return (
                <div key={f.title} ref={ref}
                  className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl transition-all duration-500 group cursor-default relative overflow-hidden"
                  style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)", transition: `all 0.5s ease ${i * 0.1}s` }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                    style={{ background: `radial-gradient(circle at 30% 30%, ${f.glow}, transparent 60%)` }} />
                  <div className={`mb-4 ${f.color} group-hover:scale-110 transition-transform duration-300 w-fit`}>{f.icon}</div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{f.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-500" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"><div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} /></div>
        <div ref={statsRef.ref} className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white relative">
          {[{ target: 500, suffix: "+", label: "Companies Protected" }, { target: 50000, suffix: "+", label: "Devices Managed" }, { target: 30, suffix: "s", label: "Avg Deploy Time" }, { target: 12847, suffix: "", label: "Threats Blocked Today" }].map((s, i) => (
            <div key={s.label} style={{ opacity: statsRef.inView ? 1 : 0, transform: statsRef.inView ? "translateY(0)" : "translateY(20px)", transition: `all 0.5s ease ${i * 0.1}s` }}>
              <div className="text-4xl md:text-5xl font-black mb-2">{statsRef.inView ? <Counter target={s.target} suffix={s.suffix} /> : "0"}</div>
              <div className="text-blue-200 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-28 px-6 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-blue-500 tracking-widest uppercase mb-3 block">Deployment Flow</span>
            <h2 className="text-4xl font-bold mb-4">Up and running in minutes</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400">No complex setup. No expensive consultants. Just install, configure, deploy.</p>
          </div>
          <div ref={stepsRef.ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative"
                style={{ opacity: stepsRef.inView ? 1 : 0, transform: stepsRef.inView ? "translateX(0)" : `translateX(${i === 0 ? -40 : i === 2 ? 40 : 0}px)`, transition: `all 0.6s ease ${i * 0.15}s` }}>
                {i < STEPS.length - 1 && <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-blue-400 to-transparent dark:from-blue-700 z-10" />}
                <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-black text-sm mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">{i + 1}</div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{step.desc}</p>
                  <div className="bg-gray-900 dark:bg-gray-950 rounded-lg px-4 py-2.5 font-mono text-xs text-green-400 border border-gray-700/30"><span className="text-gray-600 mr-2">$</span>{step.code}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-28 px-6" id="pricing">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-blue-500 tracking-widest uppercase mb-3 block">Pricing</span>
            <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400">Start free. Scale as you grow. No hidden fees.</p>
          </div>
          <div ref={pricingRef.ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLANS.map((plan, i) => (
              <div key={plan.name}
                className={`relative p-6 rounded-2xl border-2 ${plan.color} bg-white dark:bg-gray-900 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${plan.badge ? "shadow-xl scale-105 ring-2 ring-blue-500/20" : ""}`}
                style={{ opacity: pricingRef.inView ? 1 : 0, transform: pricingRef.inView ? (plan.badge ? "scale(1.05)" : "translateY(0)") : "translateY(40px)", transition: `all 0.5s ease ${i * 0.1}s` }}>
                {plan.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">{plan.badge}</div>}
                <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                <div className="mb-4">
                  {plan.price !== null ? <div><span className="text-4xl font-bold">${plan.price}</span><span className="text-gray-500 dark:text-gray-400 text-sm">/{plan.period}</span></div>
                    : <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">Custom</div>}
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map(f => <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><Check className="w-4 h-4 text-green-500 flex-shrink-0" />{f}</li>)}
                </ul>
                <button onClick={() => plan.cta === "Contact Sales" || plan.cta === "Request Demo" ? setShowDemoModal(true) : navigate("/login")}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95 ${plan.ctaStyle}`}>{plan.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28 px-6 bg-gray-900 dark:bg-gray-950 overflow-hidden relative">
        <div className="absolute inset-0 opacity-5"><div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} /></div>
        <div className="max-w-4xl mx-auto text-center relative">
          <span className="text-xs font-mono text-blue-400 tracking-widest uppercase mb-4 block">What they say</span>
          <h2 className="text-4xl font-bold text-white mb-16">Trusted by security teams worldwide</h2>
          <div className="relative min-h-[200px]">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-700"
                style={{ opacity: i === activeTestimonial ? 1 : 0, transform: i === activeTestimonial ? "translateY(0) scale(1)" : "translateY(20px) scale(0.98)", pointerEvents: i === activeTestimonial ? "auto" : "none" }}>
                <div className="text-5xl text-blue-500/40 mb-4 font-serif">"</div>
                <p className="text-xl text-gray-300 mb-6 leading-relaxed max-w-2xl">{t.quote}</p>
                <p className="font-semibold text-white">{t.author}</p>
                <p className="text-gray-500 text-sm">{t.role}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-3 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)}
                className={`transition-all duration-300 rounded-full ${i === activeTestimonial ? "bg-blue-500 w-8 h-2" : "bg-gray-600 w-2 h-2"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* REQUEST DEMO SECTION */}
      <section ref={demoRef.ref} className="py-28 px-6 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div style={{ opacity: demoRef.inView ? 1 : 0, transform: demoRef.inView ? "translateX(0)" : "translateX(-30px)", transition: "all 0.6s ease" }}>
              <span className="text-xs font-mono text-blue-500 tracking-widest uppercase mb-4 block">Get Started</span>
              <h2 className="text-4xl font-bold mb-4">See FirewallX in action</h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 leading-relaxed">
                Schedule a personalized demo with our security experts. We'll show you how to deploy firewall policies across your entire network in minutes.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: "🎯", title: "Personalized walkthrough", desc: "Tailored to your company's specific needs" },
                  { icon: "⚡", title: "Live deployment demo", desc: "See a real policy deployed in 30 seconds" },
                  { icon: "💬", title: "Q&A with experts", desc: "Ask anything about your security setup" },
                  { icon: "📋", title: "Custom pricing", desc: "Get a quote based on your device count" },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Response time:</strong> Our team responds within <strong>24 hours</strong> on business days
                </p>
              </div>
            </div>

            {/* Inline mini form */}
            <div style={{ opacity: demoRef.inView ? 1 : 0, transform: demoRef.inView ? "translateX(0)" : "translateX(30px)", transition: "all 0.6s ease 0.2s" }}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-8">
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-6">Book a 30-min demo</h3>
                <InlineDemoForm onSuccess={() => {}} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6 bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"><div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} /></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Ready to secure your network?</h2>
          <p className="text-xl text-blue-100 mb-10">Join hundreds of companies protecting their infrastructure with FirewallX.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/login")}
              className="group bg-white text-blue-600 font-bold px-10 py-4 rounded-xl hover:bg-blue-50 transition-all text-lg flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95">
              Start Free Trial <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => setShowDemoModal(true)}
              className="border-2 border-white/40 text-white font-bold px-10 py-4 rounded-xl hover:bg-white/10 transition-all text-lg hover:border-white/60">
              📅 Request Demo
            </button>
          </div>
          <p className="text-blue-200 text-sm mt-6">No credit card required · 14-day free trial · Cancel anytime</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 text-gray-400 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src="/Professional_minimalist_logo_design_for_202606230119.jpeg" alt="FirewallX" className="h-8 w-auto rounded-lg" />
                <div>
                  <span className="font-bold text-white block">FirewallX</span>
                  <span className="text-xs text-gray-500">by Secure Shield · firewall-x.in</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed">Enterprise firewall management for modern IT teams. Secure, fast, and simple.</p>
              <div className="flex items-center gap-2 mt-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-400">All systems operational</span>
              </div>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security", "SOC 2"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-white mb-4 text-sm">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(link => <li key={link}><a href="#" className="text-sm hover:text-blue-400 transition-colors">{link}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">© 2026 FirewallX Inc. All rights reserved. · firewall-x.in</p>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span>SOC 2 Certified</span><span>·</span><span>GDPR Compliant</span><span>·</span><span>ISO 27001</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes slideLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
        @keyframes fadeSlideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-gradient { background-size: 200% auto; animation: gradient 3s linear infinite; }
        .bg-size-200 { background-size: 200% auto; }
      `}</style>
    </div>
  );
};

// Inline demo form component
const InlineDemoForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [form, setForm] = useState({ name: "", email: "", company: "", employees: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.company) return setError("Name, email and company required");
    setLoading(true); setError("");
    try {
      await api.post("/account-requests", { ...form, type: "demo", employeeCount: form.employees });
      setSubmitted(true);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit. Please try again.");
    } finally { setLoading(false); }
  };

  if (submitted) return (
    <div className="text-center py-8" style={{ animation: "fadeIn 0.4s ease" }}>
      <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-7 h-7 text-green-500" />
      </div>
      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Request Received! 🎉</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm">We'll contact you at <strong>{form.email}</strong> within 24 hours.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        { key: "name", label: "Full Name *", placeholder: "John Smith", type: "text" },
        { key: "email", label: "Work Email *", placeholder: "john@company.com", type: "email" },
        { key: "company", label: "Company *", placeholder: "Acme Corp", type: "text" },
      ].map(f => (
        <div key={f.key}>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{f.label}</label>
          <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]}
            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all focus:bg-white dark:focus:bg-gray-700" />
        </div>
      ))}
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Company Size</label>
        <select value={form.employees} onChange={e => setForm({ ...form, employees: e.target.value })}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select size</option>
          {["1-10", "11-50", "51-200", "201-500", "500+"].map(s => <option key={s}>{s} employees</option>)}
        </select>
      </div>
      {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full group relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70">
        <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="relative flex items-center justify-center gap-2">
          {loading ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Submitting...</> : <>Book My Demo <ArrowRight className="w-4 h-4" /></>}
        </span>
      </button>
      <p className="text-xs text-gray-400 text-center">No spam · We respond within 24 hours</p>
    </form>
  );
};