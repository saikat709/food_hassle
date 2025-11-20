"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { Camera, Upload, Plus, X, Leaf, Sparkles, Calendar, ExternalLink } from "lucide-react";

export default function LogFoodPage() {
    const [activeTab, setActiveTab] = useState<"quick" | "detailed">("quick");
    const [image, setImage] = useState<string | null>(null);
    const [category, setCategory] = useState("");
    const [overflow, setOverflow] = useState("hidden");
    const [randomTip, setRandomTip] = useState<{ fact: string; tip: string } | null>(null);

    const tips = [
        {
            fact: "Logging your food can reduce household waste by up to 30%. You're doing great!",
            tip: "Store bananas separately from other fruits to prevent them from ripening too fast."
        },
        {
            fact: "The average family throws away $1,500 worth of food every year.",
            tip: "Keep your fridge at 40°F (4°C) or below to keep food fresh longer."
        },
        {
            fact: "Food waste in landfills generates methane, a potent greenhouse gas.",
            tip: "Freeze leftovers if you won't eat them within 3 days."
        },
        {
            fact: "Ugly fruits and vegetables are just as nutritious as the pretty ones.",
            tip: "Use overripe fruit for smoothies or baking instead of throwing it away."
        },
        {
            fact: "Planning meals ahead is the #1 way to reduce food waste.",
            tip: "Check your pantry before shopping to avoid buying duplicates."
        }
    ];

    useEffect(() => {
        setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold font-clash text-charcoal-blue mb-2">Log Consumption</h1>
                <p className="text-gray-500 text-lg">Track what you've consumed today</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tabs */}
                    <div className="flex p-1 bg-white/50 rounded-xl backdrop-blur-sm shadow-sm">
                        <button
                            onClick={() => setActiveTab("quick")}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === "quick"
                                ? "bg-white text-sage-green shadow-md"
                                : "text-gray-400 hover:text-charcoal-blue"
                                }`}
                        >
                            Quick Log
                        </button>
                        <button
                            onClick={() => setActiveTab("detailed")}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === "detailed"
                                ? "bg-white text-sage-green shadow-md"
                                : "text-gray-400 hover:text-charcoal-blue"
                                }`}
                        >
                            Detailed Log
                        </button>
                    </div>

                    <Card className="p-6 md:p-8">
                        <form className="space-y-6">
                            {/* Basic Fields - Always Visible */}
                            <Input label="Item Name" placeholder="e.g. Bananas" />

                            <div className="grid grid-cols-2 gap-6">
                                <Input label="Quantity Consumed" placeholder="e.g. 2" type="number" />
                                <Input label="Unit" placeholder="e.g. pcs" />
                            </div>

                            <Input
                                type="date"
                                label="Date Consumed"
                                onClick={(e) => e.currentTarget.showPicker()}
                            />

                            {activeTab === "detailed" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="pt-6 space-y-6"
                                >
                                    <Select
                                        label="Category"
                                        value={category}
                                        onChange={setCategory}
                                        options={[
                                            { value: "dairy", label: "Dairy" },
                                            { value: "vegetables", label: "Vegetables" },
                                            { value: "fruits", label: "Fruits" },
                                            { value: "meat", label: "Meat" },
                                            { value: "bakery", label: "Bakery" },
                                            { value: "pantry", label: "Pantry" },
                                        ]}
                                    />

                                    <Input
                                        type="time"
                                        label="Time Consumed (Optional)"
                                        onClick={(e) => e.currentTarget.showPicker()}
                                    />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Notes (Optional)
                                        </label>
                                        <textarea
                                            className="w-full px-4 py-3 rounded-xl bg-off-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-green/20 transition-all resize-none"
                                            rows={3}
                                            placeholder="Add any notes about this consumption..."
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Optional Inventory Integration */}
                            <div className="pt-4 border-t border-gray-200">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-gray-300 text-sage-green focus:ring-sage-green/20"
                                    />
                                    <div>
                                        <span className="text-sm font-medium text-charcoal-blue group-hover:text-sage-green transition-colors">
                                            Also remove from inventory
                                        </span>
                                        <p className="text-xs text-gray-500">
                                            Reduce the quantity in your inventory by the consumed amount
                                        </p>
                                    </div>
                                </label>
                            </div>

                            <Button className="w-full py-4 text-lg shadow-xl shadow-sage-green/20" size="lg">
                                <Plus className="w-6 h-6" /> Log Consumption
                            </Button>
                        </form>
                    </Card>

                    {/* View History Button */}
                    <Card className="p-4 bg-gradient-to-r from-sage-green/5 to-deep-emerald/5 border-sage-green/20">
                        <a
                            href="/history"
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/50 transition-all group cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-sage-green/10 flex items-center justify-center group-hover:bg-sage-green/20 transition-colors">
                                    <Calendar className="text-sage-green" size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-charcoal-blue group-hover:text-sage-green transition-colors">
                                        View Consumption History
                                    </p>
                                    <p className="text-xs text-gray-500">See all your logged consumption</p>
                                </div>
                            </div>
                            <ExternalLink className="text-sage-green opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                        </a>
                    </Card>
                </div>

                {/* Right Column: Visuals & Tips */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Did you know card */}
                    <div className="rounded-2xl shadow-xl bg-gradient-to-br from-[#004032] to-[#8A9A5B] border-none text-white p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Leaf size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                                <Sparkles className="text-white" />
                            </div>
                            <h3 className="text-2xl font-bold font-clash mb-2">Did you know?</h3>
                            <p className="text-white/90 mb-6 leading-relaxed">
                                {randomTip?.fact || "Logging your food can reduce household waste by up to 30%. You're doing great!"}
                            </p>
                            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                                <p className="text-sm font-bold mb-1">Quick Tip:</p>
                                <p className="text-xs text-white/80">
                                    {randomTip?.tip || "Store bananas separately from other fruits to prevent them from ripening too fast."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Consumption */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold font-clash text-lg text-charcoal-blue">Recent Consumption</h3>
                            <a
                                href="/history"
                                className="text-xs font-bold text-sage-green hover:text-deep-emerald transition-colors"
                            >
                                View All
                            </a>
                        </div>
                        <div className="space-y-3">
                            {[
                                { item: "Apples", quantity: "2 pcs", time: "2 hours ago", category: "Fruits" },
                                { item: "Milk", quantity: "250ml", time: "5 hours ago", category: "Dairy" },
                                { item: "Bread", quantity: "2 slices", time: "Yesterday", category: "Bakery" },
                            ].map((log, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-sage-green/10 flex items-center justify-center text-lg">
                                            {log.category === "Fruits" ? "🍎" : log.category === "Dairy" ? "🥛" : "🍞"}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-charcoal-blue">{log.item}</p>
                                            <p className="text-xs text-gray-500">{log.quantity} • {log.time}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-600">
                                        {log.category}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
