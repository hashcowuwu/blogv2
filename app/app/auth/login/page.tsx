"use client";
import React, { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

//定义登陆响应接口

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

//定义登陆错误接口
interface LoginError {
  message?: string;
}
export default function Home() {
  // 定义状态
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const handleLogin = async () => {
    setLoading(true);

    setError("");
    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData: LoginError = await response.json();
        setError(errorData.message || "登录失败，请重试");
        setLoading(false);
        return;
      }

      const data: LoginResponse = await response.json();
      console.log("登录成功", data);
      // 在这里可以存储 token 或者进行其他操作
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      // 重定向到首页
      window.location.href = "/dashboard";
      setLoading(false);
    } catch (error) {
      setError("网络错误，请稍后再试");
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-96">
        <div className="text-center text-2xl font-semibold text-gray-800 mb-6">
          登陆
        </div>
        <div className="mb-4">
          <Input isRequired value={username} onValueChange={setUsername} label="用户名" type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-6">
          <Input isRequired value={password} onValueChange={setPassword} label="密码" type="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="flex items-center justify-between">
          <Button isLoading={loading} onPress={handleLogin} color="primary" type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            登录
          </Button>
          <a href="/auth/register" className="inline-block align-baseline font-semibold text-sm text-blue-500 hover:text-blue-800">
            忘记密码?
          </a>
        </div>
         <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        <hr className="my-6 border-t" />
        <div className="text-center">
          <a href="/auth/register" className="inline-block align-baseline font-semibold text-sm text-gray-600 hover:text-gray-800">
            注册新账号
          </a>
        </div>
      </div>
    </div>
  );
}
