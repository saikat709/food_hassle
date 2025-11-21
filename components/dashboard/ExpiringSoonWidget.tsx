"use client";

import { Card } from "@/components/ui/Card";
import { Clock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

import { calculateExpiryStatus, getCategoryEmoji } from "@/lib/inventory";
// import { InventoryItem } from "@prisma/client";

interface ExpiringSoonWidgetProps {
    items?: any[]; // Using any for now to avoid type issues, but should be InventoryItem[]
}

export function ExpiringSoonWidget({ items = [] }: ExpiringSoonWidgetProps) {
    // Filter items that are expiring soon (within 3 days) or expired
    const expiringItems = items
        .filter(item => {
            if (!item.expiryDate) return false;
            const daysLeft = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            return daysLeft <= 3;
        })
        .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
        .slice(0, 5); // Show top 5

    return (
        <Card className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold font-clash text-charcoal-blue">Expiring Soon</h3>
                    <p className="text-sm text-gray-500">Use these up!</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-spiced-ochre/10 flex items-center justify-center text-spiced-ochre">
                    <Clock size={18} />
                </div>
            </div>

            <div className="flex-1 overflow-x-auto pb-2 scrollbar-hide">
                {expiringItems.length > 0 ? (
                    <div className="flex gap-3">
                        {expiringItems.map((item) => {
                            const daysLeft = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                            const isExpired = daysLeft < 0;

                            return (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ y: -5 }}
                                    className={`min-w-[100px] p-3 rounded-xl bg-white shadow-md border ${isExpired ? 'border-terracotta/30 bg-terracotta/5' : 'border-gray-100'} flex flex-col items-center gap-2`}
                                >
                                    <span className="text-2xl">{getCategoryEmoji(item.category)}</span>
                                    <span className="font-medium text-sm text-charcoal-blue truncate w-full text-center" title={item.name}>{item.name}</span>
                                    <span className={`text-xs font-bold flex items-center gap-1 ${isExpired ? 'text-terracotta' : 'text-spiced-ochre'}`}>
                                        <AlertTriangle size={10} />
                                        {isExpired ? `${Math.abs(daysLeft)}d ago` : `${daysLeft}d`}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                        <p>No items expiring soon 🎉</p>
                    </div>
                )}
            </div>
        </Card>
    );
}
