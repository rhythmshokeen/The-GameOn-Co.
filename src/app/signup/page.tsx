"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupSchema, type SignupInput, checkPasswordStrength } from "@/lib/validation/auth";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const passwordStrength = useMemo(() => {
    if (!password) return null;
    return checkPasswordStrength(password);
  }, [password]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });


  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // Parse response
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        // If JSON parsing fails, the server might be down
        throw new Error("Unable to connect to server. Please try again.");
      }

      if (!response.ok) {
        // Use the error message from the API response
        throw new Error(result.message || result.error || "Registration failed");
      }

      // Success - redirect to sports preferences
      router.push("/sports-preferences");
      router.refresh();
    } catch (err: any) {
      console.error("Signup error:", err);
      
      // Handle different types of errors
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        setError("Unable to connect to server. Please check your internet connection.");
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-8 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Join thousands of sports professionals today
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  {...register("name")}
                  type="text"
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-gameon-blue-500 outline-none transition-all"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-gameon-blue-500 outline-none transition-all"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Phone Number (Optional)
                </label>
                <input
                  {...register("phone")}
                  type="tel"
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-gameon-blue-500 outline-none transition-all"
                  placeholder="+1 234 567 8900"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>


              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => {
                      register("password").onChange(e);
                      setPassword(e.target.value);
                    }}
                    className="block w-full px-4 py-3 pr-12 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-gameon-blue-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                
                {/* Password Strength Meter */}
                {password && passwordStrength && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            passwordStrength.score >= level
                              ? passwordStrength.strength === "weak"
                                ? "bg-red-500"
                                : passwordStrength.strength === "medium"
                                ? "bg-yellow-500"
                                : passwordStrength.strength === "strong"
                                ? "bg-blue-500"
                                : "bg-green-500"
                              : "bg-slate-200 dark:bg-slate-700"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${
                      passwordStrength.strength === "weak"
                        ? "text-red-600"
                        : passwordStrength.strength === "medium"
                        ? "text-yellow-600"
                        : passwordStrength.strength === "strong"
                        ? "text-blue-600"
                        : "text-green-600"
                    }`}>
                      Password strength: {passwordStrength.strength.replace("-", " ")}
                    </p>
                  </div>
                )}
                
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>


              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Date of Birth
                </label>
                <input
                  {...register("dateOfBirth")}
                  type="date"
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-gameon-blue-500 outline-none transition-all"
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  I am a...
                </label>
                <select
                  {...register("role")}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-gameon-blue-500 outline-none transition-all"
                >
                  <option value="">Select Role</option>
                  <option value="ATHLETE">Athlete</option>
                  <option value="COACH">Coach / Scout</option>
                  <option value="ACADEMY">Academy / Organization</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-base flex justify-center items-center gap-2"
            >
              {isLoading && (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
            
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-gameon-blue-600 hover:text-gameon-blue-500"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex relative bg-slate-900 items-center justify-center p-12 overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gameon-blue-500/20 rounded-full blur-3xl pointer-events-none" />
         
         <div className="relative z-10 max-w-lg text-center text-white space-y-8">
             <div className="h-20 w-20 bg-white/10 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center border border-white/20">
                <span className="text-4xl">🏆</span>
             </div>
             <blockquote className="text-2xl font-medium leading-relaxed">
               "The GameOn Co. has completely transformed how we scout talent. The verified stats and video integration make it effortless."
             </blockquote>
             <div>
                <div className="font-bold text-lg">Sarah Johnson</div>
                <div className="text-slate-400">Director of Scouting, Elite FC</div>
             </div>
         </div>
      </div>
    </div>
  );
}
