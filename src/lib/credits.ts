// 点数相关 API

import { getApiUrl } from './auth';

export interface CreditBalance {
  balance: number;
  totalPurchased: number;
  totalUsed: number;
  isPro: boolean;
  canUse: boolean;
}

export interface CreditPackage {
  id: string;
  points: number;
  price: number;
  name: { zh: string; en: string };
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'purchase' | 'consume' | 'gift' | 'refund';
  points: number;
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
  status: 'success' | 'failed';
  created_at: string;
}

export interface UserStats {
  credits: {
    balance: number;
    totalPurchased: number;
    totalUsed: number;
  };
  generations: {
    totalThisMonth: number;
    byTemplate: Record<string, number>;
    creditsUsed: number;
  };
}

// 获取点数余额
export async function getCreditBalance(): Promise<{ success: boolean; data?: CreditBalance; error?: string }> {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  
  const res = await fetch(getApiUrl('/api/credits/balance'), {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return res.json();
}

// 获取点数包列表
export async function getCreditPackages(): Promise<{ success: boolean; data?: Record<string, CreditPackage> }> {
  const res = await fetch(getApiUrl('/api/credits/packages'));
  return res.json();
}

// 购买点数
export async function purchaseCredits(packageId: string): Promise<{
  success: boolean;
  data?: {
    orderId: string;
    purchaseId: string;
    approvalUrl: string;
    package: CreditPackage;
  };
  error?: string;
  message?: string;
}> {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  
  const res = await fetch(getApiUrl('/api/credits/purchase'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ packageId }),
  });
  
  return res.json();
}

// 确认购买
export async function capturePurchase(orderId: string): Promise<{
  success: boolean;
  data?: { newBalance: number; points: number };
  error?: string;
}> {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  
  const res = await fetch(getApiUrl(`/api/credits/purchase/${orderId}/capture`), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return res.json();
}

// 获取交易历史
export async function getTransactions(limit: number = 50, offset: number = 0): Promise<{
  success: boolean;
  data?: {
    transactions: Transaction[];
    summary: {
      totalPurchased: number;
      totalUsed: number;
      balance: number;
    };
    isPro: boolean;
  };
}> {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  
  const res = await fetch(getApiUrl(`/api/credits/history?limit=${limit}&offset=${offset}`), {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return res.json();
}

// 获取生成历史
export async function getGenerations(limit: number = 20, offset: number = 0): Promise<{
  success: boolean;
  data?: Generation[];
}> {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  
  const res = await fetch(getApiUrl(`/api/generations?limit=${limit}&offset=${offset}`), {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return res.json();
}

// 获取用户统计
export async function getUserStats(): Promise<{ success: boolean; data?: UserStats }> {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  
  const res = await fetch(getApiUrl('/api/stats'), {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return res.json();
}