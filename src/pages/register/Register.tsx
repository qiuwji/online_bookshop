import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import 'font-awesome/css/font-awesome.min.css';
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from 'react-router-dom';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function RegisterPage() {

  useDocumentTitle('注册');

  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    
    // 验证密码是否匹配
    if (formData.password !== formData.confirmPassword) {
      alert("两次输入的密码不一致");
      return;
    }

    console.log('点击注册按钮', formData);
    // 这里可以添加实际的注册API调用
  };

  const toLogin = () => {
    navigate("/login");
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
      {/* 注册卡片 */}
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
            创建账户
          </h2>
          <p className="text-gray-500 text-center mb-6">
            加入我们，开始您的购物之旅
          </p>

          <form onSubmit={handleSubmit} className="mb-6">
            {/* 用户名 */}
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm text-gray-700 mb-1"
              >
                用户名
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
                  placeholder="请输入用户名"
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

            {/* 邮箱 */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm text-gray-700 mb-1"
              >
                邮箱
              </label>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <i className="fa fa-envelope" />
                </div>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="请输入邮箱"
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
            <div className="mb-4">
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

            {/* 确认密码 */}
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm text-gray-700 mb-1"
              >
                确认密码
              </label>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <i className="fa fa-lock" />
                </div>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="请再次输入密码"
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
              注册
            </button>
          </form>
        </div>

        {/* 底部登录 */}
        <div className="bg-gray-50 py-4 px-6 text-center">
          <span>已有账户？</span>
          <span
            className="text-blue-500 cursor-pointer ml-1"
            onClick={toLogin}
          >
            立即登录
          </span>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;