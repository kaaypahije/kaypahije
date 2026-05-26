import { Link } from "react-router-dom";
import { useState } from "react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import logo from "@/assets/logo.jpeg";

export function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <section className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative bg-gradient-hero text-primary-foreground p-12 items-end overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 30%, oklch(0.78 0.17 55 / 0.5) 0%, transparent 50%)",
          }}
        />
        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-2 rounded-2xl bg-white p-3">
            <img src={logo} alt="" className="h-10" />
          </Link>
          <h1 className="mt-10 text-4xl xl:text-5xl font-extrabold leading-tight">
            Find what your city has to offer.
          </h1>
          <p className="mt-4 text-white/75 max-w-md">
            Join millions of users who trust Kay Pahije every day to discover verified local
            businesses.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-8">
            <img src={logo} alt="" className="h-10" />
          </Link>
          <div className="flex gap-1 rounded-full bg-secondary p-1 mb-6">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
                mode === "login" ? "bg-card shadow-soft" : "text-muted-foreground"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
                mode === "register" ? "bg-card shadow-soft" : "text-muted-foreground"
              }`}
            >
              Register
            </button>
          </div>
          <h2 className="text-3xl font-extrabold">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login"
              ? "Sign in to continue to Kay Pahije"
              : "Start exploring the best of your city"}
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="mt-6 space-y-3">
            {mode === "register" && <Field icon={User} placeholder="Full name" />}
            <Field icon={Mail} placeholder="Email address" type="email" />
            <Field icon={Lock} placeholder="Password" type="password" />
            {mode === "login" && (
              <div className="flex justify-between text-xs">
                <label className="inline-flex items-center gap-1.5">
                  <input type="checkbox" className="accent-accent" /> Remember me
                </label>
                <a href="#" className="text-accent font-semibold">
                  Forgot password?
                </a>
              </div>
            )}
            <button className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-accent px-6 py-3 font-semibold text-accent-foreground shadow-soft hover:shadow-glow transition">
              {mode === "login" ? "Sign In" : "Create Account"} <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="text-accent">
              Terms
            </Link>{" "}
            &{" "}
            <Link to="/privacy" className="text-accent">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

function Field({
  icon: Icon,
  ...props
}: {
  icon: React.ComponentType<{ className?: string }>;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-3 focus-within:ring-2 focus-within:ring-accent">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <input {...props} className="bg-transparent text-sm w-full focus:outline-none" />
    </div>
  );
}
