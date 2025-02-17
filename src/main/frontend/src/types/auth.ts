// src/types/auth.ts
export interface LoginRequest {
    email: string;
    password: string;
}

// ✅ 백엔드 LoginResponse에서 token 제거.  Firebase에서 가져옴.
export interface LoginResponse {
    uid: string;
    email: string;
    nickname: string;
    created_at: string;
    last_login: string;
    redirect_url?: string;
    monthly_points: number;
    points_needed_for_promotion: number;
    current_tier: string;
}

// ✅ 프론트엔드 User 타입. token은 optional.
export interface User {
    uid: string;
    email: string;
    nickname: string;
    createdAt: string;
    lastLogin: string;
    isGuest: boolean;
    role: string;
    monthly_points?: number;
    token?: string;  // 선택적
}// src/types/auth.ts
export interface LoginRequest {
  email: string;
  password: string;
}

// ✅ 백엔드 LoginResponse에서 token 제거.  Firebase에서 가져옴.
export interface LoginResponse {
  uid: string;
  email: string;
  nickname: string;
  created_at: string;
  last_login: string;
  redirect_url?: string;
  monthly_points: number;
  points_needed_for_promotion: number;
  current_tier: string;
}

// ✅ 프론트엔드 User 타입. token은 optional.
export interface User {
  uid: string;
  email: string;
  nickname: string;
  createdAt: string;
  lastLogin: string;
  isGuest: boolean;
  role: string;
  monthly_points?: number;
  token?: string;  // 선택적
}