import db from './index.js';
import crypto from 'crypto';

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

// 生成用户 ID
export function generateUserId(): string {
  return 'usr_' + crypto.randomBytes(16).toString('hex');
}

// 创建用户
export function createUser(data: CreateUserData): User {
  const id = generateUserId();
  const stmt = db.prepare(`
    INSERT INTO users (id, email, password_hash, name, picture, email_verified, provider, provider_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    id,
    data.email,
    data.passwordHash || null,
    data.name || null,
    data.picture || null,
    data.emailVerified ? 1 : 0,
    data.provider || 'email',
    data.providerId || null
  );

  return getUserById(id)!;
}

// 通过 ID 获取用户
export function getUserById(id: string): User | null {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  const row = stmt.get(id) as User | undefined;
  return row ? { ...row, email_verified: !!row.email_verified } : null;
}

// 通过邮箱获取用户
export function getUserByEmail(email: string): User | null {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const row = stmt.get(email) as User | undefined;
  return row ? { ...row, email_verified: !!row.email_verified } : null;
}

// 通过第三方提供商标识获取用户
export function getUserByProviderId(provider: string, providerId: string): User | null {
  const stmt = db.prepare('SELECT * FROM users WHERE provider = ? AND provider_id = ?');
  const row = stmt.get(provider, providerId) as User | undefined;
  return row ? { ...row, email_verified: !!row.email_verified } : null;
}

// 更新用户
export function updateUser(id: string, data: Partial<User>): User | null {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.name !== undefined) {
    fields.push('name = ?');
    values.push(data.name);
  }
  if (data.picture !== undefined) {
    fields.push('picture = ?');
    values.push(data.picture);
  }
  if (data.email_verified !== undefined) {
    fields.push('email_verified = ?');
    values.push(data.email_verified ? 1 : 0);
  }
  if (data.password_hash !== undefined) {
    fields.push('password_hash = ?');
    values.push(data.password_hash);
  }

  if (fields.length === 0) return getUserById(id);

  fields.push("updated_at = datetime('now')");
  values.push(id);

  const stmt = db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values);

  return getUserById(id);
}

// 更新最后登录时间
export function updateLastLogin(id: string): void {
  const stmt = db.prepare("UPDATE users SET last_login_at = datetime('now') WHERE id = ?");
  stmt.run(id);
}

// 删除用户
export function deleteUser(id: string): boolean {
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}