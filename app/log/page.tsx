"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Camera, Upload, Plus, X } from "lucide-react";

export default function LogFoodPage() {
    const [activeTab, setActiveTab] = useState<"quick" | "detailed">("quick");
    const [image, setImage] = useState<string | null>(null);

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
        <div className="max-w-2xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h1 className="text-3xl font-bold font-clash text-charcoal-blue">Log Food</h1>
                <p className="text-gray-500">Track what you buy to waste less.</p>
            </motion.div>

            {/* Tabs */}
            <div className="flex p-1 bg-white/50 rounded-xl backdrop-blur-sm">
                <button
                    onClick={() => setActiveTab("quick")}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === "quick"
                            ? "bg-white text-sage-green shadow-sm"
                            : "text-gray-400 hover:text-charcoal-blue"
                        }`}
                >
                    Quick Log
                </button>
                <button
                    onClick={() => setActiveTab("detailed")}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === "detailed"
                            ? "bg-white text-sage-green shadow-sm"
                            : "text-gray-400 hover:text-charcoal-blue"
                        }`}
                >
                    Detailed Log
                </button>
            </div>

            <Card className="p-6 md:p-8">
                <form className="space-y-6">
                    {/* Image Upload Section */}
                    <div className="relative group cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                        />
                        <div className={`w-full h-48 rounded-2xl border-2 border-dashed transition-colors flex flex-col items-center justify-center gap-2 ${image ? "border-sage-green bg-sage-green/5" : "border-gray-300 hover:border-sage-green bg-gray-50"
                            }`}>
                            {image ? (
                                <div className="relative w-full h-full">
                                    <img src={image} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setImage(null);
                                        }}
                                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md z-20"
                                    >
                                        <X size={16} className="text-terracotta" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                                        <Camera className="text-sage-green" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-500">Tap to scan receipt or item</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Input label="Item Name" placeholder="e.g. Bananas" />

                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Quantity" placeholder="e.g. 6" />
                            <Input label="Unit" placeholder="e.g. pcs" />
                        </div>

                        {activeTab === "detailed" && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="space-y-4 overflow-hidden"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <Input type="date" label="Purchase Date" />
                                    <Input type="date" label="Expiry Date" />
                                </div>
                                <select className="neumorphic-input w-full px-4 py-3 rounded-xl outline-none text-charcoal-blue bg-transparent">
                                    <option value="">Select Category</option>
                                    <option value="dairy">Dairy</option>
                                    <option value="vegetables">Vegetables</option>
                                    <option value="fruits">Fruits</option>
                                    <option value="meat">Meat</option>
                                </select>
                                <Input label="Price" placeholder="0.00" type="number" />
                            </motion.div>
                        )}
                    </div>

                    <Button className="w-full" size="lg">
                        <Plus className="w-5 h-5" /> Add to Inventory
                    </Button>
                </form>
            </Card>
        </div>
    );
}
