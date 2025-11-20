"use client";

import { Card } from "@/components/ui/Card";
import { Clock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const expiringItems = [
    { id: 1, name: "Milk", daysLeft: 1, image: "🥛" },
    { id: 2, name: "Spinach", daysLeft: 2, image: "🥬" },
    { id: 3, name: "Yogurt", daysLeft: 2, image: "🥣" },
    { id: 4, name: "Bread", daysLeft: 3, image: "🍞" },
];

export function ExpiringSoonWidget() {
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
                <div className="flex gap-3">
                    {expiringItems.map((item) => (
                        <motion.div
                            key={item.id}
                            whileHover={{ y: -5 }}
                            className="min-w-[100px] p-3 rounded-xl bg-off-white border border-gray-100 flex flex-col items-center gap-2"
                        >
                            <span className="text-2xl">{item.image}</span>
                            <span className="font-medium text-sm text-charcoal-blue">{item.name}</span>
                            <span className="text-xs font-bold text-spiced-ochre flex items-center gap-1">
                                <AlertTriangle size={10} />
                                {item.daysLeft}d
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
