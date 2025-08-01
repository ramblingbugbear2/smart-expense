import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../hooks/useAuth.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const { set } = useAuth();
  const nav = useNavigate();

  const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    // quick client-side checks
    if (!validEmail(email)) {
      setErr("Please enter a valid e-mail.");
      return;
    }
    if (password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      set(data.access);           // save JWT in context
      nav("/app", { replace: true });  // go to the groups dashboard
    } catch (e) {
      setErr(
        e?.response?.data?.message || "Incorrect e-mail or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-white to-purple-50 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md space-y-5 rounded-2xl border bg-white/80 backdrop-blur shadow-xl p-6"
      >
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Sign in to Smart&nbsp;Expense
        </h1>

        {/* E-mail field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="pl-10"
              disabled={loading}
            />
          </div>
        </div>

        {/* Password field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-10 pr-11"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full
                         text-gray-400 hover:text-blue-600 focus:outline-none
                         focus:ring-2 focus:ring-blue-500/70 transition"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Error message */}
        {err && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
            {err}
          </p>
        )}

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Login"}
        </Button>

        {/* Helper link */}
        <p className="text-xs text-center text-gray-500">
          New here?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Create an account
          </a>
        </p>
      </form>
    </div>
  );
}
