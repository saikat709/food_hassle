"use client";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { Leaf } from "lucide-react";

export default function AuthPage() {
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
                        <h1 className="text-2xl font-bold font-clash">Food Hassle</h1>
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

            {/* Right Side - Google Auth */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8 text-center lg:text-left"
                    >
                        <h2 className="text-3xl font-bold text-charcoal-blue font-clash mb-2">
                            Welcome
                        </h2>
                        <p className="text-gray-500">
                            Sign in with Google to continue.
                        </p>
                    </motion.div>

                    <button
                        onClick={() => signIn("google")}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 font-bold text-lg"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M21.805 10.023h-9.765v3.955h5.586c-.241 1.236-1.457 3.627-5.586 3.627-3.357 0-6.09-2.782-6.09-6.205s2.733-6.205 6.09-6.205c1.914 0 3.197.816 3.933 1.516l2.687-2.613c-1.729-1.613-3.957-2.613-6.62-2.613-5.514 0-9.99 4.477-9.99 9.915s4.476 9.915 9.99 9.915c5.742 0 9.547-4.027 9.547-9.72 0-.654-.07-1.154-.154-1.615z" fill="#fff"/>
                        </svg>
                        Continue with Google
                    </button>
                </div>
            </div>
        </div>
    );
}
