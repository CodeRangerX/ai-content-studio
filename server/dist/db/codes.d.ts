export interface VerificationCode {
    id: number;
    email: string;
    code: string;
    type: 'register' | 'reset_password';
    expires_at: string;
    used: boolean;
    created_at: string;
}
export declare function generateCode(): string;
export declare function createVerificationCode(email: string, type: 'register' | 'reset_password', expiresInMinutes?: number): string;
export declare function verifyCode(email: string, code: string, type: 'register' | 'reset_password'): {
    valid: boolean;
    error?: string;
};
export declare function canSendCode(email: string, type: string): boolean;
export declare function cleanupExpiredCodes(): void;
