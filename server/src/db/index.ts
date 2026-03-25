import initSqlJs, { Database } from 'sql.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '../../data');
const dbPath = join(dataDir, 'app.db');

// 确保数据目录存在
mkdirSync(dataDir, { recursive: true });

let db: Database;

// 初始化数据库
export async function initDatabase() {
  const SQL = await initSqlJs();
  
  // 尝试加载现有数据库
  if (existsSync(dbPath)) {
    const fileBuffer = readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // 创建表
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      name TEXT,
      picture TEXT,
      email_verified INTEGER DEFAULT 0,
      provider TEXT DEFAULT 'email',
      provider_id TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      last_login_at TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS verification_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      type TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 创建订阅表
  db.run(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      paypal_subscription_id TEXT,
      paypal_plan_id TEXT,
      status TEXT NOT NULL DEFAULT 'inactive',
      plan TEXT NOT NULL DEFAULT 'free',
      current_period_start TEXT,
      current_period_end TEXT,
      cancel_at_period_end INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 创建支付记录表
  db.run(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      subscription_id TEXT,
      paypal_order_id TEXT,
      amount INTEGER,
      currency TEXT DEFAULT 'USD',
      status TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 创建索引
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_verification_codes ON verification_codes(email, type)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_refresh_tokens ON refresh_tokens(token)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_subscriptions_paypal ON subscriptions(paypal_subscription_id)`);

  // 创建使用次数追踪表
  db.run(`
    CREATE TABLE IF NOT EXISTS usage_tracking (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, date)
    )
  `);
  db.run(`CREATE INDEX IF NOT EXISTS idx_usage_user_date ON usage_tracking(user_id, date)`);

  // ============================================
  // 点数系统相关表
  // ============================================

  // 用户点数余额
  db.run(`
    CREATE TABLE IF NOT EXISTS user_credits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL UNIQUE,
      balance INTEGER DEFAULT 0,
      total_purchased INTEGER DEFAULT 0,
      total_used INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 点数购买记录
  db.run(`
    CREATE TABLE IF NOT EXISTS credit_purchases (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      package_id TEXT NOT NULL,
      points INTEGER NOT NULL,
      price INTEGER NOT NULL,
      paypal_order_id TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now')),
      completed_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 点数交易记录
  db.run(`
    CREATE TABLE IF NOT EXISTS credit_transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      points INTEGER NOT NULL,
      balance_after INTEGER NOT NULL,
      description TEXT,
      related_id TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 生成历史记录
  db.run(`
    CREATE TABLE IF NOT EXISTS generations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      template_id TEXT NOT NULL,
      template_name TEXT NOT NULL,
      input_data TEXT NOT NULL,
      output_content TEXT,
      credits_used INTEGER DEFAULT 0,
      cost_type TEXT NOT NULL,
      tokens_input INTEGER,
      tokens_output INTEGER,
      generation_time_ms INTEGER,
      status TEXT DEFAULT 'success',
      error_message TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 点数相关索引
  db.run(`CREATE INDEX IF NOT EXISTS idx_user_credits ON user_credits(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_credit_purchases_user ON credit_purchases(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON credit_transactions(user_id, created_at DESC)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_generations_user ON generations(user_id, created_at DESC)`);

  // 保存到文件
  saveDatabase();

  console.log('✅ Database initialized');
}

// 保存数据库到文件
export function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    writeFileSync(dbPath, buffer);
  }
}

// 执行查询（返回结果）
export function query<T = any>(sql: string, params: any[] = []): T[] {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  
  const results: T[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    results.push(row as T);
  }
  stmt.free();
  
  return results;
}

// 执行查询（返回单条）
export function queryOne<T = any>(sql: string, params: any[] = []): T | null {
  const results = query<T>(sql, params);
  return results.length > 0 ? results[0] : null;
}

// 执行更新
export function run(sql: string, params: any[] = []): { changes: number; lastInsertRowId: number } {
  db.run(sql, params);
  saveDatabase();
  
  const result = queryOne<{ changes: number; lastInsertRowId: number }>(
    "SELECT changes() as changes, last_insert_rowid() as lastInsertRowId"
  );
  
  return result || { changes: 0, lastInsertRowId: 0 };
}

export default { initDatabase, query, queryOne, run, saveDatabase };