import React from "react";

interface Feature {
  name: string;
  icon: React.ReactElement;
  href: string; // thêm href
}

interface FeatureButtonsProps {
  features: Feature[];
}

export default function FeatureButtons({ features }: FeatureButtonsProps) {
  return (
    <section>
      <div className="grid grid-cols-7 gap-4">
        {features.map((f) => (
          <a
            key={f.name}
            href={f.href} // dùng href
            className="flex flex-col items-center p-4 bg-white rounded-lg 
                        border-1 border-blue-600 shadow cursor-pointer 
                        hover:shadow-xl hover:scale-105 transition-transform"
          >
            <div className="text-2xl text-blue-600">{f.icon}</div>
            <span className="mt-2 text-sm font-semibold">{f.name}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
