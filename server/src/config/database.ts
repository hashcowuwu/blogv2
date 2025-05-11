// src/config/database.ts
import { FastifyPluginOptions } from 'fastify';

export interface DatabaseConfig extends FastifyPluginOptions {
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  connectionString?: string; // 可以使用连接字符串替代单独的配置
  max?: number; // 连接池最大连接数
  idleTimeoutMillis?: number; // 连接空闲超时时间
}

const databaseConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'your_password',
  database: process.env.DB_DATABASE || 'your_database',
  // connectionString: process.env.DATABASE_URL, // 如果使用连接字符串
  max: parseInt(process.env.DB_MAX_CONNECTIONS || '10'),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
};

export default databaseConfig;