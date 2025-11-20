"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false);
        const [hasValue, setHasValue] = React.useState(false);

        return (
            <div className="relative w-full">
                <div className="relative">
                    <input
                        type={type}
                        className={cn(
                            "neumorphic-input w-full px-4 py-3 rounded-xl outline-none text-charcoal-blue bg-transparent transition-all",
                            "focus:ring-2 focus:ring-sage-green/20",
                            className
                        )}
                        ref={ref}
                        onFocus={(e) => {
                            setIsFocused(true);
                            props.onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            setHasValue(!!e.target.value);
                            props.onBlur?.(e);
                        }}
                        onChange={(e) => {
                            setHasValue(!!e.target.value);
                            props.onChange?.(e);
                        }}
                        {...props}
                    />
                    {label && (
                        <motion.label
                            initial={false}
                            animate={{
                                y: isFocused || hasValue ? -28 : 12,
                                x: isFocused || hasValue ? 0 : 12,
                                scale: isFocused || hasValue ? 0.85 : 1,
                                color: isFocused ? "#8A9A5B" : "#64748B",
                            }}
                            className="absolute left-0 pointer-events-none font-medium"
                        >
                            {label}
                        </motion.label>
                    )}
                </div>
                {error && (
                    <span className="text-terracotta text-xs mt-1 ml-1 block">{error}</span>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
