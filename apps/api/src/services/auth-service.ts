import bcrypt from "bcryptjs";
import { createHash, randomUUID } from "node:crypto";
import {
  createUser,
  findUserByEmail,
  findUserById,
  isRefreshTokenActive,
  persistRefreshToken,
  revokeRefreshToken
} from "../repositories/auth-repository.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { HttpError } from "../middleware/error-handler.js";
import { env } from "../config/env.js";

const hashToken = (token: string): string => createHash("sha256").update(token).digest("hex");

const refreshExpiry = (): Date => {
  const ms = env.JWT_REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + ms);
};

export const registerUser = async (name: string, email: string, password: string) => {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new HttpError(409, "EMAIL_ALREADY_EXISTS", "Email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser(name, email, passwordHash);

  return issueTokens(user.id, user.email);
};

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new HttpError(401, "INVALID_CREDENTIALS", "Invalid credentials");
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new HttpError(401, "INVALID_CREDENTIALS", "Invalid credentials");
  }

  return issueTokens(user.id, user.email);
};

export const refreshUserSession = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);
  const hashed = hashToken(refreshToken);

  const active = await isRefreshTokenActive(hashed);
  if (!active) {
    throw new HttpError(401, "INVALID_REFRESH_TOKEN", "Refresh token revoked or expired");
  }

  const user = await findUserById(payload.sub);
  if (!user) {
    throw new HttpError(401, "INVALID_REFRESH_TOKEN", "User not found");
  }

  await revokeRefreshToken(hashed);

  return issueTokens(user.id, user.email);
};

export const logoutSession = async (refreshToken: string): Promise<void> => {
  await revokeRefreshToken(hashToken(refreshToken));
};

const issueTokens = async (userId: string, email: string) => {
  const refreshTokenId = randomUUID();
  const accessToken = signAccessToken({ sub: userId, email });
  const refreshToken = signRefreshToken({ sub: userId, tokenId: refreshTokenId });

  await persistRefreshToken(userId, hashToken(refreshToken), refreshExpiry());

  return {
    accessToken,
    refreshToken,
    user: {
      id: userId,
      email
    }
  };
};
