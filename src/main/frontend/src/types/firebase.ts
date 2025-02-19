// src/types/firebase.ts

import { FieldValue } from 'firebase/firestore';

export interface User {
  uid: string;
  username: string;
  email: string;
  emailVerified: boolean;
  role: 'user' | 'admin';
  created_At: FieldValue; // 변경
  updated_at: FieldValue; // 필요에 따라 수정
  address?: string;
}
