"use client";

import { Card } from "@/components/ui/Card";
import { Scan, Plus, BookOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const actions = [
    { name: "Scan Receipt", icon: Scan, color: "bg-sage-green", href: "/log" },
    { name: "Log Food", icon: Plus, color: "bg-deep-emerald", href: "/log" },
    { name: "Tips", icon: BookOpen, color: "bg-spiced-ochre", href: "/resources" },
];

export function QuickActionsWidget() {
    return (
        <Card className="h-full flex flex-col justify-center">
            <h3 className="text-lg font-bold font-clash text-charcoal-blue mb-4">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-3">
                {actions.map((action) => (
                    <Link key={action.name} href={action.href}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-stone-100 to-stone-200 hover:from-stone-200 hover:to-stone-300 transition-all cursor-pointer"
                        >
                            <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center text-white shadow-lg`}>
                                <action.icon size={20} />
                            </div>
                            <span className="text-xs font-medium text-center text-charcoal-blue leading-tight">
                                {action.name}
                            </span>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </Card>
    );
}
