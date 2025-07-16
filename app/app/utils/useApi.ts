// src/hooks/useApi.ts (可以创建一个新文件来存放)

import { useState, useCallback } from 'react';

// T 是一个泛型，代表我们期望从 API 返回的数据类型
export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 使用 useCallback 来避免不必要的函数重渲染
  const execute = useCallback(async (url: string, options: RequestInit) => {
    setLoading(true);
    setError(null); // 开始新请求时，清除旧的错误
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        // 如果服务器返回了错误状态码 (如 401, 500)
        throw new Error(`请求失败，状态码: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || '发生未知错误');
    } finally {
      setLoading(false);
    }
  }, []); // 空依赖数组意味着这个函数在组件的生命周期内不会改变

  return { data, loading, error, execute };
}