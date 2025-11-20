"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Leaf } from "lucide-react";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.push("/dashboard");
    };

    return (
        <div className="fixed inset-0 flex w-full h-full bg-off-white overflow-hidden">
            {/* Left Side - Visuals */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-deep-emerald">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-r from-deep-emerald/80 to-transparent" />

                <div className="relative z-10 p-12 flex flex-col justify-between h-full text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sage-green rounded-full flex items-center justify-center">
                            <Leaf className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold font-clash">Urban Harvest</h1>
                    </div>

                    <div className="max-w-md">
                        <h2 className="text-5xl font-bold font-clash mb-6 leading-tight">
                            Eat Fresh.<br />Waste Less.<br />Live Better.
                        </h2>
                        <p className="text-lg text-gray-200 font-dm-sans">
                            Join the community of urban harvesters making a difference one meal at a time.
                        </p>
                    </div>

                    <div className="text-sm text-gray-400">
                        © 2024 Urban Harvest. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8 text-center lg:text-left"
                    >
                        <h2 className="text-3xl font-bold text-charcoal-blue font-clash mb-2">
                            {isLogin ? "Welcome Back" : "Join the Movement"}
                        </h2>
                        <p className="text-gray-500">
                            {isLogin ? "Enter your details to access your kitchen." : "Start your sustainability journey today."}
                        </p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="space-y-4 overflow-hidden"
                                >
                                    <Input placeholder="Full Name" required />
                                    <div className="grid grid-cols-2 gap-4">
                                        <select className="neumorphic-input w-full px-4 py-3 rounded-xl outline-none text-charcoal-blue bg-transparent">
                                            <option value="">Household Size</option>
                                            <option value="1">1 Person</option>
                                            <option value="2">2 People</option>
                                            <option value="3">3-4 People</option>
                                            <option value="5+">5+ People</option>
                                        </select>
                                        <Input placeholder="Location (City)" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Input type="email" placeholder="Email Address" required />
                        <Input type="password" placeholder="Password" required />

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            isLoading={isLoading}
                        >
                            {isLogin ? "Sign In" : "Create Account"}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-sage-green font-bold hover:underline"
                            >
                                {isLogin ? "Sign Up" : "Log In"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
