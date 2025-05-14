// src/modules/admin/admin.schema.ts
import { Type, Static } from "@sinclair/typebox";

// 创建用户的请求体 Schema
export const createUserSchema = {
  body: Type.Object({
    username: Type.String(),
    email: Type.String({ format: "email" }),
    password: Type.String({ minLength: 6 }),
    role: Type.Optional(Type.String()), // 可选的角色字段
  }),
};

// 更新用户的请求体 Schema
export const updateUserSchema = {
  body: Type.Object({
    username: Type.Optional(Type.String()),
    email: Type.Optional(Type.String({ format: "email" })),
    password: Type.Optional(Type.String({ minLength: 6 }), {
      description: "Leave empty to keep current password",
    }),
    role: Type.Optional(Type.String()),
  }),
  params: Type.Object({
    id: Type.String(), // 用户 ID 作为路径参数
  }),
};

// 删除用户的路径参数 Schema
export const deleteUserSchema = {
  params: Type.Object({
    id: Type.String(), // 用户 ID 作为路径参数
  }),
};

// 获取用户列表的响应体 Schema (示例)
export const getUsersResponseSchema = {
  response: {
    200: Type.Array(
      Type.Object({
        id: Type.Number(),
        username: Type.String(),
        email: Type.String({ format: "email" }),
        role: Type.Optional(Type.String()),
        createdAt: Type.String({ format: "date-time" }),
        updatedAt: Type.String({ format: "date-time" }),
      }),
    ),
  },
};

// 获取单个用户的响应体 Schema (示例)
export const getUserResponseSchema = {
  response: {
    200: Type.Object({
      id: Type.Number(),
      username: Type.String(),
      email: Type.String({ format: "email" }),
      role: Type.Optional(Type.String()),
      createdAt: Type.String({ format: "date-time" }),
      updatedAt: Type.String({ format: "date-time" }),
    }),
  },
};

// 你可以根据你的 API 需求定义更多的 schema
