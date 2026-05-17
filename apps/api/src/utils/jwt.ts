import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export type AccessTokenPayload = {
  sub: string;
  email: string;
  type: "access";
};

export type RefreshTokenPayload = {
  sub: string;
  tokenId: string;
  type: "refresh";
};

export const signAccessToken = (payload: Omit<AccessTokenPayload, "type">): string =>
  jwt.sign({ ...payload, type: "access" }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_TTL as SignOptions["expiresIn"]
  });

export const signRefreshToken = (payload: Omit<RefreshTokenPayload, "type">): string =>
  jwt.sign({ ...payload, type: "refresh" }, env.JWT_REFRESH_SECRET, {
    expiresIn: `${env.JWT_REFRESH_TTL_DAYS}d` as SignOptions["expiresIn"]
  });

export const verifyAccessToken = (token: string): AccessTokenPayload =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;

export const verifyRefreshToken = (token: string): RefreshTokenPayload =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
