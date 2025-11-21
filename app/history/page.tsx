"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import { Search, Calendar, Filter, TrendingDown, TrendingUp, Edit2, Trash2, Loader2 } from "lucide-react";
import { Consumption } from "@/types/consumption";

const categories = ["All", "Fruits", "Vegetables", "Dairy", "Meat", "Bakery", "Pantry"];

export default function ConsumptionHistoryPage() {
    const [consumptionHistory, setConsumptionHistory] = useState<Consumption[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [dateFilter, setDateFilter] = useState("all"); // all, today, week, month
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Consumption>>({});

    // Load consumption data on component mount
    useEffect(() => {
        loadConsumptionHistory();
    }, []);

    const loadConsumptionHistory = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/log-consumption');

            if (!response.ok) {
                throw new Error('Failed to fetch consumption history');
            }

            const data = await response.json();
            setConsumptionHistory(data);
        } catch (error: any) {
            console.error('Error loading consumption history:', error);
            toast.error('Failed to load consumption history. Please try again.');
            setConsumptionHistory([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (consumption: Consumption) => {
        setEditingId(consumption.id);
        setEditForm({
            itemName: consumption.itemName,
            quantity: consumption.quantity,
            unit: consumption.unit,
            category: consumption.category,
            consumptionDate: consumption.consumptionDate,
            consumptionTime: consumption.consumptionTime,
            notes: consumption.notes,
            removedFromInventory: consumption.removedFromInventory,
        });
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;

        try {
            const response = await fetch(`/api/log-consumption/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editForm),
            });

            if (response.ok) {
                await loadConsumptionHistory(); // Reload data
                setEditingId(null);
                setEditForm({});
                toast.success('Consumption updated successfully!');
            } else {
                const error = await response.json();
                toast.error(`Failed to update consumption: ${error.error}`);
            }
        } catch (error) {
            console.error('Error updating consumption:', error);
            toast.error('An error occurred while updating consumption. Please try again.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this consumption entry?')) {
            return;
        }

        try {
            const response = await fetch(`/api/log-consumption/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await loadConsumptionHistory(); // Reload data
                toast.success('Consumption deleted successfully!');
            } else {
                const error = await response.json();
                toast.error(`Failed to delete consumption: ${error.error}`);
            }
        } catch (error) {
            console.error('Error deleting consumption:', error);
            toast.error('An error occurred while deleting consumption. Please try again.');
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const filteredHistory = consumptionHistory.filter((log) => {
        const matchesCategory = activeCategory === "All" || log.category === activeCategory;
        const matchesSearch = log.itemName.toLowerCase().includes(searchQuery.toLowerCase());

        // Date filtering logic
        const logDate = new Date(log.consumptionDate);
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
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold font-clash text-lg text-charcoal-blue">
                        Consumption Logs ({filteredHistory.length})
                    </h3>
                    <button
                        onClick={loadConsumptionHistory}
                        className="px-4 py-2 bg-sage-green text-white rounded-lg hover:bg-sage-green/90 transition-colors flex items-center gap-2"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
                        Refresh
                    </button>
                </div>
                <div className="space-y-3">
                    {filteredHistory.map((log, index) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                            {editingId === log.id ? (
                                // Edit Form
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Item Name"
                                            value={editForm.itemName || ''}
                                            onChange={(e) => setEditForm({ ...editForm, itemName: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/20"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Quantity"
                                            value={editForm.quantity || ''}
                                            onChange={(e) => setEditForm({ ...editForm, quantity: parseFloat(e.target.value) })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/20"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Unit"
                                            value={editForm.unit || ''}
                                            onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/20"
                                        />
                                        <input
                                            type="date"
                                            value={editForm.consumptionDate || ''}
                                            onChange={(e) => setEditForm({ ...editForm, consumptionDate: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/20"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="time"
                                            value={editForm.consumptionTime || ''}
                                            onChange={(e) => setEditForm({ ...editForm, consumptionTime: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/20"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Notes (optional)"
                                            value={editForm.notes || ''}
                                            onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/20"
                                        />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={editForm.removedFromInventory || false}
                                                onChange={(e) => setEditForm({ ...editForm, removedFromInventory: e.target.checked })}
                                                className="rounded border-gray-300 text-sage-green focus:ring-sage-green/20"
                                            />
                                            <span className="text-sm">Removed from inventory</span>
                                        </label>
                                        <div className="flex gap-2 ml-auto">
                                            <button
                                                onClick={handleSaveEdit}
                                                className="px-4 py-2 bg-sage-green text-white rounded-lg hover:bg-sage-green/90 transition-colors"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Display Mode
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-sage-green/10 flex items-center justify-center text-2xl">
                                            {log.category === "Fruits" ? "🍎" :
                                                log.category === "Dairy" ? "🥛" :
                                                    log.category === "Vegetables" ? "🥬" :
                                                        log.category === "Meat" ? "🥩" :
                                                            log.category === "Bakery" ? "🍞" : "📦"}
                                        </div>
                                        <div>
                                            <p className="font-bold text-charcoal-blue">{log.itemName}</p>
                                            <p className="text-sm text-gray-500">
                                                {log.quantity} {log.unit} • {log.consumptionDate}
                                                {log.consumptionTime && ` at ${log.consumptionTime}`}
                                                {log.notes && ` • ${log.notes}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                            {log.category || 'Uncategorized'}
                                        </span>
                                        {log.removedFromInventory && (
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-sage-green/10 text-sage-green">
                                                From Inventory
                                            </span>
                                        )}
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => handleEdit(log)}
                                                className="p-2 text-gray-400 hover:text-sage-green hover:bg-sage-green/10 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(log.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}

                    {loading && (
                        <div className="text-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-sage-green mb-2" />
                            <p className="text-gray-500">Loading consumption history...</p>
                        </div>
                    )}

                    {!loading && filteredHistory.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            <p>No consumption logs found matching your filters.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
