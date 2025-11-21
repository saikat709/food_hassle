"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Search, Filter, Trash2, Check, Plus, X, AlertCircle, Loader2 } from "lucide-react";
import { InventoryItemWithStatus, InventoryStats } from "@/types/inventory";
import { getCategoryEmoji } from "@/lib/inventory";

const categories = ["All", "Dairy", "Vegetables", "Fruits", "Meat", "Bakery", "Pantry", "Beverages", "Snacks"];

export default function InventoryPage() {
    // State
    const [items, setItems] = useState<InventoryItemWithStatus[]>([]);
    const [stats, setStats] = useState<InventoryStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter State
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    // Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [newItem, setNewItem] = useState({
        name: "",
        quantity: "",
        unit: "",
        category: "Dairy",
        purchaseDate: new Date().toISOString().split('T')[0],
        expiryDate: "",
        costPerUnit: "",
    });

    // Fetch Data
    const fetchInventory = useCallback(async () => {
        try {
            setLoading(true);
            // Build query string
            const params = new URLSearchParams();
            if (activeCategory !== "All") params.append("category", activeCategory);
            if (searchQuery) params.append("search", searchQuery);

            const [itemsRes, statsRes] = await Promise.all([
                fetch(`/api/inventory?${params.toString()}`),
                fetch('/api/inventory/stats')
            ]);

            if (!itemsRes.ok || !statsRes.ok) throw new Error("Failed to fetch data");

            const itemsData = await itemsRes.json();
            const statsData = await statsRes.json();

            setItems(itemsData);
            setStats(statsData);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Failed to load inventory. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [activeCategory, searchQuery]);

    // Initial load and filter changes
    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => {
            fetchInventory();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchInventory]);

    // Handlers
    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem),
            });

            if (!res.ok) throw new Error("Failed to add item");

            await fetchInventory();
            setShowAddModal(false);
            // Reset form
            setNewItem({
                name: "",
                quantity: "",
                unit: "",
                category: "Dairy",
                purchaseDate: new Date().toISOString().split('T')[0],
                expiryDate: "",
                costPerUnit: "",
            });
        } catch (err) {
            console.error(err);
            alert("Failed to add item. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            const res = await fetch(`/api/inventory/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error("Failed to delete item");

            // Optimistic update
            setItems(prev => prev.filter(item => item.id !== id));
            // Refresh stats in background
            const statsRes = await fetch('/api/inventory/stats');
            if (statsRes.ok) setStats(await statsRes.json());
        } catch (err) {
            console.error(err);
            alert("Failed to delete item.");
        }
    };

    const handleConsume = async (id: string) => {
        // For now, consuming just deletes the item
        // In future, this could move it to a consumption log
        await handleDelete(id);
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

                {/* Stats Overview */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="p-4 bg-white/50">
                            <p className="text-sm text-gray-500">Total Items</p>
                            <p className="text-2xl font-bold text-charcoal-blue">{stats.totalItems}</p>
                        </Card>
                        <Card className="p-4 bg-white/50">
                            <p className="text-sm text-gray-500">Expiring Soon</p>
                            <p className="text-2xl font-bold text-spiced-ochre">{stats.expiringSoon}</p>
                        </Card>
                        <Card className="p-4 bg-white/50">
                            <p className="text-sm text-gray-500">Expired</p>
                            <p className="text-2xl font-bold text-terracotta">{stats.expired}</p>
                        </Card>
                        <Card className="p-4 bg-white/50">
                            <p className="text-sm text-gray-500">Total Value</p>
                            <p className="text-2xl font-bold text-sage-green">${stats.totalValue.toFixed(2)}</p>
                        </Card>
                    </div>
                )}

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
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-sage-green" />
                </div>
            ) : error ? (
                <div className="text-center py-12 text-terracotta flex flex-col items-center gap-2">
                    <AlertCircle size={32} />
                    <p>{error}</p>
                    <Button onClick={() => fetchInventory()} variant="outline">Try Again</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {items.map((item, index) => (
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
                                                {getCategoryEmoji(item.category)}
                                            </div>
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${item.status === "expired" ? "bg-terracotta/10 text-terracotta" :
                                                    item.status === "warning" ? "bg-spiced-ochre/10 text-spiced-ochre" :
                                                        "bg-sage-green/10 text-sage-green"
                                                }`}>
                                                {item.expiryLabel}
                                            </span>
                                        </div>

                                        {/* Item Details */}
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold font-clash text-charcoal-blue mb-2 group-hover:text-sage-green transition-colors">
                                                {item.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                                <span className="font-medium">{item.quantity} {item.unit}</span>
                                                <span>•</span>
                                                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-xs font-medium">
                                                    {item.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                            <button
                                                onClick={() => handleConsume(item.id)}
                                                className="flex-1 py-2 px-3 rounded-lg bg-sage-green/10 text-sage-green hover:bg-sage-green hover:text-white transition-all text-sm font-bold flex items-center justify-center gap-2"
                                            >
                                                <Check size={16} /> Consume
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
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

                    {items.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-400">
                            <p>No items found. Add some items to get started!</p>
                        </div>
                    )}
                </div>
            )}

            {/* Add Item Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
                        />

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
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold font-clash text-charcoal-blue">Add New Item</h2>
                                        <button
                                            onClick={() => setShowAddModal(false)}
                                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <X size={24} className="text-gray-400" />
                                        </button>
                                    </div>

                                    <form className="space-y-6" onSubmit={handleAddItem}>
                                        <Input
                                            label="Item Name"
                                            placeholder="e.g. Organic Milk"
                                            required
                                            value={newItem.name}
                                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                        />

                                        <div className="grid grid-cols-2 gap-6">
                                            <Input
                                                label="Quantity"
                                                placeholder="e.g. 1"
                                                type="number"
                                                required
                                                value={newItem.quantity}
                                                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                                            />
                                            <Input
                                                label="Unit"
                                                placeholder="e.g. L, kg, pcs"
                                                required
                                                value={newItem.unit}
                                                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                                            />
                                        </div>

                                        <Select
                                            label="Category"
                                            value={newItem.category}
                                            onChange={(val) => setNewItem({ ...newItem, category: val })}
                                            options={categories.filter(c => c !== "All").map(c => ({ value: c, label: c }))}
                                        />

                                        <div className="grid grid-cols-2 gap-6">
                                            <Input
                                                type="date"
                                                label="Purchase Date"
                                                value={newItem.purchaseDate}
                                                onChange={(e) => setNewItem({ ...newItem, purchaseDate: e.target.value })}
                                            />
                                            <Input
                                                type="date"
                                                label="Expiry Date"
                                                value={newItem.expiryDate}
                                                onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                                            />
                                        </div>

                                        <Input
                                            label="Cost per Unit (Optional)"
                                            placeholder="0.00"
                                            type="number"
                                            step="0.01"
                                            value={newItem.costPerUnit}
                                            onChange={(e) => setNewItem({ ...newItem, costPerUnit: e.target.value })}
                                        />

                                        <div className="flex gap-3 pt-4">
                                            <Button
                                                type="button"
                                                onClick={() => setShowAddModal(false)}
                                                className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                disabled={submitting}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit" className="flex-1" disabled={submitting}>
                                                {submitting ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> Add to Inventory</>}
                                            </Button>
                                        </div>
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
