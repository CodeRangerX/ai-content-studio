import { queryOne, run } from './index.js';
import crypto from 'crypto';
// 生成用户 ID
export function generateUserId() {
    return 'usr_' + crypto.randomBytes(16).toString('hex');
}
// 创建用户
export function createUser(data) {
    const id = generateUserId();
    run(`INSERT INTO users (id, email, password_hash, name, picture, email_verified, provider, provider_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
        id,
        data.email,
        data.passwordHash || null,
        data.name || null,
        data.picture || null,
        data.emailVerified ? 1 : 0,
        data.provider || 'email',
        data.providerId || null
    ]);
    return getUserById(id);
}
// 通过 ID 获取用户
export function getUserById(id) {
    const row = queryOne('SELECT * FROM users WHERE id = ?', [id]);
    return row ? { ...row, email_verified: !!row.email_verified } : null;
}
// 通过邮箱获取用户
export function getUserByEmail(email) {
    const row = queryOne('SELECT * FROM users WHERE email = ?', [email]);
    return row ? { ...row, email_verified: !!row.email_verified } : null;
}
// 通过第三方提供商标识获取用户
export function getUserByProviderId(provider, providerId) {
    const row = queryOne('SELECT * FROM users WHERE provider = ? AND provider_id = ?', [provider, providerId]);
    return row ? { ...row, email_verified: !!row.email_verified } : null;
}
// 更新用户
export function updateUser(id, data) {
    const fields = [];
    const values = [];
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
    if (fields.length === 0)
        return getUserById(id);
    fields.push("updated_at = datetime('now')");
    values.push(id);
    run(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    return getUserById(id);
}
// 更新最后登录时间
export function updateLastLogin(id) {
    run("UPDATE users SET last_login_at = datetime('now') WHERE id = ?", [id]);
}
// 删除用户
export function deleteUser(id) {
    const result = run('DELETE FROM users WHERE id = ?', [id]);
    return result.changes > 0;
}
