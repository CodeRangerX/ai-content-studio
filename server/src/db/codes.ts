import { query, queryOne, run } from './index.js';

export interface VerificationCode {
  id: number;
  email: string;
  code: string;
  type: 'register' | 'reset_password';
  expires_at: string;
  used: boolean;
  created_at: string;
}

// 生成 6 位验证码
export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 创建验证码
export function createVerificationCode(
  email: string,
  type: 'register' | 'reset_password',
  expiresInMinutes: number = 5
): string {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000).toISOString();

  // 删除该邮箱同类型的旧验证码
  run('DELETE FROM verification_codes WHERE email = ? AND type = ?', [email, type]);

  // 创建新验证码
  run(
    'INSERT INTO verification_codes (email, code, type, expires_at) VALUES (?, ?, ?, ?)',
    [email, code, type, expiresAt]
  );

  return code;
}

// 验证验证码
export function verifyCode(
  email: string,
  code: string,
  type: 'register' | 'reset_password'
): { valid: boolean; error?: string } {
  const record = queryOne<any>(
    `SELECT * FROM verification_codes 
     WHERE email = ? AND code = ? AND type = ? AND used = 0
     ORDER BY created_at DESC LIMIT 1`,
    [email, code, type]
  );

  if (!record) {
    return { valid: false, error: '验证码错误或已使用' };
  }

  if (new Date(record.expires_at) < new Date()) {
    return { valid: false, error: '验证码已过期' };
  }

  // 标记为已使用
  run('UPDATE verification_codes SET used = 1 WHERE id = ?', [record.id]);

  return { valid: true };
}

// 检查发送频率（60秒内只能发送1次）
export function canSendCode(email: string, type: string): boolean {
  const record = queryOne<{ created_at: string }>(
    `SELECT created_at FROM verification_codes 
     WHERE email = ? AND type = ? 
     ORDER BY created_at DESC LIMIT 1`,
    [email, type]
  );

  if (!record) return true;

  const lastSent = new Date(record.created_at);
  const now = new Date();
  const diffSeconds = (now.getTime() - lastSent.getTime()) / 1000;

  return diffSeconds >= 60;
}

// 清理过期验证码
export function cleanupExpiredCodes(): void {
  run("DELETE FROM verification_codes WHERE expires_at < datetime('now')");
}