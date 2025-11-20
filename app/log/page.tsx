"use client";

import { useState } from "react";
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
                                        className={`space-y-6 ${overflow}`}
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
                    <Card className="bg-gradient-to-br from-deep-emerald to-sage-green border-none text-white p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Leaf size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                                <Sparkles className="text-white" />
                            </div>
                            <h3 className="text-2xl font-bold font-clash mb-2">Did you know?</h3>
                            <p className="text-white/90 mb-6 leading-relaxed">
                                Logging your food can reduce household waste by up to 30%. You're doing great!
                            </p>
                            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                                <p className="text-sm font-bold mb-1">Quick Tip:</p>
                                <p className="text-xs text-white/80">Store bananas separately from other fruits to prevent them from ripening too fast.</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="font-bold font-clash text-lg mb-4 text-charcoal-blue">Recent Logs</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="w-10 h-10 rounded-full bg-off-white flex items-center justify-center text-lg">
                                        {i === 1 ? "🥑" : i === 2 ? "🍞" : "🥚"}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm text-charcoal-blue">{i === 1 ? "Avocados" : i === 2 ? "Sourdough" : "Eggs"}</p>
                                        <p className="text-xs text-gray-400">Today, 10:30 AM</p>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-sage-green" />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
