"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Search, Filter, Trash2, Check, Plus, X } from "lucide-react";

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
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItemCategory, setNewItemCategory] = useState("");

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
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold font-clash text-charcoal-blue">My Inventory</h1>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-6 py-3 rounded-xl bg-sage-green text-white font-bold hover:bg-deep-emerald transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                        <Plus size={20} /> Add Item
                    </button>
                </div>

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

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="p-6 hover:shadow-xl transition-all group cursor-pointer h-full">
                                <div className="flex flex-col h-full">
                                    {/* Icon and Status Badge */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                            {item.category === "Dairy" ? "🥛" :
                                                item.category === "Vegetables" ? "🥬" :
                                                    item.category === "Fruits" ? "🍎" :
                                                        item.category === "Meat" ? "🥩" : "📦"}
                                        </div>
                                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${item.status === "expired" ? "bg-terracotta/10 text-terracotta" :
                                            item.status === "warning" ? "bg-spiced-ochre/10 text-spiced-ochre" :
                                                "bg-sage-green/10 text-sage-green"
                                            }`}>
                                            {item.expiry}
                                        </span>
                                    </div>

                                    {/* Item Details */}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold font-clash text-charcoal-blue mb-2 group-hover:text-sage-green transition-colors">
                                            {item.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                            <span className="font-medium">{item.quantity}</span>
                                            <span>•</span>
                                            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-xs font-medium">
                                                {item.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => handleSwipe(item.id, "right")}
                                            className="flex-1 py-2 px-3 rounded-lg bg-sage-green/10 text-sage-green hover:bg-sage-green hover:text-white transition-all text-sm font-bold flex items-center justify-center gap-2"
                                        >
                                            <Check size={16} /> Consume
                                        </button>
                                        <button
                                            onClick={() => handleSwipe(item.id, "left")}
                                            className="py-2 px-3 rounded-lg bg-terracotta/10 text-terracotta hover:bg-terracotta hover:text-white transition-all text-sm font-bold"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredItems.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-400">
                        <p>No items found in this category.</p>
                    </div>
                )}
            </div>

            {/* Add Item Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
                            onClick={(e) => {
                                if (e.target === e.currentTarget) setShowAddModal(false);
                            }}
                        >
                            <Card className="w-full max-w-2xl my-8 scrollbar-hide">
                                <div className="p-6 md:p-8">
                                    {/* Header */}
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="flex items-center justify-between mb-6"
                                    >
                                        <h2 className="text-2xl font-bold font-clash text-charcoal-blue">Add New Item</h2>
                                        <button
                                            onClick={() => setShowAddModal(false)}
                                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <X size={24} className="text-gray-400" />
                                        </button>
                                    </motion.div>

                                    {/* Form */}
                                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.15 }}
                                        >
                                            <Input label="Item Name" placeholder="e.g. Organic Milk" required />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="grid grid-cols-2 gap-6"
                                        >
                                            <Input label="Quantity" placeholder="e.g. 1" type="number" required />
                                            <Input label="Unit" placeholder="e.g. L, kg, pcs" required />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.25 }}
                                        >
                                            <Select
                                                label="Category"
                                                value={newItemCategory}
                                                onChange={setNewItemCategory}
                                                options={[
                                                    { value: "dairy", label: "Dairy" },
                                                    { value: "vegetables", label: "Vegetables" },
                                                    { value: "fruits", label: "Fruits" },
                                                    { value: "meat", label: "Meat" },
                                                    { value: "bakery", label: "Bakery" },
                                                    { value: "pantry", label: "Pantry" },
                                                ]}
                                            />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="grid grid-cols-2 gap-6"
                                        >
                                            <Input
                                                type="date"
                                                label="Purchase Date"
                                                onClick={(e) => e.currentTarget.showPicker()}
                                            />
                                            <Input
                                                type="date"
                                                label="Expiry Date"
                                                onClick={(e) => e.currentTarget.showPicker()}
                                            />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.35 }}
                                        >
                                            <Input label="Cost per Unit (Optional)" placeholder="0.00" type="number" step="0.01" />
                                        </motion.div>

                                        {/* Optional: Upload image */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="pt-4 border-t border-gray-200"
                                        >
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 rounded border-gray-300 text-sage-green focus:ring-sage-green/20"
                                                />
                                                <div>
                                                    <span className="text-sm font-medium text-charcoal-blue group-hover:text-sage-green transition-colors">
                                                        Upload image (Optional)
                                                    </span>
                                                    <p className="text-xs text-gray-500">
                                                        Add a photo of the item or receipt
                                                    </p>
                                                </div>
                                            </label>
                                        </motion.div>

                                        {/* Actions */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.45 }}
                                            className="flex gap-3 pt-4"
                                        >
                                            <Button
                                                type="button"
                                                onClick={() => setShowAddModal(false)}
                                                className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit" className="flex-1">
                                                <Plus size={20} /> Add to Inventory
                                            </Button>
                                        </motion.div>
                                    </form>
                                </div>
                            </Card>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
