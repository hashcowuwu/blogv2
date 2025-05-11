// src/plugins/database.ts
//将 PostgreSQL 集成到你的 Fastify 应用程序
import fp from 'fastify-plugin';
// import postgres, { PostgresPluginOptions } from '@fastify/postgres';
import postgres, { PostgresPluginOptions, PostgresDb } from '@fastify/postgres';
import databaseConfig from '../config/database';
import { FastifyInstance } from 'fastify';

export default fp<PostgresPluginOptions>(async (fastify: FastifyInstance) => {
  try {
    await fastify.register(postgres, {
      ...databaseConfig,
    });
  } catch (err) {
    console.error('Failed to register PostgreSQL plugin:', err);
    // 可以选择在这里抛出错误或者进行其他处理
    throw err;
  }
});

declare module 'fastify' {
  interface FastifyInstance {
    pg: PostgresDb & Record<string, PostgresDb>; // 仍然需要确定准确的类型
  }
}