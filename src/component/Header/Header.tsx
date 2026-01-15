import { useCartCount, useIsLogin } from "@/store/useAuthStore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import BookStoreLogo from "../../assets/ONLINE-BOOKSTORE.jpeg";
import "font-awesome/css/font-awesome.min.css";

const Toast: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="fixed top-15 left-1/2 -translate-x-1/2 z-50
                    bg-black/80 text-white px-4 py-2 rounded-md text-sm">
      {message}
    </div>
  );
};

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = useIsLogin();
  const cartCount = useCartCount();
  const currentPath = location.pathname;

  const [searchText, setSearchText] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const isLoginOrRegisterPage =
    currentPath === "/login" || currentPath === "/register";

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2000);
  };

  const handleSearch = () => {
    const trimmed = searchText.trim();
    if (!trimmed) {
      showToast("搜索内容不能为空，请输入图书、作者或 ISBN");
      return;
    }
    console.log("搜索内容：", trimmed);
    // 跳转到搜索结果页面，并传递搜索关键词
    navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
  };

  return (
    <>
      {toastMsg && <Toast message={toastMsg} />}

      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">

          {/* ===== 第一行 ===== */}
          <div className="flex items-center justify-between py-4">

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src={BookStoreLogo} alt="线上书店logo" className="h-10 w-auto" />
              <h1 className="font-bold text-2xl ml-2">知书坊</h1>
            </Link>

            {/* 桌面搜索 */}
            {!isLoginOrRegisterPage && (
              <div className="hidden md:flex md:flex-1 md:mx-8 justify-center">
                <div className="flex w-full max-w-xl relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <i className="fa fa-search" />
                  </div>

                  <input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="搜索图书、作者或者 ISBN"
                    className="flex-1 px-10 py-2 border rounded-l-md focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    onClick={handleSearch}
                    className="px-6 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                  >
                    搜索
                  </button>
                </div>
              </div>
            )}

            {/* 桌面导航 */}
            <nav className="hidden md:flex items-center space-x-6">
              {!isLoginOrRegisterPage && (
                <Link to="/collections" className="text-neutral-600 hover:text-blue-500 flex gap-2">
                  <i className="fa fa-heart-o" />
                  我的收藏
                </Link>
              )}

              {isLogin ? (
                <span className="text-neutral-600 flex gap-2">
                  <i className="fa fa-user" />
                  欢迎回来
                </span>
              ) : (
                <>
                  <Link to="/login" className="text-neutral-600 hover:text-blue-500 flex gap-2">
                    <i className="fa fa-sign-in" />
                    登录
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex gap-2"
                  >
                    <i className="fa fa-user-plus" />
                    注册
                  </Link>
                </>
              )}

              {!isLoginOrRegisterPage && (
                <Link to="/cart" className="relative text-neutral-600 hover:text-blue-500">
                  <i className="fa fa-shopping-cart text-xl" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs
                                     w-5 h-5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}
            </nav>

            {/* 移动端 */}
            {!isLoginOrRegisterPage && (
              <div className="md:hidden flex items-center gap-3">
                <Link to="/cart" className="relative">
                  <i className="fa fa-shopping-cart text-xl" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs
                                     w-5 h-5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <button onClick={() => setIsMobileMenuOpen((s) => !s)}>
                  <i className="fa fa-bars text-xl" />
                </button>
              </div>
            )}
          </div>

          {/* 移动端搜索 */}
          {!isLoginOrRegisterPage && (
            <div className="md:hidden pb-4">
              <div className="flex relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <i className="fa fa-search" />
                </div>
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 px-10 py-2 border rounded-l-md"
                  placeholder="搜索图书、作者或者 ISBN"
                />
                <button
                  onClick={handleSearch}
                  className="px-6 bg-blue-500 text-white rounded-r-md"
                >
                  搜索
                </button>
              </div>
            </div>
          )}

          {/* 移动端菜单 */}
          {!isLoginOrRegisterPage && isMobileMenuOpen && (
            <div className="md:hidden bg-white shadow-md rounded-md mb-4">
              <nav className="flex flex-col gap-3 p-4">
                <Link to="/collections" className="flex gap-2">
                  <i className="fa fa-heart-o" />
                  我的收藏
                </Link>

                {isLogin ? (
                  <Link to="/profile" className="flex gap-2">
                    <i className="fa fa-user" />
                    个人中心
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="flex gap-2">
                      <i className="fa fa-sign-in" />
                      登录
                    </Link>
                    <Link
                      to="/register"
                      className="bg-blue-500 text-white text-center py-2 rounded-md flex justify-center gap-2"
                    >
                      <i className="fa fa-user-plus" />
                      注册
                    </Link>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
