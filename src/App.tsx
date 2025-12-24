import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import Header from './component/Header/Header';
import Footer from './component/Footer/Footer';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/Register';
import SearchResultPage from './pages/Seach/SearchResultPage';
import BookDetail from './pages/BookDetail/component/BookDetail';

// const App: React.FC = () => {
//   return (
//     <BrowserRouter>
//       {/* 使用 flex 容器包裹整个应用 */}
//       <div className="min-h-screen flex flex-col">
//         <Header />
        
//         {/* 主要内容区域，使用 flex-grow 使其可以伸缩 */}
//         <main className="grow">
//           <div className="app-container">
//             <Routes>
//               <Route path="/" element={<HomePage />} />
//               <Route path="/login" element={<LoginPage />} />
//               <Route path="/register" element={<RegisterPage />} />
//               <Route path="/search" element={<SearchResultPage />} />
//             </Routes>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     </BrowserRouter>
//   );
// };

const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* 使用 flex 容器包裹整个应用 */}
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="grow">
        <BookDetail
          bookName='哈利波特与魔法石'
          book_cover="https://p11-doubao-search-sign.byteimg.com/labis/96aac3768e1e729547d8011ea30c527c~tplv-be4g95zd3a-image.jpeg?rk3s=542c0f93&x-expires=1781588701&x-signature=wV4yoF%2Fbo2FKsrb1MXQx85HtDpg%3D"
          author="J.K.罗琳"
          publisher="人民文学出版社"
          ISBN="9787020143736"
          price={68.00}
          discount_rate={0.66}
          comment_count={2345}
          total_score={2000 * 4 + 100 * 2 + 245 * 5} // 4.5 * 2345
          stock={32}
          publish_time="2018-10-01"
          category="奇幻文学"
        />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;