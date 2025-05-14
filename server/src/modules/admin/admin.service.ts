// src/modules/admin/admin.service.ts
import { Pool } from "pg";

// 假设你已经配置好了数据库连接池
const pool = new Pool({
  user: "your_db_user",
  host: "your_db_host",
  database: "your_db_name",
  password: "your_db_password",
  port: 5432, // 默认 PostgreSQL 端口
});

interface User {
  id: number;
  username: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  role?: string; // 假设你的用户表可能包含 role 字段
}

interface CreateUserInput {
  username: string;
  email: string;
  password_hash: string; // 控制器中需要对密码进行哈希处理
  role?: string;
}

interface UpdateUserInput {
  username?: string;
  email?: string;
  password_hash?: string;
  role?: string;
}

export class AdminService {
  async getAllUsers(): Promise<User[]> {
    try {
      const result = await pool.query<User>(
        "SELECT id, username, email, created_at, updated_at, role FROM users",
      );
      return result.rows;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw new Error("Failed to fetch users from the database");
    }
  }

  async createUser(userData: CreateUserInput): Promise<User> {
    const { username, email, password_hash, role } = userData;
    try {
      const result = await pool.query<User>(
        "INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, created_at, updated_at, role",
        [username, email, password_hash, role],
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.code === "23505") {
        // Unique violation error code (username or email already exists)
        throw new Error("Username or email already exists");
      }
      throw new Error("Failed to create user in the database");
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      const result = await pool.query<User>(
        "SELECT id, username, email, created_at, updated_at, role FROM users WHERE id = $1",
        [id],
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw new Error("Failed to fetch user from the database");
    }
  }

  async updateUser(
    id: number,
    userData: UpdateUserInput,
  ): Promise<User | null> {
    const { username, email, password_hash, role } = userData;
    const values = [];
    let query = "UPDATE users SET updated_at = CURRENT_TIMESTAMP";
    let paramCount = 1;

    if (username) {
      query += ` , username = $${paramCount++}`;
      values.push(username);
    }
    if (email) {
      query += ` , email = $${paramCount++}`;
      values.push(email);
    }
    if (password_hash) {
      query += ` , password_hash = $${paramCount++}`;
      values.push(password_hash);
    }
    if (role) {
      query += ` , role = $${paramCount++}`;
      values.push(role);
    }

    query += ` WHERE id = $${paramCount} RETURNING id, username, email, created_at, updated_at, role`;
    values.push(id);

    try {
      const result = await pool.query<User>(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error updating user:", error);
      if (error.code === "23505") {
        throw new Error("Username or email already exists");
      }
      throw new Error("Failed to update user in the database");
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Failed to delete user from the database");
    }
  }
}

// 在控制器中实例化 AdminService
// export const adminService = new AdminService();
