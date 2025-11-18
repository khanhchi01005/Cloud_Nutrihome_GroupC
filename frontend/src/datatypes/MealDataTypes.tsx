export interface Meal {
    id?: number;
    name: string;
    image: string;
    carbs?: number;
    protein?: number;
    fat?: number;
    calories?: number;
    cooking_time?: string; // dạng "HH:MM:SS"
    ingredients?: string; // markdown
    steps?: string;
}