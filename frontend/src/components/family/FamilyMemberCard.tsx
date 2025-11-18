// src/components/family/FamilyMemberCard.tsx
import NutrientCircle from "./NutrientCircle";

interface Member {
    user_id: number | string;
    fullname: string;
    username: string;
    avatar?: string | null;
    dob?: string;
    gender?: string;
    height?: number;
    weight?: number;
    bmi?: number;
    activity_level?: string;
    disease?: string;
    allergen?: string;
    family_id?: number;
    eaten_protein?: number;
    eaten_carbs?: number;
    eaten_fat?: number;
    eaten_calories?: number;
    target_protein?: number;
    target_carbs?: number;
    target_fat?: number;
    target_calories?: number;
}

interface Props {
    member: Member;
}

export default function FamilyMemberCard({ member }: Props) {
    const avatarUrl = member.avatar
        ? member.avatar
        : `https://api.dicebear.com/9.x/identicon/svg?seed=${member.username}`;

    return (
        <div className="p-4 border rounded-lg shadow-md bg-white flex flex-col md:flex-row gap-4">
            {/* Avatar */}
            <div className="flex justify-center items-center md:basis-[15%]">
                <img
                    src={avatarUrl}
                    className="w-28 h-28 rounded-full object-cover border-2 border-gray-200"
                />
            </div>

            {/* Info cơ bản (Markdown style, scroll nếu vượt quá) */}
            <div className="md:basis-[25%] max-h-36 overflow-y-auto px-2">
                <p className="text-lg font-semibold mb-1">{member.fullname || member.username}</p>
                <p className="text-gray-500 text-sm mb-2">@{member.username}</p>

                <div className="text-gray-600 text-sm space-y-1">
                    {member.dob && <p><span className="font-semibold">DOB:</span> {member.dob}</p>}
                    {member.gender && <p><span className="font-semibold">Gender:</span> {member.gender}</p>}
                    {member.height && member.weight && (
                        <p><span className="font-semibold">Height/Weight:</span> {member.height} cm / {member.weight} kg</p>
                    )}
                    {member.bmi && <p><span className="font-semibold">BMI:</span> {member.bmi}</p>}
                    {member.activity_level && <p><span className="font-semibold">Activity:</span> {member.activity_level}</p>}
                    {member.disease && <p><span className="font-semibold">Disease:</span> {member.disease}</p>}
                    {member.allergen && <p><span className="font-semibold">Allergen:</span> {member.allergen}</p>}
                </div>

            </div>

            {/* Nutrient Chart */}
            <div className="md:basis-[60%] grid grid-cols-2 sm:grid-cols-4 gap-3">
                <NutrientCircle
                    label="Protein"
                    value={member.eaten_protein || 0}
                    goal={member.target_protein || 0}
                    color="#60a5fa"
                />
                <NutrientCircle
                    label="Carb"
                    value={member.eaten_carbs || 0}
                    goal={member.target_carbs || 0}
                    color="#fbbf24"
                />
                <NutrientCircle
                    label="Fat"
                    value={member.eaten_fat || 0}
                    goal={member.target_fat || 0}
                    color="#34d399"
                />
                <NutrientCircle
                    label="Calories"
                    value={member.eaten_calories || 0}
                    goal={member.target_calories || 0}
                    color="#ef4444"
                />
            </div>
        </div>
    );
}
