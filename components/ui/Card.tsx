import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { variant?: "glass" | "default" }
>(({ className, variant = "glass", ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-2xl p-6 transition-all",
            variant === "glass" ? "glass-panel" : "bg-white shadow-lg",
            className
        )}
        {...props}
    />
));
Card.displayName = "Card";

export { Card };
