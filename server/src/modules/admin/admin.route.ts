// src/modules/admin/admin.route.ts
import { FastifyPluginCallback } from "fastify";
import { authenticate } from "../../hooks/auth.hook"; // 导入鉴权钩子
import {
  getDashboardHandler,
  getUsersHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
  // ... 其他后台管理相关的处理函数
} from "./admin.controller"; // 导入控制器中的处理函数
import {
  // getDashboardSchema, // 如果需要定义请求或响应 schema
  // getUsersSchema,
  createUserSchema,
  updateUserSchema,
  deleteUserSchema,
  // ... 其他 schema
} from "./admin.schema"; // 导入 schema（如果需要）

const adminRoutes: FastifyPluginCallback = async (fastify, options) => {
  // 需要鉴权的后台管理路由，应用 authenticate 钩子
  fastify.addHook("preHandler", authenticate);

  fastify.get("/dashboard", getDashboardHandler); // 访问后台首页/仪表盘
  fastify.get("/users", getUsersHandler); // 获取用户列表
  fastify.post("/users", { schema: createUserSchema }, createUserHandler); // 创建新用户
  fastify.put("/users/:id", { schema: updateUserSchema }, updateUserHandler); // 更新用户信息，需要用户 ID 参数
  fastify.delete("/users/:id", { schema: deleteUserSchema }, deleteUserHandler); // 删除用户，需要用户 ID 参数

  // 你可以添加更多需要鉴权的后台管理路由

  // 示例：不需要鉴权的后台管理路由（如果存在）
  // fastify.get('/public-info', async (request, reply) => {
  //   return { message: 'Public admin info' };
  // });
};

export default adminRoutes;
