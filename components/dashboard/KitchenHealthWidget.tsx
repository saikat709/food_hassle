"use client";

import { Card } from "@/components/ui/Card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
    { name: "Consumed", value: 75, color: "#8A9A5B" },
    { name: "Wasted", value: 25, color: "#E2725B" },
];

export function KitchenHealthWidget() {
    return (
        <Card className="h-full flex flex-col justify-between relative overflow-hidden">
            <div>
                <h3 className="text-lg font-bold font-clash text-charcoal-blue">Kitchen Health</h3>
                <p className="text-sm text-gray-500">This week's efficiency</p>
            </div>

            <div className="h-40 w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-2xl font-bold text-charcoal-blue">75%</span>
                    <span className="text-xs text-gray-400">Efficient</span>
                </div>
            </div>

            <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-sage-green" />
                    <span>Consumed</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-terracotta" />
                    <span>Wasted</span>
                </div>
            </div>
        </Card>
    );
}
