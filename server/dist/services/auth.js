import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail, getUserByProviderId, updateUser, updateLastLogin } from '../db/users.js';
import { createVerificationCode, verifyCode, canSendCode } from '../db/codes.js';
const SALT_ROUNDS = 12;
// 哈希密码
export async function hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
}
// 验证密码
export async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}
// 生成 Access Token
export function generateAccessToken(user) {
    return jwt.sign({
        userId: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture
    }, process.env.JWT_SECRET || 'default-secret', { expiresIn: '2h' });
}
// 生成 Refresh Token
export function generateRefreshToken(userId, rememberMe = false) {
    return jwt.sign({ userId, type: 'refresh' }, process.env.JWT_REFRESH_SECRET || 'default-refresh-secret', { expiresIn: rememberMe ? '30d' : '7d' });
}
// 验证 Access Token
export function verifyAccessToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    }
    catch {
        return null;
    }
}
// 发送验证码
export async function sendVerificationCode(email, type) {
    // 检查发送频率
    if (!canSendCode(email, type)) {
        return { success: false, error: '发送太频繁，请60秒后再试' };
    }
    // 检查邮箱是否已注册（注册时）
    if (type === 'register') {
        const existing = getUserByEmail(email);
        if (existing) {
            return { success: false, error: '该邮箱已被注册' };
        }
    }
    // 检查邮箱是否存在（重置密码时）
    if (type === 'reset_password') {
        const existing = getUserByEmail(email);
        if (!existing) {
            return { success: false, error: '该邮箱未注册' };
        }
    }
    // 生成验证码
    const code = createVerificationCode(email, type);
    // 发送邮件
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
        // 开发环境：返回验证码
        console.log(`[DEV] Verification code for ${email}: ${code}`);
        return { success: true, code }; // 开发模式返回验证码
    }
    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'noreply@yourdomain.com',
                to: email,
                subject: '【内容工坊】验证码',
                html: `
          <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">您好！</h2>
            <p>您的验证码是：</p>
            <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
              ${code}
            </div>
            <p style="color: #666; font-size: 14px;">验证码 5 分钟内有效，请勿泄露给他人。</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">— 内容工坊团队</p>
          </div>
        `,
            }),
        });
        if (!response.ok) {
            console.error('Failed to send email:', await response.text());
            return { success: false, error: '邮件发送失败' };
        }
        return { success: true };
    }
    catch (error) {
        console.error('Send email error:', error);
        return { success: false, error: '邮件发送失败' };
    }
}
// 注册
export async function register(data) {
    const { email, password, code } = data;
    // 验证验证码
    const codeResult = verifyCode(email, code, 'register');
    if (!codeResult.valid) {
        return { success: false, error: codeResult.error };
    }
    // 再次检查邮箱
    const existing = getUserByEmail(email);
    if (existing) {
        return { success: false, error: '该邮箱已被注册' };
    }
    // 创建用户
    const passwordHash = await hashPassword(password);
    const user = createUser({
        email,
        passwordHash,
        emailVerified: true,
        provider: 'email',
    });
    // 生成 Token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user.id);
    const { password_hash, ...userWithoutPassword } = user;
    return {
        success: true,
        user: userWithoutPassword,
        accessToken,
        refreshToken,
    };
}
// 登录
export async function login(data) {
    const { email, password, rememberMe } = data;
    // 查找用户
    const user = getUserByEmail(email);
    if (!user || !user.password_hash) {
        return { success: false, error: '邮箱或密码错误' };
    }
    // 验证密码
    const validPassword = await verifyPassword(password, user.password_hash);
    if (!validPassword) {
        return { success: false, error: '邮箱或密码错误' };
    }
    // 更新登录时间
    updateLastLogin(user.id);
    // 生成 Token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user.id, rememberMe);
    const { password_hash, ...userWithoutPassword } = user;
    return {
        success: true,
        user: userWithoutPassword,
        accessToken,
        refreshToken,
    };
}
// 重置密码
export async function resetPassword(email, code, newPassword) {
    // 验证验证码
    const codeResult = verifyCode(email, code, 'reset_password');
    if (!codeResult.valid) {
        return { success: false, error: codeResult.error };
    }
    // 查找用户
    const user = getUserByEmail(email);
    if (!user) {
        return { success: false, error: '用户不存在' };
    }
    // 更新密码
    const passwordHash = await hashPassword(newPassword);
    updateUser(user.id, { password_hash: passwordHash });
    return { success: true };
}
// Google 登录
export async function googleLogin(credential) {
    // 验证 Google Token
    const googleUser = await verifyGoogleToken(credential);
    if (!googleUser) {
        return { success: false, error: '登录凭证无效或已过期' };
    }
    if (!googleUser.email_verified) {
        return { success: false, error: '请先验证您的 Google 邮箱' };
    }
    // 查找或创建用户
    let user = getUserByProviderId('google', googleUser.sub);
    if (!user) {
        // 检查邮箱是否已被其他方式注册
        const existingUser = getUserByEmail(googleUser.email);
        if (existingUser) {
            // 关联 Google 账号
            user = updateUser(existingUser.id, {
                provider: 'google',
                provider_id: googleUser.sub,
                picture: googleUser.picture,
            });
        }
        else {
            // 创建新用户
            user = createUser({
                email: googleUser.email,
                name: googleUser.name,
                picture: googleUser.picture,
                emailVerified: true,
                provider: 'google',
                providerId: googleUser.sub,
            });
        }
    }
    // 更新登录时间
    updateLastLogin(user.id);
    // 生成 Token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user.id, true);
    const { password_hash, ...userWithoutPassword } = user;
    return {
        success: true,
        user: userWithoutPassword,
        accessToken,
        refreshToken,
    };
}
// 验证 Google Token
async function verifyGoogleToken(token) {
    try {
        const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
        if (!response.ok) {
            return null;
        }
        const userInfo = await response.json();
        // 验证 issuer
        if (userInfo.iss !== 'https://accounts.google.com' &&
            userInfo.iss !== 'accounts.google.com') {
            return null;
        }
        // 验证 audience
        const clientId = process.env.GOOGLE_CLIENT_ID;
        if (clientId && userInfo.aud !== clientId) {
            return null;
        }
        return userInfo;
    }
    catch (error) {
        console.error('Google token verification failed:', error);
        return null;
    }
}
