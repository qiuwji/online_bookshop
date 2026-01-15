import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import Header from './component/Header/Header';
import Footer from './component/Footer/Footer';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/Register';
import SearchResultPage from './pages/Seach/SearchResultPage';
import BookDetailPage from './pages/BookDetail/BookDetailPage';
import CollectionsPage from './pages/Collections/CollectionsPage';
import ShoppingCartPage from './pages/ShoppingCart/ShoppingCartPage';
import CategoryPage from './pages/Category/CategoryPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* 使用 flex 容器包裹整个应用 */}
      <div className="min-h-screen flex flex-col">
        <Header />
        
        {/* 主要内容区域，使用 flex-grow 使其可以伸缩 */}
        <main className="grow">
          <div className="app-container">
            <Routes>
              {/* 首页 */}
              <Route path="/" element={<HomePage />} />
              
              {/* 登录 */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* 注册 */}
              <Route path="/register" element={<RegisterPage />} />
              
              {/* 搜索 */}
              <Route path="/search" element={<SearchResultPage />} />
              
              {/* 图书详情 - 这里有多种可能的路径设计 */}
              {/* 方案1：使用嵌套路由 */}
              {/* <Route path="/book/:bookId" element={<BookDetailPage />}>
                <Route index element={<BookDetail />} />
                <Route path="details" element={<BookDetailTabs />} />
              </Route> */}
              
              {/* 方案2：使用独立页面（更常见） */}
              {/* <Route path="/book/:bookId" element={<BookDetailPage />} />
              <Route path="/book/:bookId/details" element={<BookDetailTabs />} /> */}
              
              {/* 方案3：参数传递方式（推荐） */}
              <Route path="/book/:bookId" element={<BookDetailPage />} />
              
              {/* 收藏 */}
              <Route path="/collections" element={<CollectionsPage />} />
              
              {/* 购物车 */}
              <Route path="/cart" element={<ShoppingCartPage />} />

              <Route path="/category" element={<CategoryPage />} />
              
              {/* 404 页面 */}
              <Route path="*" element={<div className="text-center py-20">404 - 页面不存在</div>} />

              <Route path='/test' element={<BookDetailPage />} />
            </Routes>
          </div>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;