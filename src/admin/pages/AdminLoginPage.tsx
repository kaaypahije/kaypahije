import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

type LoginFormValues = {
  email: string;
  password: string;
};

export function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      await login(values);
      toast.success("Welcome back");
      const redirectPath = (location.state as { from?: string } | null)?.from || "/admin";
      navigate(redirectPath, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
    }
  }

  return (
    <section className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_15%_20%,#ffe8d3_0%,#f7f8fc_45%,#edf2ff_100%)] p-4">
      <div className="w-full max-w-md rounded-3xl border border-[#e8ebf5] bg-white p-7 shadow-xl">
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#fff1e7] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#e3721a]">
            <ShieldCheck className="h-3.5 w-3.5" /> Secure Access
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-[#1f2b52]">Admin Login</h1>
          <p className="mt-1 text-sm text-[#7080a5]">Sign in to manage categories, listings, and analytics.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Email</label>
            <input
              type="email"
              placeholder="kaaypahije@gmail.com"
              {...register("email", { required: "Email is required" })}
              className="w-full rounded-xl border border-[#e3e8f3] px-3 py-2.5 text-sm text-[#1f2b52] outline-none transition focus:border-[#f39a4f] focus:ring-2 focus:ring-[#ffd6b5]"
            />
            {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email.message}</p> : null}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              {...register("password", { required: "Password is required" })}
              className="w-full rounded-xl border border-[#e3e8f3] px-3 py-2.5 text-sm text-[#1f2b52] outline-none transition focus:border-[#f39a4f] focus:ring-2 focus:ring-[#ffd6b5]"
            />
            {errors.password ? (
              <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f28a32] to-[#ffb16a] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  );
}
