import { jsx as _jsx } from "react/jsx-runtime";
// src/components/ui/input.tsx
import React from "react";
export const Input = React.forwardRef(({ className = "", ...props }, ref) => {
    return (_jsx("input", { ref: ref, ...props, className: `border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}` }));
});
Input.displayName = "Input";
