"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Package, PlusCircle, BookOpen, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Log Food", href: "/log", icon: PlusCircle },
    { name: "Resources", href: "/resources", icon: BookOpen },
    { name: "Profile", href: "/profile", icon: User },
];

export function Navbar() {
    const pathname = usePathname();

    if (pathname === "/auth" || pathname === "/") return null;

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl"
        >
            <div className="glass-panel rounded-full px-6 py-3 flex items-center justify-between shadow-xl">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative p-3 rounded-full transition-all duration-300 group",
                                isActive ? "text-sage-green bg-white/50" : "text-charcoal-blue hover:text-sage-green"
                            )}
                        >
                            <Icon className="w-6 h-6" />
                            {isActive && (
                                <motion.div
                                    layoutId="nav-indicator"
                                    className="absolute inset-0 rounded-full bg-sage-green/10 -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-charcoal-blue text-white px-2 py-1 rounded-md pointer-events-none">
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </motion.nav>
    );
}
