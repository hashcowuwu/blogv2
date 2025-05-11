import fp from 'fastify-plugin';
import jwt, { FastifyJWT } from '@fastify/jwt';
import { FastifyInstance } from 'fastify';
import { JWT_SECRET } from '../config/auth';

export default fp(async function (fastify: FastifyInstance, opts: {}) {
  fastify.register(jwt, {
    secret: JWT_SECRET,
  });

  fastify.decorate('$jwt', fastify.jwt); // 将装饰器名称更改为 '$jwt'
});

declare module 'fastify' {
  interface FastifyInstance {
    $jwt: FastifyJWT; // 更新类型声明以匹配新的装饰器名称
  }
}