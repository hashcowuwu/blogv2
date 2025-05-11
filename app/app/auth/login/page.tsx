import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

export default function Home() {
  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-96">
        <div className="text-center text-2xl font-semibold text-gray-800 mb-6">
          登陆
        </div>
        <div className="mb-4">
          <Input isRequired label="用户名" type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-6">
          <Input isRequired label="密码" type="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="flex items-center justify-between">
          <Button color="primary" type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            登录
          </Button>
          <a href="#" className="inline-block align-baseline font-semibold text-sm text-blue-500 hover:text-blue-800">
            忘记密码?
          </a>
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