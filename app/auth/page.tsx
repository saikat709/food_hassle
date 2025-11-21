"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    Leaf,
    Mail,
    Lock,
    User,
    Users,
    MapPin,
    DollarSign,
    Eye,
    EyeOff,
    Loader2,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { checkPasswordStrength } from "@/lib/validation";

type AuthMode = "login" | "register";

const dietaryOptions = [
    "No Restrictions",
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Halal",
    "Kosher",
];

export default function AuthPage() {
    const router = useRouter();
    const [mode, setMode] = useState<AuthMode>("login");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Login form state
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    // Register form state
    const [registerData, setRegisterData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        householdSize: 1,
        dietaryPreferences: [] as string[],
        budgetRange: "Medium" as "Low" | "Medium" | "High",
        location: "",
    });

    const passwordStrength = checkPasswordStrength(registerData.password);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email: loginData.email,
                password: loginData.password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                setSuccess("Login successful! Redirecting...");
                setTimeout(() => router.push("/dashboard"), 1000);
            }
        } catch (err: any) {
            setError(err.message || "An error occurred during login");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        console.log("Register button clicked");
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Validation
        if (registerData.password !== registerData.confirmPassword) {
            setError("Passwords don't match");
            setIsLoading(false);
            return;
        }

        if (registerData.password.length < 8) {
            setError("Password must be at least 8 characters");
            setIsLoading(false);
            return;
        }

        try {
            console.log("Registering user...");
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Registration failed");
            }

            setSuccess("Registration successful! Logging you in...");

            // Auto-login after registration
            setTimeout(async () => {
                const result = await signIn("credentials", {
                    email: registerData.email,
                    password: registerData.password,
                    redirect: false,
                });

                if (!result?.error) {
                    router.push("/dashboard");
                }
            }, 1000);
        } catch (err: any) {
            console.error("Registration failed:", err);
            setError(err.message || "An error occurred during registration");
        } finally {
            console.log("Registration complete");
            setIsLoading(false);
        }
    };

    const toggleDietaryPreference = (pref: string) => {
        setRegisterData((prev) => ({
            ...prev,
            dietaryPreferences: prev.dietaryPreferences.includes(pref)
                ? prev.dietaryPreferences.filter((p) => p !== pref)
                : [...prev.dietaryPreferences, pref],
        }));
    };

    return (
        <div className="fixed inset-0 flex w-full h-full bg-off-white overflow-hidden">
            {/* Left Side - Visuals */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-deep-emerald via-sage-green to-deep-emerald">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-30" />

                {/* Animated gradient overlay */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-deep-emerald/90 via-transparent to-sage-green/90"
                    animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />

                {/* Floating shapes */}
                <motion.div
                    className="absolute top-20 left-20 w-32 h-32 bg-sage-green/20 rounded-full blur-3xl"
                    animate={{
                        y: [0, -30, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-20 w-40 h-40 bg-spiced-ochre/20 rounded-full blur-3xl"
                    animate={{
                        y: [0, 30, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                <div className="relative z-10 p-12 flex flex-col justify-between h-full text-white">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                            <Leaf className="text-white" size={24} />
                        </div>
                        <h1 className="text-3xl font-bold font-clash">Food Hassle</h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-md"
                    >
                        <h2 className="text-6xl font-bold font-clash mb-6 leading-tight">
                            Eat Fresh.
                            <br />
                            <span className="text-spiced-ochre">Waste Less.</span>
                            <br />
                            Live Better.
                        </h2>
                        <p className="text-xl text-gray-200 font-dm-sans leading-relaxed">
                            Join the community of urban harvesters making a difference one meal at a time.
                        </p>

                        <div className="mt-8 space-y-4">
                            {["Track your food inventory", "Reduce waste by 40%", "Save money on groceries"].map(
                                (feature, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + i * 0.1 }}
                                        className="flex items-center gap-3"
                                    >
                                        <CheckCircle2 className="text-spiced-ochre" size={20} />
                                        <span className="text-gray-100">{feature}</span>
                                    </motion.div>
                                )
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-sm text-gray-300"
                    >
                        © 2024 Food Hassle. All rights reserved.
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Auth Forms */}
            <div className="w-full lg:w-1/2 relative overflow-y-auto">
                <div className="min-h-full flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        {/* Mode Switcher */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-8"
                        >
                            <div className="glass-panel rounded-2xl p-2 flex gap-2">
                                <button
                                    onClick={() => {
                                        setMode("login");
                                        setError("");
                                        setSuccess("");
                                    }}
                                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${mode === "login"
                                        ? "bg-deep-emerald text-white shadow-lg"
                                        : "text-charcoal-blue hover:bg-white/50"
                                        }`}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => {
                                        setMode("register");
                                        setError("");
                                        setSuccess("");
                                    }}
                                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${mode === "register"
                                        ? "bg-deep-emerald text-white shadow-lg"
                                        : "text-charcoal-blue hover:bg-white/50"
                                        }`}
                                >
                                    Register
                                </button>
                            </div>
                        </motion.div>

                        {/* Error/Success Messages */}
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                                >
                                    <AlertCircle className="text-red-500" size={20} />
                                    <p className="text-red-700 text-sm">{error}</p>
                                </motion.div>
                            )}
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
                                >
                                    <CheckCircle2 className="text-green-500" size={20} />
                                    <p className="text-green-700 text-sm">{success}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Forms */}
                        <AnimatePresence mode="wait">
                            {mode === "login" ? (
                                <motion.form
                                    key="login"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handleLogin}
                                    className="space-y-5"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <label className="block text-sm font-semibold text-charcoal-blue mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type="email"
                                                required
                                                value={loginData.email}
                                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-sage-green focus:ring-4 focus:ring-sage-green/10 transition-all outline-none"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <label className="block text-sm font-semibold text-charcoal-blue mb-2">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={loginData.password}
                                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                                className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-sage-green focus:ring-4 focus:ring-sage-green/10 transition-all outline-none"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </motion.div>

                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-4 bg-gradient-to-r from-deep-emerald to-sage-green text-white font-bold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} />
                                                Logging in...
                                            </>
                                        ) : (
                                            "Sign In"
                                        )}
                                    </motion.button>
                                </motion.form>
                            ) : (
                                <motion.form
                                    key="register"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handleRegister}
                                    className="space-y-4"
                                >
                                    {/* Full Name */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <label className="block text-sm font-semibold text-charcoal-blue mb-2">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type="text"
                                                required
                                                value={registerData.fullName}
                                                onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-sage-green focus:ring-4 focus:ring-sage-green/10 transition-all outline-none"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Email */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 }}
                                    >
                                        <label className="block text-sm font-semibold text-charcoal-blue mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type="email"
                                                required
                                                value={registerData.email}
                                                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-sage-green focus:ring-4 focus:ring-sage-green/10 transition-all outline-none"
                                                placeholder="testuser2@example.com"
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Password */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <label className="block text-sm font-semibold text-charcoal-blue mb-2">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={registerData.password}
                                                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                                className="w-full pl-12 pr-12 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-sage-green focus:ring-4 focus:ring-sage-green/10 transition-all outline-none"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        {registerData.password && (
                                            <div className="mt-2">
                                                <div className="flex gap-1 mb-1">
                                                    {[1, 2, 3].map((i) => (
                                                        <div
                                                            key={i}
                                                            className={`h-1 flex-1 rounded-full transition-all ${passwordStrength.strength === "weak" && i === 1
                                                                ? "bg-red-500"
                                                                : passwordStrength.strength === "medium" && i <= 2
                                                                    ? "bg-yellow-500"
                                                                    : passwordStrength.strength === "strong"
                                                                        ? "bg-green-500"
                                                                        : "bg-gray-200"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-xs text-gray-600">{passwordStrength.feedback}</p>
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* Confirm Password */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.25 }}
                                    >
                                        <label className="block text-sm font-semibold text-charcoal-blue mb-2">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                required
                                                value={registerData.confirmPassword}
                                                onChange={(e) =>
                                                    setRegisterData({ ...registerData, confirmPassword: e.target.value })
                                                }
                                                className="w-full pl-12 pr-12 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-sage-green focus:ring-4 focus:ring-sage-green/10 transition-all outline-none"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </motion.div>

                                    {/* Household Size */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <label className="block text-sm font-semibold text-charcoal-blue mb-2">
                                            Household Size
                                        </label>
                                        <div className="relative">
                                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <select
                                                value={registerData.householdSize}
                                                onChange={(e) =>
                                                    setRegisterData({ ...registerData, householdSize: parseInt(e.target.value) })
                                                }
                                                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-sage-green focus:ring-4 focus:ring-sage-green/10 transition-all outline-none appearance-none cursor-pointer"
                                            >
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                                                    <option key={size} value={size}>
                                                        {size} {size === 1 ? "person" : "people"}
                                                    </option>
                                                ))}
                                                <option value={11}>10+ people</option>
                                            </select>
                                        </div>
                                    </motion.div>

                                    {/* Dietary Preferences */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.35 }}
                                    >
                                        <label className="block text-sm font-semibold text-charcoal-blue mb-2">
                                            Dietary Preferences
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {dietaryOptions.map((option) => (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    onClick={() => toggleDietaryPreference(option)}
                                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${registerData.dietaryPreferences.includes(option)
                                                        ? "bg-sage-green text-white shadow-md"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Budget Range */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <label className="block text-sm font-semibold text-charcoal-blue mb-2">
                                            Budget Range
                                        </label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <select
                                                value={registerData.budgetRange}
                                                onChange={(e) =>
                                                    setRegisterData({
                                                        ...registerData,
                                                        budgetRange: e.target.value as "Low" | "Medium" | "High",
                                                    })
                                                }
                                                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-sage-green focus:ring-4 focus:ring-sage-green/10 transition-all outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="Low">Low Budget</option>
                                                <option value="Medium">Medium Budget</option>
                                                <option value="High">High Budget</option>
                                            </select>
                                        </div>
                                    </motion.div>

                                    {/* Location */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.45 }}
                                    >
                                        <label className="block text-sm font-semibold text-charcoal-blue mb-2">
                                            Location <span className="text-gray-400 text-xs">(Optional)</span>
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type="text"
                                                value={registerData.location}
                                                onChange={(e) => setRegisterData({ ...registerData, location: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-sage-green focus:ring-4 focus:ring-sage-green/10 transition-all outline-none"
                                                placeholder="City, Country"
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Submit Button */}
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-4 bg-gradient-to-r from-deep-emerald to-sage-green text-white font-bold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} />
                                                Creating account...
                                            </>
                                        ) : (
                                            "Create Account"
                                        )}
                                    </motion.button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
