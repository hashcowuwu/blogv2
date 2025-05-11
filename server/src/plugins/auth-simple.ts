import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import { FastifyInstance } from 'fastify';
import { JWT_SECRET } from '../config/auth';

export default fp(async function (fastify: FastifyInstance, opts: {}) {
  fastify.register(jwt, {
    secret: JWT_SECRET,
  });
});