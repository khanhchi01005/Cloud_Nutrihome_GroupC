// src/components/family/NutrientCircle.tsx
import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface NutrientCircleProps {
    label: string;
    value: number;   // giá trị hiện tại
    goal?: number;   // optional, để hiển thị số / số
    color: string;
}

export default function NutrientCircle({ label, value, goal, color }: NutrientCircleProps) {
    const [animatedValue, setAnimatedValue] = useState(0);

    const percent = goal ? Math.min(Math.round((animatedValue / goal) * 100), 100) : Math.min(Math.max(animatedValue, 0), 100);

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimatedValue(prev => {
                if (prev < value) {
                    return Math.min(prev + 1, value);
                } else {
                    clearInterval(interval);
                    return prev;
                }
            });
        }, 10);
        return () => clearInterval(interval);
    }, [value]);

    return (
        <div className="flex flex-col items-center bg-white rounded-xl shadow-md p-3 transition-all hover:shadow-lg">
            <div className="w-24 h-24">
                <CircularProgressbar
                    value={percent}
                    text={`${animatedValue}/${goal}`}
                    styles={buildStyles({
                        textSize: "14px",
                        pathColor: color,
                        textColor: "#111",
                        trailColor: "#e5e7eb",
                        pathTransitionDuration: 0.15
                    })}
                />
            </div>
            <p className="text-sm font-medium mt-2 text-center">{label}</p>
        </div>
    );
}
