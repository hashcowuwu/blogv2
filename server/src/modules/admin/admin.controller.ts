// src/modules/admin/admin.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { AdminService } from "./admin.service";

const adminService = new AdminService();

export const getUsersHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const users = await adminService.getAllUsers();
    reply.send(users);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    reply
      .status(500)
      .send({ message: error.message || "Failed to fetch users" });
  }
};

export const createUserHandler = async (
  request: FastifyRequest<{
    Body: { username: string; email: string; password?: string; role?: string };
  }>,
  reply: FastifyReply,
) => {
  try {
    // **重要**: 在这里你需要对用户的密码进行哈希处理
    const password_hash = "hashed_password_placeholder"; // 实际应用中需要使用 bcrypt 或 Argon2 等库进行哈希
    const userData = { ...request.body, password_hash };
    const newUser = await adminService.createUser(userData);
    reply.status(201).send(newUser);
  } catch (error: any) {
    console.error("Error creating user:", error);
    reply
      .status(500)
      .send({ message: error.message || "Failed to create user" });
  }
};

export const updateUserHandler = async (
  request: FastifyRequest<{
    Params: { id: string };
    Body: {
      username?: string;
      email?: string;
      password?: string;
      role?: string;
    };
  }>,
  reply: FastifyReply,
) => {
  try {
    const { id } = request.params;
    // **注意**: 如果请求中包含新密码，你需要在这里对其进行哈希处理
    const userData = request.body;
    const updatedUser = await adminService.updateUser(parseInt(id), userData);
    if (updatedUser) {
      reply.send(updatedUser);
    } else {
      reply.status(404).send({ message: "User not found" });
    }
  } catch (error: any) {
    console.error("Error updating user:", error);
    reply
      .status(500)
      .send({ message: error.message || "Failed to update user" });
  }
};

export const deleteUserHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  try {
    const { id } = request.params;
    const success = await adminService.deleteUser(parseInt(id));
    if (success) {
      reply.status(204).send();
    } else {
      reply.status(404).send({ message: "User not found" });
    }
  } catch (error: any) {
    console.error("Error deleting user:", error);
    reply
      .status(500)
      .send({ message: error.message || "Failed to delete user" });
  }
};

export const getDashboardHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    // 你的仪表盘逻辑
    const dashboardData = { message: "Admin Dashboard" };
    reply.send(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    reply.status(500).send({ message: "Failed to fetch dashboard data" });
  }
};

// ... 其他控制器处理函数
