"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Search, Filter, Trash2, Check } from "lucide-react";

// Mock Data
const initialItems = [
    { id: 1, name: "Organic Milk", category: "Dairy", quantity: "1L", expiry: "2 days", status: "warning" },
    { id: 2, name: "Spinach", category: "Vegetables", quantity: "200g", expiry: "3 days", status: "warning" },
    { id: 3, name: "Chicken Breast", category: "Meat", quantity: "500g", expiry: "5 days", status: "good" },
    { id: 4, name: "Greek Yogurt", category: "Dairy", quantity: "500g", expiry: "1 week", status: "good" },
    { id: 5, name: "Apples", category: "Fruits", quantity: "6 pcs", expiry: "2 weeks", status: "good" },
    { id: 6, name: "Sourdough Bread", category: "Bakery", expiry: "Expired", status: "expired" },
];

const categories = ["All", "Dairy", "Vegetables", "Fruits", "Meat", "Bakery"];

export default function InventoryPage() {
    const [items, setItems] = useState(initialItems);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredItems = items.filter((item) => {
        const matchesCategory = activeCategory === "All" || item.category === activeCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleSwipe = (id: number, direction: "left" | "right") => {
        // In a real app, this would trigger an API call
        setTimeout(() => {
            setItems((prev) => prev.filter((item) => item.id !== id));
        }, 200);
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
            >
                <h1 className="text-3xl font-bold font-clash text-charcoal-blue">My Kitchen</h1>

                {/* Search and Filter */}
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sage-green/20 transition-all"
                        />
                    </div>
                    <button className="p-3 rounded-xl bg-white/50 border border-white/20 text-charcoal-blue hover:bg-white transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>

                {/* Category Pills */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat
                                    ? "bg-sage-green text-white shadow-lg scale-105"
                                    : "bg-white/40 text-charcoal-blue hover:bg-white/60"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Inventory List */}
            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {filteredItems.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={(_, info) => {
                                if (info.offset.x < -100) handleSwipe(item.id, "left");
                                if (info.offset.x > 100) handleSwipe(item.id, "right");
                            }}
                            className="relative group"
                        >
                            {/* Swipe Actions Background */}
                            <div className="absolute inset-0 rounded-2xl flex items-center justify-between px-6 pointer-events-none">
                                <div className="flex items-center gap-2 text-terracotta font-bold opacity-0 group-active:opacity-100 transition-opacity">
                                    <Trash2 /> Delete
                                </div>
                                <div className="flex items-center gap-2 text-sage-green font-bold opacity-0 group-active:opacity-100 transition-opacity">
                                    Consume <Check />
                                </div>
                            </div>

                            <Card className="relative z-10 flex items-center justify-between p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-off-white`}>
                                        {item.category === "Dairy" ? "🥛" :
                                            item.category === "Vegetables" ? "🥬" :
                                                item.category === "Fruits" ? "🍎" :
                                                    item.category === "Meat" ? "🥩" : "📦"}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-charcoal-blue">{item.name}</h3>
                                        <p className="text-xs text-gray-500">{item.quantity} • {item.category}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-1">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === "expired" ? "bg-terracotta/10 text-terracotta" :
                                            item.status === "warning" ? "bg-spiced-ochre/10 text-spiced-ochre" :
                                                "bg-sage-green/10 text-sage-green"
                                        }`}>
                                        {item.expiry}
                                    </span>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredItems.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <p>No items found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
