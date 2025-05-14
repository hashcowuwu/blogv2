// src/modules/auth/auth.route.ts
import { FastifyPluginCallback } from "fastify";
import {
  registerSchema,
  loginSchema,
  authMeSchema,
  logoutSchema,
} from "./auth.schema";
import { registerHandler, loginHandler } from "./auth.controller";

const authRoutes: FastifyPluginCallback = async (fastify, options) => {
  fastify.post("/register", { schema: registerSchema }, registerHandler);
  fastify.post("/login", { schema: loginSchema }, loginHandler);
};

export default authRoutes;
