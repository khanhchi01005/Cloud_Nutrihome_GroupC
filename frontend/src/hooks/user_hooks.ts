// Minimal user type used across the app
export interface User {
  user_id: number;
  username: string;
  fullname?: string;
  avatar?: string | null;
  family_id?: number;
  eaten_calories?: number;
  eaten_carbs?: number;
  eaten_fat?: number;
  eaten_protein?: number;
}

export default {};
