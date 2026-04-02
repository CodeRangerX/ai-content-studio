import crypto from 'crypto';

// ========== Webhook 签名验证 ==========

// 缓存 PayPal 证书
const certCache: Map<string, { cert: string; expiresAt: number }> = new Map();

// 获取 PayPal 证书
async function getPayPalCert(certUrl: string): Promise<string> {
  // 检查缓存
  const cached = certCache.get(certUrl);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.cert;
  }

  const response = await fetch(certUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch PayPal cert from ${certUrl}`);
  }

  const cert = await response.text();
  
  // 缓存 24 小时
  certCache.set(certUrl, {
    cert,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  });

  return cert;
}

// 验证 Webhook 签名
export async function verifyWebhookSignature(
  headers: Record<string, string>,
  body: string
): Promise<{ valid: boolean; event?: any; error?: string }> {
  try {
    const transmissionId = headers['paypal-transmission-id'];
    const transmissionTime = headers['paypal-transmission-time'];
    const certUrl = headers['paypal-cert-url'];
    const authAlgo = headers['paypal-auth-algo'] || 'SHA256withRSA';
    const transmissionSig = headers['paypal-transmission-sig'];
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;

    // 检查必要字段
    if (!transmissionId || !transmissionTime || !certUrl || !transmissionSig) {
      return { valid: false, error: 'Missing required PayPal headers' };
    }

    // 验证证书 URL 来自 PayPal
    if (!certUrl.startsWith('https://api-m.paypal.com/') && 
        !certUrl.startsWith('https://api-m.sandbox.paypal.com/')) {
      return { valid: false, error: 'Invalid certificate URL' };
    }

    // 解析 body 获取 webhook event
    const event = JSON.parse(body);

    // 如果配置了 webhook ID，验证是否匹配
    if (webhookId) {
      // 构建预期签名内容
      const expectedSig = `${transmissionId}|${transmissionTime}|${webhookId}|${crypto.createHash('sha256').update(body).digest('hex')}`;
      
      // 获取证书
      const cert = await getPayPalCert(certUrl);
      
      // 验证签名
      const verifier = crypto.createVerify('RSA-SHA256');
      verifier.update(expectedSig);
      
      // 从证书提取公钥
      const certMatch = cert.match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/);
      if (!certMatch) {
        return { valid: false, error: 'Invalid certificate format' };
      }

      const valid = verifier.verify(certMatch[0], transmissionSig, 'base64');
      
      if (!valid) {
        console.error('PayPal webhook signature verification failed');
        return { valid: false, error: 'Signature verification failed' };
      }
    }

    return { valid: true, event };
  } catch (error) {
    console.error('Webhook verification error:', error);
    return { valid: false, error: 'Verification error' };
  }
}

export default {
  verifyWebhookSignature,
};