import { useState } from "react";
import { Lock, Mail, User, ShieldCheck } from "lucide-react";

export default function AuthPage({ onLogin }: { onLogin: (user: any) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/login" : "/register";
      const payload = isLogin ? { email, password } : { name, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (isLogin) {
          onLogin(data.user);
        } else {
          setIsLogin(true);
          setError("Registration successful! Please log in.");
        }
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      setError("Network error. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-border overflow-hidden">
        <div className="p-8 text-center bg-accent/5 border-b border-border">
          <div className="mx-auto size-12 bg-accent rounded-xl flex items-center justify-center shadow-sm mb-4">
            <ShieldCheck className="text-white size-6" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Nexus Solutions
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Secure Knowledge Base Access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className={`p-3 text-sm font-medium rounded-lg ${error.includes("successful") ? "bg-green-50 text-green-600 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
              {error}
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl outline-none transition-all text-sm focus:border-accent focus:ring-2 focus:ring-accent/15"
                  placeholder="Mohammed Haseebuddin"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="size-4 text-muted-foreground" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl outline-none transition-all text-sm focus:border-accent focus:ring-2 focus:ring-accent/15"
                placeholder="you@nexussolutions.in"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="size-4 text-muted-foreground" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl outline-none transition-all text-sm focus:border-accent focus:ring-2 focus:ring-accent/15"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-sm text-accent hover:underline font-medium"
            >
              {isLogin ? "Need an account? Register here." : "Already have an account? Sign in."}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
