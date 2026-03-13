import { createHash, randomBytes } from "crypto";

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export function verifyPassword(password: string, hashed: string): boolean {
  return hashPassword(password) === hashed;
}

export function createToken(userId: number): string {
  return `${userId}.${randomBytes(16).toString("hex")}`;
}
