export interface User {
    id: string;
    email: string;
    password_hash: string | null;
    name: string | null;
    picture: string | null;
    email_verified: boolean;
    provider: string;
    provider_id: string | null;
    created_at: string;
    updated_at: string;
    last_login_at: string | null;
}
export interface CreateUserData {
    email: string;
    passwordHash?: string;
    name?: string;
    picture?: string;
    emailVerified?: boolean;
    provider?: string;
    providerId?: string;
}
export declare function generateUserId(): string;
export declare function createUser(data: CreateUserData): User;
export declare function getUserById(id: string): User | null;
export declare function getUserByEmail(email: string): User | null;
export declare function getUserByProviderId(provider: string, providerId: string): User | null;
export declare function updateUser(id: string, data: Partial<User>): User | null;
export declare function updateLastLogin(id: string): void;
export declare function deleteUser(id: string): boolean;
