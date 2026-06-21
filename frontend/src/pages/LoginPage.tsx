import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { authApi } from "../api";
import { useAuthStore } from "../store/authStore";
import { Button, Input } from "../components/ui";

// HOW MULTI-TENANT LOGIN WORKS (like Cisco, Palo Alto):
// 1. User enters email + password
// 2. Backend returns user object with role + organization_id
// 3. Frontend checks the role:
//    - "superadmin" → goes to /dashboard (YOUR panel)
//    - "admin" or "operator" → goes to /client-dashboard (CLIENT panel)
//    - "viewer" → goes to /client-dashboard with limited access
// This is exactly how enterprise SaaS platforms work.
// Salesforce, HubSpot, Datadog all do this same pattern.

export const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authApi.login(email, password);
      const { user, token } = res.data;
      setAuth(user, token);

      // ROLE-BASED REDIRECT
      // This is the key — backend tells us who this user is
      // and we send them to the right dashboard
      if (user.role === "superadmin") {
        navigate("/dashboard");           // YOUR super admin panel
      } else if (user.role === "admin" || user.role === "operator") {
        navigate("/client-dashboard");    // CLIENT's panel
      } else {
        navigate("/client-dashboard");    // Viewers also go to client panel
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-xl">SecureShield</h1>
              <p className="text-blue-200 text-xs">by FirewallX</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Enterprise Firewall<br />Management Made Simple
          </h2>
          <p className="text-blue-200 text-lg mb-8">
            Deploy firewall policies to hundreds of devices in seconds. Monitor everything in real time.
          </p>

          <div className="space-y-4">
            {[
              { stat: "500+", label: "Companies protected" },
              { stat: "99.97%", label: "Platform uptime" },
              { stat: "30s", label: "Average deployment time" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <span className="text-2xl font-bold text-white">{s.stat}</span>
                <span className="text-blue-200 text-sm">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-300 text-sm relative">© 2026 FirewallX Inc. SOC 2 Type II Certified.</p>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />Back to home
          </Link>

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="p-1.5 bg-blue-600 rounded-lg"><Shield className="w-5 h-5 text-white" /></div>
            <span className="font-bold text-lg">SecureShield</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Sign in to your console</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required autoFocus
            />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <a href="#" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full justify-center py-3" size="lg" loading={loading}>
              Sign in to Console
            </Button>
          </form>

          {/* Role info box */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-2">Login redirects by role:</p>
            <div className="space-y-1 text-xs text-blue-700 dark:text-blue-400">
              <p>👑 <strong>Superadmin</strong> → Super Admin Dashboard</p>
              <p>🏢 <strong>Admin / Operator</strong> → Client Dashboard</p>
              <p>👁️ <strong>Viewer</strong> → Read-only Client View</p>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account?{" "}
            <a href="#" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Request a demo</a>
          </p>
        </div>
      </div>
    </div>
  );
};