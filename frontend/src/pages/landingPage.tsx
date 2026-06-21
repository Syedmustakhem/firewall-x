import { useState } from "react";
import { Shield, Check, ChevronRight, Menu, X, Zap, Lock, Globe, BarChart2, Users, Server, Star, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// LANDING PAGE — SecureShield by FirewallX
// This is what VISITORS see before they sign up.
// Think cisco.com, paloaltonetworks.com, fortinet.com
// Industry standard SaaS landing page structure:
// 1. Hero — what you do in one line
// 2. Social proof — logos/testimonials
// 3. Features — why you're better
// 4. How it works — 3 steps
// 5. Pricing — your plans
// 6. CTA — sign up now

const NAV_LINKS = ["Solutions", "Products", "Pricing", "Partners", "Resources", "Company"];

const FEATURES = [
  { icon: <Shield className="w-6 h-6" />, title: "nftables Enforcement", desc: "Rules compiled directly to Linux kernel firewall. Zero overhead, maximum performance.", color: "text-blue-500" },
  { icon: <Zap className="w-6 h-6" />, title: "30-Second Deployment", desc: "Push policies to any device globally. Agent picks up changes in under 30 seconds.", color: "text-yellow-500" },
  { icon: <Globe className="w-6 h-6" />, title: "Multi-Site Management", desc: "Manage firewalls across offices, data centers, and remote sites from one console.", color: "text-purple-500" },
  { icon: <BarChart2 className="w-6 h-6" />, title: "Real-Time Traffic Analytics", desc: "See allowed vs blocked traffic, attack patterns, and protocol distribution live.", color: "text-green-500" },
  { icon: <Users className="w-6 h-6" />, title: "Role-Based Access Control", desc: "Admin, Operator, Viewer roles. Your team gets exactly the access they need.", color: "text-orange-500" },
  { icon: <Lock className="w-6 h-6" />, title: "Policy Version Control", desc: "Every change tracked. Roll back any policy to any previous version in one click.", color: "text-red-500" },
];

const STEPS = [
  { num: "01", title: "Install the Agent", desc: "One command installs the FirewallX agent on any Linux device. Takes 2 minutes.", code: "curl -fsSL https://get.firewallx.ai | sh" },
  { num: "02", title: "Create a Policy", desc: "Define firewall rules — allow, deny, or drop traffic by IP, port, and protocol.", code: 'policy: "Block SSH" → DENY TCP port 22' },
  { num: "03", title: "Deploy & Monitor", desc: "Push the policy. Agent applies it via nftables in 30 seconds. Monitor in real time.", code: "✓ Deployed to 12 devices in 28s" },
];

const PLANS = [
  {
    name: "Free", price: 0, period: "forever", color: "border-gray-200 dark:border-gray-700",
    badge: null,
    features: ["1 device", "3 policies", "Basic monitoring", "Community support"],
    cta: "Get Started Free", ctaStyle: "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
  },
  {
    name: "Starter", price: 49, period: "per month", color: "border-blue-200 dark:border-blue-800",
    badge: null,
    features: ["5 devices", "10 policies", "Traffic analytics", "Email support", "Heartbeat monitoring"],
    cta: "Start Free Trial", ctaStyle: "border border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20",
  },
  {
    name: "Pro", price: 299, period: "per month", color: "border-blue-500 dark:border-blue-500",
    badge: "Most Popular",
    features: ["25 devices", "Unlimited policies", "Full analytics", "Priority support", "Policy versioning", "Role-based access", "API access"],
    cta: "Start Free Trial", ctaStyle: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  {
    name: "Enterprise", price: null, period: "custom pricing", color: "border-purple-200 dark:border-purple-800",
    badge: null,
    features: ["Unlimited devices", "Unlimited policies", "Dedicated support", "Custom SLA", "SSO / SAML", "On-premise option", "Compliance reports"],
    cta: "Contact Sales", ctaStyle: "border border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20",
  },
];

const TESTIMONIALS = [
  { quote: "SecureShield helped us pass our SOC 2 audit. We finally have full visibility into network traffic across all offices.", author: "Sarah K.", role: "Security Lead, B2B SaaS Startup" },
  { quote: "Replaced Cisco Firepower at 1/10th the cost. Deployment takes seconds instead of hours. Our team loves it.", author: "Mohammed A.", role: "IT Director, FinTech Company" },
  { quote: "Managing 50+ devices used to be a nightmare. Now it's one dashboard. The policy versioning saved us twice already.", author: "James T.", role: "CTO, E-commerce Platform" },
];

const LOGOS = ["Cisco", "AWS", "Microsoft", "Google", "IBM", "Oracle"];

export const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">SecureShield</span>
            <span className="text-xs text-gray-400 ml-1">by FirewallX</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a key={link} href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">{link}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/login")} className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              Login
            </button>
            <button onClick={() => navigate("/login")} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Request Demo
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/30 dark:via-gray-950 dark:to-purple-950/20" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Enterprise Firewall Management — SaaS</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              One Platform to
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Secure</span>
              <br />Your Entire Network
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
              SecureShield gives IT teams centralized firewall management across all devices — 
              on-premise, cloud, or remote. Deploy policies in 30 seconds. Monitor everything in real time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate("/login")} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-blue-500/25">
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-all flex items-center justify-center gap-2 text-lg">
                Watch Demo
              </button>
            </div>

            <div className="flex items-center gap-6 mt-8 text-sm text-gray-500 dark:text-gray-400">
              {["No credit card required", "14-day free trial", "Cancel anytime"].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-green-500" />{t}
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative">
            <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700 bg-gray-800 dark:bg-gray-900">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs text-gray-400 ml-2">SecureShield Dashboard</span>
              </div>
              <div className="p-6 grid grid-cols-4 gap-4">
                {[
                  { label: "Protected Devices", value: "247", color: "text-blue-400" },
                  { label: "Active Policies", value: "89", color: "text-purple-400" },
                  { label: "Threats Blocked", value: "12,847", color: "text-red-400" },
                  { label: "Uptime", value: "99.97%", color: "text-green-400" },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-800 dark:bg-gray-700 rounded-xl p-4 border border-gray-700">
                    <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-6">
                <div className="bg-gray-800 dark:bg-gray-700 rounded-xl border border-gray-700 overflow-hidden">
                  <div className="px-4 py-2 border-b border-gray-700 text-xs text-gray-400">Recent Deployments</div>
                  {[
                    { device: "HQ Firewall", policy: "Block Social Media", status: "success", time: "2s ago" },
                    { device: "Branch Office", policy: "Corporate Policy", status: "success", time: "1m ago" },
                    { device: "Data Center", policy: "Zero Trust Rules", status: "pending", time: "Just now" },
                  ].map((d, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2.5 border-b border-gray-700/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${d.status === "success" ? "bg-green-500" : "bg-yellow-500"}`} />
                        <span className="text-xs text-gray-300">{d.device}</span>
                        <span className="text-xs text-gray-500">→ {d.policy}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-medium ${d.status === "success" ? "text-green-400" : "text-yellow-400"}`}>{d.status}</span>
                        <span className="text-xs text-gray-500">{d.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-12 border-y border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">Trusted by security teams at</p>
          <div className="flex items-center justify-center gap-12 flex-wrap">
            {LOGOS.map((logo) => (
              <span key={logo} className="text-xl font-bold text-gray-300 dark:text-gray-600">{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need to<br />manage firewalls at scale</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              From a single office to 500 devices across 50 locations — SecureShield handles it all.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all group">
                <div className={`mb-4 ${f.color}`}>{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{f.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Up and running in minutes</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400">No complex setup. No expensive consultants. Just install, configure, deploy.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-blue-300 to-transparent dark:from-blue-700 z-10" />
                )}
                <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="text-4xl font-bold text-blue-100 dark:text-blue-900 mb-4">{step.num}</div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{step.desc}</p>
                  <div className="bg-gray-900 dark:bg-gray-950 rounded-lg px-4 py-2.5 font-mono text-xs text-green-400">
                    {step.code}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 px-6" id="pricing">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400">Start free. Scale as you grow. No hidden fees.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`relative p-6 rounded-2xl border-2 ${plan.color} bg-white dark:bg-gray-900 ${plan.badge ? "shadow-xl scale-105" : ""}`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    {plan.badge}
                  </div>
                )}
                <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                <div className="mb-4">
                  {plan.price !== null ? (
                    <div>
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">/{plan.period}</span>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">Custom</div>
                  )}
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate("/login")} className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all ${plan.ctaStyle}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 bg-gray-900 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-16">Trusted by security teams worldwide</h2>
          <div className="relative">
            <div className="text-6xl text-blue-500 mb-6">"</div>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">{TESTIMONIALS[activeTestimonial].quote}</p>
            <p className="font-semibold text-white">{TESTIMONIALS[activeTestimonial].author}</p>
            <p className="text-gray-400 text-sm">{TESTIMONIALS[activeTestimonial].role}</p>
            <div className="flex justify-center gap-3 mt-8">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)}
                  className={`w-3 h-3 rounded-full transition-all ${i === activeTestimonial ? "bg-blue-500 w-6" : "bg-gray-600"}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to secure your network?</h2>
          <p className="text-xl text-blue-100 mb-8">Join hundreds of companies protecting their infrastructure with SecureShield.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/login")} className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors text-lg flex items-center justify-center gap-2">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-white/30 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-lg">
              Talk to Sales
            </button>
          </div>
          <p className="text-blue-200 text-sm mt-4">No credit card required · 14-day free trial · Cancel anytime</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 text-gray-400 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-blue-600 rounded-lg"><Shield className="w-4 h-4 text-white" /></div>
                <span className="font-bold text-white">SecureShield</span>
              </div>
              <p className="text-sm text-gray-500 max-w-xs">Enterprise firewall management for modern IT teams. Secure, fast, and simple.</p>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security", "SOC 2"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-white mb-3 text-sm">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}><a href="#" className="text-sm hover:text-white transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">© 2026 FirewallX Inc. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-green-400">All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};