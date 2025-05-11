// src/config/auth.js
export const SALT_ROUNDS = 10; // bcrypt 的盐值轮数
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // 记得在 .env 文件中设置 JWT_SECRET

const authConfig = {
  SALT_ROUNDS,
  JWT_SECRET,
};

export default authConfig;