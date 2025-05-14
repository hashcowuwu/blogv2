// src/modules/auth/auth.service.ts
import bcrypt from "bcrypt";
import { FastifyInstance } from "fastify";
import { SALT_ROUNDS } from "../../config/auth";

interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export async function registerUser(
  username: string,
  email: string,
  password: string,
  db: FastifyInstance["pg"],
): Promise<Omit<User, "password_hash">> {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const { rows } = await db.query<Omit<User, "password_hash">>(
    "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at, updated_at",
    [username, email, passwordHash],
  );
  return rows[0];
}

export async function findUserByUsernameOrEmail(
  username: string,
  email: string,
  db: FastifyInstance["pg"],
): Promise<User | undefined> {
  const { rows } = await db.query<User>(
    "SELECT id, username, email, password_hash, created_at, updated_at FROM users WHERE username = $1 OR email = $2",
    [username, email],
  );
  return rows[0];
}

export async function comparePasswords(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

interface JWTPayload {
  id: number;
  username: string;
  email: string;
}

export function generateToken(
  payload: JWTPayload,
  jwt: FastifyInstance["jwt"],
): string {
  return jwt.sign(payload);
}
