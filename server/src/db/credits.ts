import { query, queryOne, run } from './index.js';
import crypto from 'crypto';

// ============================================
// Types
// ============================================

export interface UserCredits {
  id: number;
  user_id: string;
  balance: number;
  total_purchased: number;
  total_used: number;
  created_at: string;
  updated_at: string;
}

export interface CreditPurchase {
  id: string;
  user_id: string;
  package_id: string;
  points: number;
  price: number;
  paypal_order_id: string | null;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  completed_at: string | null;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  type: 'purchase' | 'consume' | 'gift' | 'refund';
  points: number; // 正数为增加，负数为减少
  balance_after: number;
  description: string | null;
  related_id: string | null;
  created_at: string;
}

export interface Generation {
  id: string;
  user_id: string;
  template_id: string;
  template_name: string;
  input_data: string;
  output_content: string | null;
  credits_used: number;
  tokens_input: number | null;
  tokens_output: number | null;
  generation_time_ms: number | null;
  status: 'success' | 'failed';
  error_message: string | null;
  created_at: string;
}

// 点数包定义
export const CREDIT_PACKAGES = {
  starter: { id: 'starter', points: 100, price: 299, name: { zh: '入门包', en: 'Starter' } },
  standard: { id: 'standard', points: 300, price: 699, name: { zh: '标准包', en: 'Standard' } },
  advanced: { id: 'advanced', points: 800, price: 1499, name: { zh: '进阶包', en: 'Advanced' } },
  professional: { id: 'professional', points: 2000, price: 2999, name: { zh: '专业包', en: 'Professional' } },
} as const;

export type CreditPackageId = keyof typeof CREDIT_PACKAGES;

// ============================================
// Helper Functions
// ============================================

function generateId(prefix: string): string {
  return `${prefix}_${crypto.randomBytes(16).toString('hex')}`;
}

// ============================================
// User Credits
// ============================================

// 获取或创建用户点数记录
export function getOrCreateUserCredits(userId: string): UserCredits {
  let credits = queryOne<UserCredits>(
    'SELECT * FROM user_credits WHERE user_id = ?',
    [userId]
  );

  if (!credits) {
    run(
      'INSERT INTO user_credits (user_id, balance, total_purchased, total_used) VALUES (?, 0, 0, 0)',
      [userId]
    );
    credits = queryOne<UserCredits>(
      'SELECT * FROM user_credits WHERE user_id = ?',
      [userId]
    );
  }

  return credits!;
}

// 更新用户点数余额
export function updateCreditsBalance(
  userId: string,
  pointsDelta: number,
  type: 'purchase' | 'consume' | 'gift' | 'refund',
  description?: string,
  relatedId?: string
): UserCredits {
  const current = getOrCreateUserCredits(userId);
  const newBalance = current.balance + pointsDelta;

  // 更新余额
  run(
    `UPDATE user_credits 
     SET balance = ?, 
         total_purchased = total_purchased + ?, 
         total_used = total_used + ?,
         updated_at = datetime('now')
     WHERE user_id = ?`,
    [
      newBalance,
      pointsDelta > 0 ? pointsDelta : 0,
      pointsDelta < 0 ? Math.abs(pointsDelta) : 0,
      userId
    ]
  );

  // 记录交易
  const transactionId = generateId('txn');
  run(
    `INSERT INTO credit_transactions 
     (id, user_id, type, points, balance_after, description, related_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [transactionId, userId, type, pointsDelta, newBalance, description || null, relatedId || null]
  );

  return getOrCreateUserCredits(userId);
}

// 检查用户是否有足够点数
export function hasEnoughCredits(userId: string, amount: number): boolean {
  const credits = getOrCreateUserCredits(userId);
  return credits.balance >= amount;
}

// 扣除点数
export function deductCredits(userId: string, amount: number, description?: string, relatedId?: string): { success: boolean; balance: number } {
  const current = getOrCreateUserCredits(userId);
  
  if (current.balance < amount) {
    return { success: false, balance: current.balance };
  }

  updateCreditsBalance(userId, -amount, 'consume', description, relatedId);
  
  return { success: true, balance: current.balance - amount };
}

// ============================================
// Credit Purchases
// ============================================

// 创建购买记录
export function createPurchase(
  userId: string,
  packageId: CreditPackageId,
  paypalOrderId?: string
): CreditPurchase {
  const pkg = CREDIT_PACKAGES[packageId];
  if (!pkg) {
    throw new Error(`Invalid package: ${packageId}`);
  }

  const id = generateId('pur');
  
  run(
    `INSERT INTO credit_purchases 
     (id, user_id, package_id, points, price, paypal_order_id, status)
     VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
    [id, userId, packageId, pkg.points, pkg.price, paypalOrderId || null]
  );

  return getPurchaseById(id)!;
}

