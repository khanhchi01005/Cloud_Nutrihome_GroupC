// src/components/ui/dialog.tsx
import React, { useEffect } from "react";
import ReactDOM from "react-dom";

interface DialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
    if (!open) return null;

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => onOpenChange(false)}
        >
            <div
                className="bg-white rounded-xl shadow-xl w-full max-w-lg p-4"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body
    );
};

export const DialogContent = ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
);

export const DialogHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="mb-3">{children}</div>
);

export const DialogTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-xl font-semibold">{children}</h2>
);
