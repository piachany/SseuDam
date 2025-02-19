export interface User {
    id?: string;
    username: string;
    email: string;
    apartment: string;
    location: string;
    nickname: string;
    created_at: string;
    last_login: string;
    grade?: string;
    token?: string;
    monthly_points: number;
    points_needed_for_promotion?: number;
    role: string;
    redirect_url?: string;
    monthlyPoints?: number;
    isGuest: boolean;
    accumulatedPoints?: number;
    uid: string;
  }
  
  export interface RankAccount {
    id?: string;
    username: string;
    accumulated_points: number;
    monthly_points: number;
    ranking: number;
    month: number;
  }
