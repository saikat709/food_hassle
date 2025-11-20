"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { Camera, Upload, Plus, X, Leaf, Sparkles } from "lucide-react";

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
                <h1 className="text-3xl font-bold font-clash text-charcoal-blue mb-2">Log Your Harvest</h1>
                <p className="text-gray-500 text-lg">Track every item to reduce waste and save the planet.</p>
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
                        <form className="space-y-8">
                            {/* Image Upload Section */}
                            <div className="relative group cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                                />
                                <div className={`w-full h-56 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-3 ${image ? "border-sage-green bg-sage-green/5" : "border-gray-300 hover:border-sage-green hover:bg-sage-green/5 bg-gray-50"
                                    }`}>
                                    {image ? (
                                        <div className="relative w-full h-full p-2">
                                            <img src={image} alt="Preview" className="w-full h-full object-cover rounded-xl shadow-sm" />
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setImage(null);
                                                }}
                                                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md z-20 hover:bg-gray-100 transition-colors"
                                            >
                                                <X size={18} className="text-terracotta" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                                <Camera className="text-sage-green w-8 h-8" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-base font-bold text-charcoal-blue">Scan Receipt or Item</p>
                                                <p className="text-sm text-gray-400">Supports JPG, PNG</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <Input label="Item Name" placeholder="e.g. Bananas" />

                                <div className="grid grid-cols-2 gap-6">
                                    <Input label="Quantity" placeholder="e.g. 6" />
                                    <Input label="Unit" placeholder="e.g. pcs" />
                                </div>

                                {activeTab === "detailed" && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        onAnimationComplete={() => setOverflow("visible")}
                                        className={`pt-6 space-y-8 ${overflow}`}
                                    >
                                        <div className="grid grid-cols-2 gap-6">
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
                                        </div>

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

                                        <Input label="Price" placeholder="0.00" type="number" />
                                    </motion.div>
                                )}
                            </div>

                            <Button className="w-full py-4 text-lg shadow-xl shadow-sage-green/20" size="lg">
                                <Plus className="w-6 h-6" /> Add to Inventory
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Right Column: Visuals & Tips */}
                <div className="lg:col-span-1 space-y-6">
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

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold font-clash text-lg text-charcoal-blue">Recent Logs</h3>
                            <button className="text-xs font-bold text-sage-green hover:text-deep-emerald transition-colors">View All</button>
                        </div>
                        <div className="space-y-3">
                            {[1, 2, 3].map((i, index) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02, backgroundColor: "rgba(138, 154, 91, 0.1)" }}
                                    className="flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-colors group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                                        {i === 1 ? "🥑" : i === 2 ? "🍞" : "🥚"}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm text-charcoal-blue group-hover:text-sage-green transition-colors">{i === 1 ? "Avocados" : i === 2 ? "Sourdough" : "Eggs"}</p>
                                        <p className="text-xs text-gray-400">Today, 10:30 AM</p>
                                    </div>
                                    <div className="relative">
                                        <div className="w-2.5 h-2.5 rounded-full bg-sage-green relative z-10" />
                                        <div className="absolute inset-0 bg-sage-green rounded-full animate-ping opacity-75" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
