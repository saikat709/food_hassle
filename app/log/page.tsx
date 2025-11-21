"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { Camera, Upload, Plus, X, Leaf, Sparkles, Calendar, ExternalLink, Loader2, Image as ImageIcon, Check, Edit3 } from "lucide-react";
import { extractTextFromImage, ExtractedData } from "@/lib/ocr";

export default function LogFoodPage() {
    const [activeTab, setActiveTab] = useState<"quick" | "detailed">("quick");
    const [image, setImage] = useState<string | null>(null);
    const [category, setCategory] = useState("");
    const [randomTip, setRandomTip] = useState<{ fact: string; tip: string } | null>(null);

    // OCR states
    const [isProcessing, setIsProcessing] = useState(false);
    const [ocrProgress, setOcrProgress] = useState(0);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
    const [editableData, setEditableData] = useState<ExtractedData | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        itemName: "",
        quantity: "",
        unit: "",
        date: new Date().toISOString().split('T')[0],
        time: "",
        notes: "",
        removeFromInventory: false,
    });

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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                setImage(reader.result as string);

                // Start OCR processing
                setIsProcessing(true);
                setOcrProgress(0);

                try {
                    const data = await extractTextFromImage(file, (progress) => {
                        setOcrProgress(progress);
                    });

                    setExtractedData(data);
                    setEditableData(data);
                    setShowPreviewModal(true);
                } catch (error) {
                    console.error('OCR failed:', error);
                    alert('Failed to extract text from image. Please try again with a clearer image.');
                } finally {
                    setIsProcessing(false);
                    setOcrProgress(0);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleApplyExtractedData = () => {
        if (editableData) {
            setFormData({
                ...formData,
                itemName: editableData.itemName,
                quantity: editableData.quantity,
                unit: editableData.unit,
                date: editableData.date,
            });
            setShowPreviewModal(false);
        }
    };

    const handleClearImage = () => {
        setImage(null);
        setExtractedData(null);
        setEditableData(null);
        setShowPreviewModal(false);
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

                    {/* Image Upload Section */}
                    <Card className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-charcoal-blue flex items-center gap-2">
                                        <Camera className="w-5 h-5 text-sage-green" />
                                        Scan Receipt or Label
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Upload an image to auto-fill the form
                                    </p>
                                </div>
                            </div>

                            {!image ? (
                                <label className="block">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        disabled={isProcessing}
                                    />
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-sage-green hover:bg-sage-green/5 transition-all">
                                        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                        <p className="text-sm font-medium text-gray-600">
                                            Click to upload or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            PNG, JPG up to 10MB
                                        </p>
                                    </div>
                                </label>
                            ) : (
                                <div className="relative">
                                    <img
                                        src={image}
                                        alt="Uploaded"
                                        className="w-full h-48 object-cover rounded-xl"
                                    />
                                    <button
                                        onClick={handleClearImage}
                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>

                                    {isProcessing && (
                                        <div className="absolute inset-0 bg-black/50 rounded-xl flex flex-col items-center justify-center">
                                            <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                                            <p className="text-white text-sm font-medium">
                                                Extracting text... {ocrProgress}%
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Main Form */}
                    <Card className="p-6 md:p-8">
                        <form className="space-y-6">
                            {/* Basic Fields - Always Visible */}
                            <Input
                                label="Item Name"
                                placeholder="e.g. Bananas"
                                value={formData.itemName}
                                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                            />

                            <div className="grid grid-cols-2 gap-6">
                                <Input
                                    label="Quantity Consumed"
                                    placeholder="e.g. 2"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                />
                                <Input
                                    label="Unit"
                                    placeholder="e.g. pcs"
                                    value={formData.unit}
                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                />
                            </div>

                            <Input
                                type="date"
                                label="Date Consumed"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
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
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                                        checked={formData.removeFromInventory}
                                        onChange={(e) => setFormData({ ...formData, removeFromInventory: e.target.checked })}
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

            {/* Editable Preview Modal */}
            <AnimatePresence>
                {showPreviewModal && editableData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowPreviewModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-sage-green/10 flex items-center justify-center">
                                            <Edit3 className="text-sage-green" size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold font-clash text-charcoal-blue">
                                                Review Extracted Data
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                Edit the fields below before applying
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowPreviewModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Image Preview */}
                                {image && (
                                    <div className="rounded-xl overflow-hidden border border-gray-200">
                                        <img
                                            src={image}
                                            alt="Uploaded"
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                )}

                                {/* Editable Fields */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Item Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editableData.itemName}
                                            onChange={(e) => setEditableData({ ...editableData, itemName: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-off-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-green/20 transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Quantity
                                            </label>
                                            <input
                                                type="text"
                                                value={editableData.quantity}
                                                onChange={(e) => setEditableData({ ...editableData, quantity: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-off-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-green/20 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Unit
                                            </label>
                                            <input
                                                type="text"
                                                value={editableData.unit}
                                                onChange={(e) => setEditableData({ ...editableData, unit: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-off-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-green/20 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            value={editableData.date}
                                            onChange={(e) => setEditableData({ ...editableData, date: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-off-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-green/20 transition-all"
                                        />
                                    </div>

                                    {/* Raw Text Preview */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Extracted Text
                                        </label>
                                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 max-h-32 overflow-y-auto">
                                            <p className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
                                                {editableData.rawText}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-200 flex gap-3">
                                <button
                                    onClick={() => setShowPreviewModal(false)}
                                    className="flex-1 py-3 px-6 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleApplyExtractedData}
                                    className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-deep-emerald to-sage-green text-white font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Check className="w-5 h-5" />
                                    Apply to Form
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
