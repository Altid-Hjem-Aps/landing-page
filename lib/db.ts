import mysql from 'mysql2/promise'

// Connection pool to the Altid Hjem database.
// Credentials come from environment variables (.env.local locally, Vercel in prod).
let pool: mysql.Pool | null = null

function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT ?? 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 3,
      enableKeepAlive: true,
    })
  }
  return pool
}

/**
 * Record that `referredEmail` joined via `referrerCode` (the inviter's public_id).
 * Lives in our own `referral` table — does not touch the backend's tables.
 * Safe to call fire-and-forget; duplicates (same email) are ignored.
 */
export async function recordReferral(opts: {
  referrerCode: string
  referredEmail: string
  referredId?: string | null
}): Promise<void> {
  const referrerCode = String(opts.referrerCode || '').trim().slice(0, 64)
  const referredEmail = String(opts.referredEmail || '').trim().toLowerCase()
  if (!referrerCode || !referredEmail) return
  if (referrerCode.toLowerCase() === referredEmail) return // guard against obvious self-refer

  await getPool().execute(
    `INSERT IGNORE INTO referral (referrer_code, referred_email, referred_id, created_at)
     VALUES (?, ?, ?, NOW())`,
    [referrerCode, referredEmail, opts.referredId ?? null],
  )
}

/** How many people a given referral code has successfully brought in. */
export async function getReferralCount(referrerCode: string): Promise<number> {
  const code = String(referrerCode || '').trim().slice(0, 64)
  if (!code) return 0
  const [rows] = await getPool().execute(
    'SELECT COUNT(*) AS n FROM referral WHERE referrer_code = ?',
    [code],
  )
  const result = rows as Array<{ n: number }>
  return result[0]?.n ?? 0
}
