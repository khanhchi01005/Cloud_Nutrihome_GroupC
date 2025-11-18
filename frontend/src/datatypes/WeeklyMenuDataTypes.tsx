// WeeklyMenuDataTypes.tsx

export interface Nutrients {
  calories?: number;
  carbs?: number;
  protein?: number;
  fat?: number;
}

export interface MealItem {
  recipe_id: number;
  name: string;
  image: string;
  nutrients?: Nutrients; // nutrients riêng cho từng món (optional to match history responses)
}

export interface DailyMeal {
  items: MealItem[];
  nutrients?: Nutrients;
  eaten?: boolean; // tổng nutrients cho bữa
}

export type MealType = "breakfast" | "lunch" | "dinner";

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type WeeklyMenuDays = Record<MealType, DailyMeal>;

export interface WeeklyMenu {
  menu: Record<DayKey, WeeklyMenuDays>;
}
