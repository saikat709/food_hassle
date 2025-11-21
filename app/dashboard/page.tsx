"use client";

import { KitchenHealthWidget } from "@/components/dashboard/KitchenHealthWidget";
import { ExpiringSoonWidget } from "@/components/dashboard/ExpiringSoonWidget";
import { QuickActionsWidget } from "@/components/dashboard/QuickActionsWidget";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
    const { data: session } = useSession();

    // Get greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    // Get first name from full name
    const getFirstName = (fullName: string | null | undefined) => {
        if (!fullName) return "there";
        return fullName.split(" ")[0];
    };

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold font-clash text-charcoal-blue">
                    {getGreeting()}, <span className="text-sage-green">{getFirstName(session?.user?.name)}</span>
                </h1>
                <p className="text-gray-500 mt-2">Here's what's happening in your kitchen today.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Main Widget - Kitchen Health */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-1 lg:col-span-1 h-72 md:h-full"
                >
                    <KitchenHealthWidget />
                </motion.div>

                {/* Secondary Widgets Column */}
                <div className="md:col-span-1 lg:col-span-2 grid grid-rows-2 gap-8 h-full">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="h-full"
                    >
                        <ExpiringSoonWidget />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="h-full"
                    >
                        <QuickActionsWidget />
                    </motion.div>
                </div>
            </div>

            {/* Recent Activity Section (Placeholder) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-12"
            >
                <h2 className="text-2xl font-bold font-clash mb-4">Recent Activity</h2>
                <div className="glass-panel rounded-2xl p-6">
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-sage-green/10 flex items-center justify-center text-xl">
                                        {i === 1 ? "🍎" : i === 2 ? "🥕" : "🥩"}
                                    </div>
                                    <div>
                                        <p className="font-medium text-charcoal-blue">Logged {i === 1 ? "Apples" : i === 2 ? "Carrots" : "Beef"}</p>
                                        <p className="text-xs text-gray-400">2 hours ago</p>
                                    </div>
                                </div>
                                <span className="text-sage-green font-bold text-sm">+2</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
