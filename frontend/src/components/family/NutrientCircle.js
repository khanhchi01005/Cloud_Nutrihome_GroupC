import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/family/NutrientCircle.tsx
import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function NutrientCircle({ label, value, goal, color }) {
    const [animatedValue, setAnimatedValue] = useState(0);

    const percent = goal
        ? Math.min(Math.round((animatedValue / goal) * 100), 100)
        : Math.min(Math.max(animatedValue, 0), 100);

    useEffect(() => {
        const duration = 500; // 0.8 giây
        const fps = 60;
        const totalFrames = Math.round((duration / 1000) * fps);
        let frame = 0;

        const interval = setInterval(() => {
            frame++;
            const progress = Math.min(value * (frame / totalFrames), value);
            setAnimatedValue(progress);

            if (frame >= totalFrames) {
                clearInterval(interval);
            }
        }, 1000 / fps);

        return () => clearInterval(interval);
    }, [value]);

    return (_jsxs("div", {
        className: "flex flex-col items-center bg-white rounded-xl shadow-md p-3 transition-all hover:shadow-lg",
        children: [
            _jsx("div", {
                className: "w-24 h-24",
                children: _jsx(CircularProgressbar, {
                    value: percent,
                    text: `${Math.round(animatedValue)}/${goal}`,
                    styles: buildStyles({
                        textSize: "14px",
                        pathColor: color,
                        textColor: "#111",
                        trailColor: "#e5e7eb",
                        pathTransitionDuration: 0.15
                    })
                })
            }),
            _jsx("p", {
                className: "text-sm font-medium mt-2 text-center",
                children: label
            })
        ]
    }));
}
