// src/types/auth.ts

// 로그인 요청 데이터 타입
export interface LoginRequest {
    email: string;
    password: string;
  }
  
  // 백엔드 응답 데이터 타입
  export interface LoginResponse {
    uid: string;
    email: string;
    nickname: string;
    created_at: string;
    last_login: string;
    redirect_url?: string;
  }
  
  // 프론트엔드 사용자 데이터 타입 (Zustand 스토어와 일치)
  export interface User {
    uid: string;
    email: string;
    nickname: string;
    createdAt: string;
    lastLogin: string;
    isGuest: boolean;
    role: string;
  }