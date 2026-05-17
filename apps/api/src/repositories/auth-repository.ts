import { pool } from "../db/pool.js";

type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
};

export const findUserByEmail = async (email: string): Promise<UserRow | null> => {
  const { rows } = await pool.query(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [email]);
  return rows[0] ?? null;
};

export const findUserById = async (id: string): Promise<UserRow | null> => {
  const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1 LIMIT 1`, [id]);
  return rows[0] ?? null;
};

export const createUser = async (name: string, email: string, passwordHash: string): Promise<UserRow> => {
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *`,
    [name, email, passwordHash]
  );
  return rows[0] as UserRow;
};

export const persistRefreshToken = async (
  userId: string,
  tokenHash: string,
  expiresAt: Date
): Promise<void> => {
  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt.toISOString()]
  );
};

export const revokeRefreshToken = async (tokenHash: string): Promise<void> => {
  await pool.query(
    `UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = $1 AND revoked_at IS NULL`,
    [tokenHash]
  );
};

export const isRefreshTokenActive = async (tokenHash: string): Promise<boolean> => {
  const { rows } = await pool.query(
    `SELECT 1 FROM refresh_tokens
     WHERE token_hash = $1
       AND revoked_at IS NULL
       AND expires_at > NOW()
     LIMIT 1`,
    [tokenHash]
  );
  return Boolean(rows[0]);
};
