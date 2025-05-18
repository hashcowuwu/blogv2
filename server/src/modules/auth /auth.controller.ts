// src/modules/auth/auth.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import {
  registerUser,
  findUserByUsernameOrEmail,
  comparePasswords,
  generateToken,
} from "./auth.service";
import { RegisterBodyType, LoginBodyType } from "./auth.schema";
import cookie, { FastifyCookieOptions } from "@fastify/cookie";

export async function registerHandler(
  request: FastifyRequest<{ Body: RegisterBodyType }>,
  reply: FastifyReply,
) {
  try {
    const { username, email, password } = request.body;

    const existingUser = await findUserByUsernameOrEmail(
      username,
      email,
      request.server.pg,
    );
    if (existingUser) {
      return reply.status(409).send({ message: "用户名或邮箱已被注册" });
    }

    const newUser = await registerUser(
      username,
      email,
      password,
      request.server.pg,
    );

    reply.status(201).send(newUser);
  } catch (error) {
    console.error("注册失败:", error);
    reply.status(500).send({ message: "注册失败" });
  }
}

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginBodyType }>,
  reply: FastifyReply,
) {
  try {
    const { username, password } = request.body;

    const user = await findUserByUsernameOrEmail(
      username,
      username,
      request.server.pg,
    );
    if (!user) {
      return reply.status(401).send({ message: "无效的用户名或密码" });
    }

    const isPasswordValid = await comparePasswords(
      password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      return reply.status(401).send({ message: "无效的用户名或密码" });
    }

    const token = generateToken(
      { id: user.id, username: user.username, email: user.email },
      request.server.jwt,
    );
    console.log("About to set authToken cookie:", token);

    reply
      .setCookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      })
      .send({
        token,
        user: { id: user.id, username: user.username, email: user.email },
      });
  } catch (error) {
    console.error("登录失败:", error);
    reply.status(500).send({ message: "登录失败" });
  }
}
