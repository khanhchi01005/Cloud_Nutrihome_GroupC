import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { FiBarChart2 } from 'react-icons/fi';
import 'react-circular-progressbar/dist/styles.css';
import { useEffect, useState } from 'react';

interface NutritionProps {
    data: {
        calories: { value: number; goal: number };
        carbs: { value: number; goal: number };
        fat: { value: number; goal: number };
        protein: { value: number; goal: number };
    };
}

export default function NutritionOverview({ data }: NutritionProps) {
    // Màu cho từng loại dinh dưỡng
    const colors: Record<string, string> = {
        calories: '#f87171', // đỏ
        carbs: '#fbbf24',    // vàng
        fat: '#34d399',      // xanh lá
        protein: '#60a5fa'   // xanh dương
    };

    // State để tạo hiệu ứng tăng dần
    const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({
        calories: 0,
        carbs: 0,
        fat: 0,
        protein: 0
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimatedValues(prev => {
                const next: Record<string, number> = { ...prev };
                let done = true;
                Object.entries(data).forEach(([key, { value, goal }]) => {
                    const percent = Math.min(Math.round((value / goal) * 100), 100);
                    if (prev[key] < percent) {
                        next[key] = Math.min(prev[key] + 2, percent); // tăng dần 2% mỗi tick
                        done = false;
                    }
                });
                if (done) clearInterval(interval);
                return next;
            });
        }, 15); // tick 15ms
        return () => clearInterval(interval);
    }, [data]);

    return (
        <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiBarChart2 size={20} />
                Dinh dưỡng hôm nay
            </h2>
            <div className="grid grid-cols-2 gap-4">
                {Object.entries(data).map(([key, { value, goal }]) => {
                    const percent = animatedValues[key];
                    return (
                        <div
                            key={key}
                            className="flex flex-col items-center p-2 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="w-24 h-24">
                                <CircularProgressbar
                                    value={percent}
                                    text={`${value}/${goal}`}
                                    styles={buildStyles({
                                        textSize: '14px',
                                        pathColor: colors[key],
                                        textColor: '#111',
                                        trailColor: '#e5e7eb'
                                    })}
                                />
                            </div>
                            <span className="mt-2 capitalize text-sm font-medium">{key}</span>
                        </div>
                    )
                })}
            </div>
        </section>
    );
}
