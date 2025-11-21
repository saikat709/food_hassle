"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { User, Settings, LogOut, Calendar } from "lucide-react";
import { signOut } from "next-auth/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useRouter } from "next/navigation";

const data = [
    { name: "Week 1", consumed: 40, wasted: 24 },
    { name: "Week 2", consumed: 30, wasted: 13 },
    { name: "Week 3", consumed: 20, wasted: 98 },
    { name: "Week 4", consumed: 27, wasted: 39 },
];

export default function ProfilePage() {
    const router = useRouter();
    const [budget, setBudget] = useState(300);
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div className="flex items-center justify-center h-screen"><span className="text-gray-500">Loading profile...</span></div>;
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-sage-green flex items-center justify-center text-white text-3xl font-bold shadow-lg">{session?.user?.name ? session.user.name.charAt(0) : "U"}</div>
                    <div>
                        <h1 className="text-3xl font-bold font-clash text-charcoal-blue">{session?.user?.name ?? "User"}</h1>
                        <p className="text-gray-500">{session?.user?.email ? `Logged in as ${session.user.email}` : "Not logged in"}</p>
                    </div>
                </div>
                <Button variant="outline" size="sm">
                    <Settings size={18} />
                </Button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Settings Column */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <h3 className="font-bold font-clash text-lg mb-4">Preferences</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Monthly Food Budget: ${budget}
                                </label>
                                <input
                                    type="range"
                                    min="100"
                                    max="1000"
                                    value={budget}
                                    onChange={(e) => setBudget(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sage-green"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Dietary Type</label>
                                <select className="neumorphic-input w-full px-4 py-3 rounded-xl outline-none text-charcoal-blue bg-transparent">
                                    <option>Omnivore</option>
                                    <option>Vegetarian</option>
                                    <option>Vegan</option>
                                    <option>Pescatarian</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Household Size</label>
                                <select className="neumorphic-input w-full px-4 py-3 rounded-xl outline-none text-charcoal-blue bg-transparent">
                                    <option>1 Person</option>
                                    <option>2 People</option>
                                    <option>3-4 People</option>
                                    <option>5+ People</option>
                                </select>
                            </div>
                        </div>
                    </Card>

                    <Button
                        onClick={() => {
                            console.log('Signing out...');
                            signOut({ callbackUrl: "/auth" });
                        }}
                        variant="ghost" className="w-full text-terracotta hover:bg-terracotta/10">
                        <LogOut size={18} /> Sign Out
                    </Button>
                </div>

                {/* Stats Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <h3 className="font-bold font-clash text-lg mb-6">Consumption History</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                    <XAxis dataKey="name" stroke="#888" fontSize={12} />
                                    <YAxis stroke="#888" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                                            backdropFilter: "blur(8px)",
                                            borderRadius: "12px",
                                            border: "none",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="consumed"
                                        stroke="#8A9A5B"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: "#8A9A5B" }}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="wasted"
                                        stroke="#E2725B"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: "#E2725B" }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="w-3 h-3 rounded-full bg-sage-green" /> Consumed
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="w-3 h-3 rounded-full bg-terracotta" /> Wasted
                            </div>
                        </div>

                        {/* View Consumption History Button */}
                        <div className="mt-6">
                            <button
                                onClick={() => router.push('/history')}
                                className="w-full glass-panel rounded-2xl p-6 flex items-center gap-4 hover:bg-sage-green/5 transition-all duration-300 cursor-pointer border border-transparent hover:border-sage-green/20"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-sage-green/10 flex items-center justify-center flex-shrink-0">
                                    <Calendar className="text-sage-green" size={28} />
                                </div>
                                <div className="text-left flex-1">
                                    <p className="font-bold font-clash text-lg text-charcoal-blue">View Consumption History</p>
                                    <p className="text-sm text-gray-500 mt-1">See all your logged consumption</p>
                                </div>
                            </button>
                        </div>
                    </Card>

                    <div className="grid grid-cols-2 gap-6">
                        <Card className="bg-sage-green/10 border-none">
                            <h4 className="text-4xl font-bold font-clash text-sage-green mb-1">85%</h4>
                            <p className="text-sm text-charcoal-blue font-medium">Sustainability Score</p>
                        </Card>
                        <Card className="bg-spiced-ochre/10 border-none">
                            <h4 className="text-4xl font-bold font-clash text-spiced-ochre mb-1">$42</h4>
                            <p className="text-sm text-charcoal-blue font-medium">Saved this Month</p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
