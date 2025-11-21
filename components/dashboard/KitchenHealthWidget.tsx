"use client";

import { Card } from "@/components/ui/Card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export function KitchenHealthWidget({ consumedCount = 0, wastedCount = 0 }: { consumedCount?: number; wastedCount?: number }) {
    const total = consumedCount + wastedCount;
    const efficiency = total > 0 ? Math.round((consumedCount / total) * 100) : 100;

    const data = [
        { name: "Consumed", value: consumedCount, color: "#8A9A5B" },
        { name: "Wasted", value: wastedCount, color: "#E2725B" },
    ];

    // If no data, show placeholder
    const chartData = total > 0 ? data : [{ name: "No Data", value: 1, color: "#E5E7EB" }];

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
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={total > 0 ? 5 : 0}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-2xl font-bold text-charcoal-blue">{efficiency}%</span>
                    <span className="text-xs text-gray-400">Efficient</span>
                </div>
            </div>

            <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-sage-green" />
                    <span>Consumed ({consumedCount})</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-terracotta" />
                    <span>Wasted ({wastedCount})</span>
                </div>
            </div>
        </Card>
    );
}
