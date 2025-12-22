import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import Header from './component/Header/Header';
import Footer from './component/Footer/Footer';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/register/Register';

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
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;