// src/components/ui/input.tsx
import React from "react";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className = "", ...props }, ref) => {
        return (
            <input
                ref={ref}
                {...props}
                className={`border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
            />
        );
    }
);

Input.displayName = "Input";
