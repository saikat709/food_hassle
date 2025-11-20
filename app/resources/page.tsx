"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { ExternalLink, Bookmark } from "lucide-react";

const resources = [
    {
        id: 1,
        title: "How to Store Leafy Greens",
        category: "Storage Tip",
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=2600&auto=format&fit=crop",
        height: "h-64",
    },
    {
        id: 2,
        title: "5 Ways to Use Stale Bread",
        category: "Recipe",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2600&auto=format&fit=crop",
        height: "h-80",
    },
    {
        id: 3,
        title: "Understanding Expiry Dates",
        category: "Guide",
        image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=2600&auto=format&fit=crop",
        height: "h-56",
    },
    {
        id: 4,
        title: "Zero Waste Kitchen Hacks",
        category: "Lifestyle",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2670&auto=format&fit=crop",
        height: "h-72",
    },
    {
        id: 5,
        title: "Regrow Veggies from Scraps",
        category: "DIY",
        image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=2569&auto=format&fit=crop",
        height: "h-64",
    },
    {
        id: 6,
        title: "Meal Prep Like a Pro",
        category: "Guide",
        image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?q=80&w=2600&auto=format&fit=crop",
        height: "h-72",
    },
    {
        id: 7,
        title: "Composting 101",
        category: "Lifestyle",
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2600&auto=format&fit=crop",
        height: "h-56",
    },
    {
        id: 8,
        title: "Best Freezer-Friendly Foods",
        category: "Storage Tip",
        image: "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?q=80&w=2600&auto=format&fit=crop",
        height: "h-64",
    },
    {
        id: 9,
        title: "Turn Leftovers into Gourmet",
        category: "Recipe",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2600&auto=format&fit=crop",
        height: "h-80",
    },
    {
        id: 10,
        title: "Seasonal Eating Benefits",
        category: "Guide",
        image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2600&auto=format&fit=crop",
        height: "h-64",
    },
    {
        id: 11,
        title: "DIY Food Storage Solutions",
        category: "DIY",
        image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2600&auto=format&fit=crop",
        height: "h-72",
    },
    {
        id: 12,
        title: "Reduce Plastic in Your Kitchen",
        category: "Lifestyle",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2600&auto=format&fit=crop",
        height: "h-56",
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
