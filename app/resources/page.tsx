"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { ExternalLink, Bookmark } from "lucide-react";

const resources = [
    {
        id: 1,
        title: "How to Store Leafy Greens Properly",
        description: "Learn the best techniques to keep your leafy greens fresh for up to 2 weeks",
        category: "Storage Tips",
        type: "Article",
        url: "https://example.com/leafy-greens-storage",
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=2600&auto=format&fit=crop",
        height: "h-64",
    },
    {
        id: 2,
        title: "5 Creative Ways to Use Stale Bread",
        description: "Transform yesterday's bread into delicious meals and reduce food waste",
        category: "Waste Reduction",
        type: "Video",
        url: "https://example.com/stale-bread-recipes",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2600&auto=format&fit=crop",
        height: "h-80",
    },
    {
        id: 3,
        title: "Understanding Expiry Dates: Best Before vs Use By",
        description: "Decode food labels and reduce unnecessary waste from confusion",
        category: "Waste Reduction",
        type: "Article",
        url: "https://example.com/expiry-dates-guide",
        image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=2600&auto=format&fit=crop",
        height: "h-56",
    },
    {
        id: 4,
        title: "Zero Waste Kitchen Hacks",
        description: "Simple strategies to minimize waste and save money in your kitchen",
        category: "Waste Reduction",
        type: "Video",
        url: "https://example.com/zero-waste-kitchen",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2670&auto=format&fit=crop",
        height: "h-72",
    },
    {
        id: 5,
        title: "Regrow Vegetables from Kitchen Scraps",
        description: "Turn your food scraps into a thriving indoor garden",
        category: "Waste Reduction",
        type: "Article",
        url: "https://example.com/regrow-vegetables",
        image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=2569&auto=format&fit=crop",
        height: "h-64",
    },
    {
        id: 6,
        title: "Weekly Meal Planning on a Budget",
        description: "Plan nutritious meals for your family while saving $200+ monthly",
        category: "Budget Tips",
        type: "Article",
        url: "https://example.com/meal-planning-budget",
        image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?q=80&w=2600&auto=format&fit=crop",
        height: "h-72",
    },
    {
        id: 7,
        title: "Composting 101: Beginner's Guide",
        description: "Start composting at home and reduce landfill waste by 30%",
        category: "Waste Reduction",
        type: "Video",
        url: "https://example.com/composting-guide",
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2600&auto=format&fit=crop",
        height: "h-56",
    },
    {
        id: 8,
        title: "Best Foods to Freeze and How",
        description: "Maximize your freezer space and extend food life by months",
        category: "Storage Tips",
        type: "Article",
        url: "https://example.com/freezer-friendly-foods",
        image: "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?q=80&w=2600&auto=format&fit=crop",
        height: "h-64",
    },
    {
        id: 9,
        title: "Transform Leftovers into Gourmet Meals",
        description: "Chef-approved techniques to reinvent yesterday's dinner",
        category: "Meal Planning",
        type: "Video",
        url: "https://example.com/leftover-recipes",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2600&auto=format&fit=crop",
        height: "h-80",
    },
    {
        id: 10,
        title: "Benefits of Eating Seasonal Produce",
        description: "Save money and boost nutrition by choosing seasonal fruits and vegetables",
        category: "Nutrition",
        type: "Article",
        url: "https://example.com/seasonal-eating",
        image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2600&auto=format&fit=crop",
        height: "h-64",
    },
    {
        id: 11,
        title: "DIY Reusable Food Storage Solutions",
        description: "Make your own eco-friendly food containers and wraps",
        category: "Waste Reduction",
        type: "Article",
        url: "https://example.com/diy-food-storage",
        image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2600&auto=format&fit=crop",
        height: "h-72",
    },
    {
        id: 12,
        title: "Reduce Plastic in Your Kitchen",
        description: "Practical swaps to eliminate single-use plastics from food storage",
        category: "Waste Reduction",
        type: "Video",
        url: "https://example.com/plastic-free-kitchen",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2600&auto=format&fit=crop",
        height: "h-56",
    },
    {
        id: 13,
        title: "Batch Cooking for Busy Families",
        description: "Prepare a week's worth of meals in just 3 hours",
        category: "Meal Planning",
        type: "Video",
        url: "https://example.com/batch-cooking",
        image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2600&auto=format&fit=crop",
        height: "h-64",
    },
    {
        id: 14,
        title: "Smart Grocery Shopping to Reduce Waste",
        description: "Strategic shopping tips to buy only what you need",
        category: "Budget Tips",
        type: "Article",
        url: "https://example.com/smart-grocery-shopping",
        image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=2600&auto=format&fit=crop",
        height: "h-72",
    },
    {
        id: 15,
        title: "Preserving Summer Produce for Winter",
        description: "Canning, freezing, and drying techniques for year-round enjoyment",
        category: "Storage Tips",
        type: "Article",
        url: "https://example.com/preserving-produce",
        image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2600&auto=format&fit=crop",
        height: "h-56",
    },
    {
        id: 16,
        title: "Nutrition on a Budget: Healthy Eating Tips",
        description: "Get maximum nutrition without breaking the bank",
        category: "Nutrition",
        type: "Video",
        url: "https://example.com/nutrition-budget",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2600&auto=format&fit=crop",
        height: "h-64",
    },
    {
        id: 17,
        title: "Root Cellar Storage: Old-School Preservation",
        description: "Traditional methods to store vegetables for months without electricity",
        category: "Storage Tips",
        type: "Article",
        url: "https://example.com/root-cellar-storage",
        image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=2600&auto=format&fit=crop",
        height: "h-80",
    },
    {
        id: 18,
        title: "One-Pot Meals for Minimal Waste",
        description: "Delicious recipes that use every ingredient efficiently",
        category: "Meal Planning",
        type: "Video",
        url: "https://example.com/one-pot-meals",
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2600&auto=format&fit=crop",
        height: "h-72",
    },
    {
        id: 19,
        title: "Understanding Food Nutrition Labels",
        description: "Make informed choices for your family's health",
        category: "Nutrition",
        type: "Article",
        url: "https://example.com/nutrition-labels",
        image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=2600&auto=format&fit=crop",
        height: "h-56",
    },
    {
        id: 20,
        title: "Affordable Organic Eating Guide",
        description: "Prioritize organic purchases based on budget and health impact",
        category: "Budget Tips",
        type: "Article",
        url: "https://example.com/affordable-organic",
        image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2600&auto=format&fit=crop",
        height: "h-64",
    },
];

export default function ResourcesPage() {
    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-2"
            >
                <h1 className="text-3xl font-bold font-clash text-charcoal-blue">Sustainability Hub</h1>
                <p className="text-gray-500">Tips and tricks to reduce waste and save money.</p>
            </motion.div>

            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {resources.map((resource, index) => (
                    <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="break-inside-avoid"
                    >
                        <Card className="p-0 overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow">
                            <div className={`relative w-full ${resource.height}`}>
                                <img
                                    src={resource.image}
                                    alt={resource.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                <div className="absolute top-4 right-4">
                                    <button className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-sage-green transition-colors">
                                        <Bookmark size={18} />
                                    </button>
                                </div>

                                <div className="absolute bottom-0 left-0 p-6 text-white">
                                    <span className="inline-block px-3 py-1 rounded-full bg-sage-green/80 backdrop-blur-sm text-xs font-bold mb-2">
                                        {resource.category}
                                    </span>
                                    <h3 className="text-xl font-bold font-clash leading-tight mb-2">
                                        {resource.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                        Read Article <ExternalLink size={14} />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
