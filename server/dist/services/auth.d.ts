import { type User } from '../db/users.js';
export interface AuthResult {
    success: boolean;
    user?: Omit<User, 'password_hash'>;
    accessToken?: string;
    refreshToken?: string;
    error?: string;
}
export interface RegisterData {
    email: string;
    password: string;
    code: string;
}
export interface LoginData {
    email: string;
    password: string;
    rememberMe?: boolean;
}
export declare function hashPassword(password: string): Promise<string>;
export declare function verifyPassword(password: string, hash: string): Promise<boolean>;
export declare function generateAccessToken(user: Omit<User, 'password_hash'>): string;
export declare function generateRefreshToken(userId: string, rememberMe?: boolean): string;
export declare function verifyAccessToken(token: string): {
    userId: string;
    email: string;
    name?: string;
    picture?: string;
} | null;
export declare function sendVerificationCode(email: string, type: 'register' | 'reset_password'): Promise<{
    success: boolean;
    code?: string;
    error?: string;
}>;
export declare function register(data: RegisterData): Promise<AuthResult>;
export declare function login(data: LoginData): Promise<AuthResult>;
export declare function resetPassword(email: string, code: string, newPassword: string): Promise<{
    success: boolean;
    error?: string;
}>;
export declare function googleLogin(credential: string): Promise<AuthResult>;
