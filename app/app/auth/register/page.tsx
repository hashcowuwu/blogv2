"use client";
import React, { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
interface RegisterResponse {
  username: string;
  email: string;
  id: number;
  created_at: string;
  updated_at: string;
}

interface RegisterError {
  message?: string;
}

export default function Register() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      if (!response.ok) {
        const errorData: RegisterError = await response.json();
        setError(errorData.message || "注册失败，请重试");
        setLoading(false);
        return;
      }
      const data: RegisterResponse = await response.json();
      console.log("注册成功", data);
    } catch (error) {
      setError("网络错误，请稍后再试");
    }
    setLoading(false);
  };
  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-96">
        <div className="text-center text-2xl font-semibold text-gray-800 mb-6">
          注册
        </div>
        <div className="mb-4">
          <Input isRequired value={username} label="用户名" type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <Input isRequired value={email} label="邮箱" type="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <Input isRequired label="密码" value={password} type="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-6">
          <Input isRequired label="确认密码" value={confirmPassword} type="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="flex items-center justify-center">
          <Button color="primary" type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            注册
          </Button>
        </div>
        <hr className="my-6 border-t" />
        <div className="text-center">
          <a href="/auth/login" className="inline-block align-baseline font-semibold text-sm text-gray-600 hover:text-gray-800">
            已有账号？去登录
          </a>
        </div>
      </div>
    </div>
  );
}