// 获取购买记录
export function getPurchaseById(id: string): CreditPurchase | null {
  return queryOne<CreditPurchase>(
    'SELECT * FROM credit_purchases WHERE id = ?',
    [id]
  );
}

// 获取用户的购买记录
export function getUserPurchases(userId: string, limit: number = 20): CreditPurchase[] {
  return query<CreditPurchase>(
    'SELECT * FROM credit_purchases WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
    [userId, limit]
  );
}

// 完成购买
export function completePurchase(purchaseId: string): { success: boolean; newBalance: number } {
  const purchase = getPurchaseById(purchaseId);
  
  if (!purchase) {
    throw new Error('Purchase not found');
  }

  if (purchase.status === 'completed') {
    // 已经完成过了
    const credits = getOrCreateUserCredits(purchase.user_id);
    return { success: true, newBalance: credits.balance };
  }

  // 更新购买状态
  run(
    `UPDATE credit_purchases SET status = 'completed', completed_at = datetime('now') WHERE id = ?`,
    [purchaseId]
  );

  // 增加用户点数
  const pkg = CREDIT_PACKAGES[purchase.package_id as CreditPackageId];
  const updated = updateCreditsBalance(
    purchase.user_id,
    pkg.points,
    'purchase',
    `购买 ${pkg.name.zh} (${pkg.points} 点)`,
    purchaseId
  );

  return { success: true, newBalance: updated.balance };
}

// ============================================
// Credit Transactions
// ============================================

// 获取交易记录
export function getTransactions(userId: string, limit: number = 50, offset: number = 0): CreditTransaction[] {
  return query<CreditTransaction>(
    'SELECT * FROM credit_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [userId, limit, offset]
  );
}

// 获取交易统计
export function getTransactionSummary(userId: string): {
  totalPurchased: number;
  totalUsed: number;
  balance: number;
} {
  const credits = getOrCreateUserCredits(userId);
  return {
    totalPurchased: credits.total_purchased,
    totalUsed: credits.total_used,
    balance: credits.balance,
  };
}

// ============================================
// Generations
// ============================================

// 创建生成记录
export function createGeneration(
  userId: string,
  templateId: string,
  templateName: string,
  inputData: Record<string, any>
): Generation {
  const id = generateId('gen');
  
  run(
    `INSERT INTO generations 
     (id, user_id, template_id, template_name, input_data, credits_used, status)
     VALUES (?, ?, ?, ?, ?, 0, 'pending')`,
    [id, userId, templateId, templateName, JSON.stringify(inputData)]
  );

  return getGenerationById(id)!;
}

// 获取生成记录
export function getGenerationById(id: string): Generation | null {
  return queryOne<Generation>(
    'SELECT * FROM generations WHERE id = ?',
    [id]
  );
}

// 更新生成结果
export function updateGenerationResult(
  id: string,
  outputContent: string,
  creditsUsed: number,
  tokensInput?: number,
  tokensOutput?: number,
  generationTimeMs?: number
): void {
  run(
    `UPDATE generations 
     SET output_content = ?, 
         credits_used = ?, 
         tokens_input = ?, 
         tokens_output = ?, 
         generation_time_ms = ?, 
         status = 'success'
     WHERE id = ?`,
    [outputContent, creditsUsed, tokensInput || null, tokensOutput || null, generationTimeMs || null, id]
  );
}

// 标记生成失败
export function markGenerationFailed(id: string, errorMessage: string): void {
  run(
    `UPDATE generations SET status = 'failed', error_message = ? WHERE id = ?`,
    [errorMessage, id]
  );
}

// 获取用户生成历史
export function getUserGenerations(userId: string, limit: number = 20, offset: number = 0): Generation[] {
  return query<Generation>(
    'SELECT * FROM generations WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [userId, limit, offset]
  );
}

// 获取用户生成统计
export function getUserGenerationStats(userId: string, days: number = 30): {
  total: number;
  byTemplate: Record<string, number>;
  creditsUsed: number;
} {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().replace('T', ' ').slice(0, 19);

  const generations = query<Generation>(
    'SELECT * FROM generations WHERE user_id = ? AND created_at >= ?',
    [userId, sinceStr]
  );

  const byTemplate: Record<string, number> = {};
  let creditsUsed = 0;

  for (const gen of generations) {
    byTemplate[gen.template_name] = (byTemplate[gen.template_name] || 0) + 1;
    creditsUsed += gen.credits_used;
  }

  return {
    total: generations.length,
    byTemplate,
    creditsUsed,
  };
}

// 新用户赠送点数
export function grantNewUserCredits(userId: string, points: number = 15): void {
  updateCreditsBalance(userId, points, 'gift', '新用户注册赠送');
}