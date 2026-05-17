import type { AccessTokenPayload } from "./utils/jwt.js";

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      auth?: AccessTokenPayload;
      idempotencyKey?: string;
    }
  }
}

export {};
