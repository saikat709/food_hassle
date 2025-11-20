"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Search, Calendar, Filter, TrendingDown, TrendingUp } from "lucide-react";

// Mock consumption history data
const consumptionHistory = [
    { id: 1, item: "Apples", quantity: "2 pcs", category: "Fruits", date: "2024-01-20", time: "10:30 AM", removedFromInventory: true },
    { id: 2, item: "Milk", quantity: "250ml", category: "Dairy", date: "2024-01-20", time: "08:15 AM", removedFromInventory: true },
    { id: 3, item: "Bread", quantity: "2 slices", category: "Bakery", date: "2024-01-19", time: "07:45 PM", removedFromInventory: false },
    { id: 4, item: "Chicken Breast", quantity: "200g", category: "Meat", date: "2024-01-19", time: "06:30 PM", removedFromInventory: true },
    { id: 5, item: "Spinach", quantity: "100g", category: "Vegetables", date: "2024-01-19", time: "12:00 PM", removedFromInventory: true },
    { id: 6, item: "Greek Yogurt", quantity: "150g", category: "Dairy", date: "2024-01-18", time: "09:00 AM", removedFromInventory: true },
    { id: 7, item: "Bananas", quantity: "3 pcs", category: "Fruits", date: "2024-01-18", time: "02:30 PM", removedFromInventory: false },
    { id: 8, item: "Rice", quantity: "1 cup", category: "Pantry", date: "2024-01-17", time: "07:00 PM", removedFromInventory: true },
    { id: 9, item: "Eggs", quantity: "2 pcs", category: "Dairy", date: "2024-01-17", time: "08:00 AM", removedFromInventory: true },
    { id: 10, item: "Tomatoes", quantity: "3 pcs", category: "Vegetables", date: "2024-01-16", time: "06:45 PM", removedFromInventory: true },
];

const categories = ["All", "Fruits", "Vegetables", "Dairy", "Meat", "Bakery", "Pantry"];

export default function ConsumptionHistoryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [dateFilter, setDateFilter] = useState("all"); // all, today, week, month

    const filteredHistory = consumptionHistory.filter((log) => {
        const matchesCategory = activeCategory === "All" || log.category === activeCategory;
        const matchesSearch = log.item.toLowerCase().includes(searchQuery.toLowerCase());

        // Date filtering logic
        const logDate = new Date(log.date);
        const today = new Date();
        const matchesDate =
            dateFilter === "all" ||
            (dateFilter === "today" && logDate.toDateString() === today.toDateString()) ||
            (dateFilter === "week" && (today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24) <= 7) ||
            (dateFilter === "month" && (today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24) <= 30);

        return matchesCategory && matchesSearch && matchesDate;
    });

    // Calculate stats
    const totalItems = filteredHistory.length;
    const removedFromInventory = filteredHistory.filter(log => log.removedFromInventory).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold font-clash text-charcoal-blue mb-2">Consumption History</h1>
                <p className="text-gray-500">Track and analyze your food consumption over time</p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Logged</p>
                                <p className="text-3xl font-bold text-charcoal-blue">{totalItems}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-sage-green/10 flex items-center justify-center">
                                <TrendingUp className="text-sage-green" size={24} />
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">From Inventory</p>
                                <p className="text-3xl font-bold text-charcoal-blue">{removedFromInventory}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-spiced-ochre/10 flex items-center justify-center">
                                <TrendingDown className="text-spiced-ochre" size={24} />
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Categories</p>
                                <p className="text-3xl font-bold text-charcoal-blue">{new Set(filteredHistory.map(log => log.category)).size}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center">
                                <Filter className="text-terracotta" size={24} />
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Filters */}
            <Card className="p-6">
                <div className="space-y-4">
                    {/* Search and Date Filter */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-off-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-green/20 transition-all"
                            />
                        </div>
                        <div className="flex gap-2">
                            {["all", "today", "week", "month"].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setDateFilter(filter)}
                                    className={`px-4 py-3 rounded-xl font-medium transition-all ${dateFilter === filter
                                            ? "bg-sage-green text-white shadow-md"
                                            : "bg-off-white text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    {filter === "all" ? "All Time" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCategory === category
                                        ? "bg-sage-green text-white shadow-md"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* History List */}
            <Card className="p-6">
                <h3 className="font-bold font-clash text-lg mb-4 text-charcoal-blue">
                    Consumption Logs ({filteredHistory.length})
                </h3>
                <div className="space-y-3">
                    {filteredHistory.map((log, index) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-sage-green/10 flex items-center justify-center text-2xl">
                                    {log.category === "Fruits" ? "🍎" :
                                        log.category === "Dairy" ? "🥛" :
                                            log.category === "Vegetables" ? "🥬" :
                                                log.category === "Meat" ? "🥩" :
                                                    log.category === "Bakery" ? "🍞" : "📦"}
                                </div>
                                <div>
                                    <p className="font-bold text-charcoal-blue">{log.item}</p>
                                    <p className="text-sm text-gray-500">{log.quantity} • {log.date} at {log.time}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                    {log.category}
                                </span>
                                {log.removedFromInventory && (
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-sage-green/10 text-sage-green">
                                        From Inventory
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {filteredHistory.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            <p>No consumption logs found matching your filters.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
