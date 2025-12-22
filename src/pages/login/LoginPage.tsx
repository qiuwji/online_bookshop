import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import 'font-awesome/css/font-awesome.min.css';
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from 'react-router-dom';

interface LoginFormData {
  username: string;
  password: string;
}

function LoginPage() {

  useDocumentTitle('登录');

  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('点击登录按钮', formData);
  };

  const toRegister = () => {
    navigate("/register");
  };

  return (
    <div
      className="
        min-h-screen
        flex items-center justify-center
        bg-gray-100
        overflow-x-hidden
      "
    >
      {/* 登录卡片 */}
      <div
        className="
          w-full
          max-w-sm
          bg-white
          rounded-lg
          shadow-md
          overflow-hidden
        "
      >
        {/* 上半部分 */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-2">
            欢迎回来
          </h2>
          <p className="text-gray-500 text-center mb-6">
            登录您的账户以继续购物
          </p>

          <form onSubmit={handleSubmit} className="mb-6">
            {/* 用户名 */}
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm text-gray-700 mb-1"
              >
                用户名或邮箱
              </label>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <i className="fa fa-user" />
                </div>

                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="请输入账号或邮箱"
                  className="
                    w-full
                    pl-10 pr-3 py-2
                    border border-gray-300
                    rounded-md
                    focus:outline-none
                    focus:ring-2 focus:ring-blue-500
                  "
                />
              </div>
            </div>

            {/* 密码 */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm text-gray-700 mb-1"
              >
                密码
              </label>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <i className="fa fa-lock" />
                </div>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="请输入密码"
                  className="
                    w-full
                    pl-10 pr-3 py-2
                    border border-gray-300
                    rounded-md
                    focus:outline-none
                    focus:ring-2 focus:ring-blue-500
                  "
                />
              </div>
            </div>

            <button
              type="submit"
              className="
                w-full
                bg-blue-500
                text-white
                py-2
                rounded-md
                hover:bg-blue-600
                transition-colors
              "
            >
              登录
            </button>
          </form>
        </div>

        {/* 底部注册 */}
        <div className="bg-gray-50 py-4 px-6 text-center">
          <span>还没有账户？</span>
          <span
            className="text-blue-500 cursor-pointer ml-1"
            onClick={toRegister}
          >
            立即注册
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
