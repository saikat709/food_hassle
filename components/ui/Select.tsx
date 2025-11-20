"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectProps {
    label?: string;
    options: { value: string; label: string }[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function Select({ label, options, value, onChange, placeholder, className }: SelectProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabel = options.find((opt) => opt.value === value)?.label;
    const shouldFloat = isOpen || !!value;

    return (
        <div className="relative w-full" ref={containerRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "neumorphic-input w-full px-4 py-3 rounded-xl cursor-pointer flex items-center justify-between transition-all",
                    isOpen ? "ring-2 ring-sage-green/20" : "",
                    className
                )}
            >
                <span className={cn("text-charcoal-blue", !value && "text-transparent")}>
                    {selectedLabel || "Placeholder"}
                </span>
                <ChevronDown
                    size={18}
                    className={cn("text-gray-400 transition-transform", isOpen && "rotate-180")}
                />
            </div>

            {/* Floating Label */}
            {label && (
                <motion.label
                    initial={false}
                    animate={{
                        y: shouldFloat ? -28 : 12,
                        x: shouldFloat ? 0 : 12,
                        scale: shouldFloat ? 0.85 : 1,
                        color: isOpen ? "#8A9A5B" : "#64748B",
                    }}
                    className="absolute left-0 top-0 pointer-events-none font-medium"
                >
                    {label || placeholder}
                </motion.label>
            )}

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 w-full mt-2 p-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                    >
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "px-4 py-3 rounded-lg cursor-pointer transition-colors text-sm font-medium",
                                    value === option.value
                                        ? "bg-sage-green/10 text-sage-green"
                                        : "text-charcoal-blue hover:bg-gray-100"
                                )}
                            >
                                {option.label}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
