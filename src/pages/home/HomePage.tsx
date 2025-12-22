import React, { useEffect, useState } from 'react';
import BookCategoryGrid from "./component/BookCategoryGrid";
import Carousel from "./component/Carousel";
import type { BookCardProps } from '@/component/BookCard/BookCard';
import BookList from '@/component/BookCard/BookList';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const HomePage: React.FC = () => {

  useDocumentTitle("首页");

  const carouselImages = [
    {
      imgUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=600&q=80",
      onClick: () => {
        console.log("点击了春季图书大促");
        window.location.href = "/promotion1";
      },
      alt: "春季图书大促"
    },
    {
      imgUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=600&q=80",
      onClick: () => {
        console.log("点击了新书推荐");
        window.location.href = "/promotion2";
      },
      alt: "新书推荐"
    },
    {
      imgUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=600&q=80",
      onClick: () => {
        console.log("点击了经典文学");
        window.location.href = "/promotion3";
      },
      alt: "经典文学特辑"
    },
    {
      imgUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=600&q=80",
      onClick: () => {
        console.log("点击了学习资料");
        window.location.href = "/promotion4";
      },
      alt: "学习资料专区"
    }
  ];

  // 热门推荐图书数据
  const [hotBooks, setHotBooks] = useState<BookCardProps[]>([
    {
      bookId: 1,
      bookName: "JavaScript高级程序设计（第4版）",
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
      author: "马特·弗里斯比",
      price: 129,
      discountPrice: 99,
      featureLabel: "畅销",
      points: 4.8
    },
    {
      bookId: 2,
      bookName: "React设计原理",
      imageUrl: "https://images.unsplash.com/photo-1531346688376-ab6275c4725e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
      author: "卡西迪·威廉姆斯",
      price: 88,
      featureLabel: "新品",
      points: 4.5
    },
    {
      bookId: 3,
      bookName: "TypeScript入门到精通",
      imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
      author: "鲍里斯·切尼",
      price: 77,
      discountPrice: 59,
      points: 4.9
    },
    {
      bookId: 4,
      bookName: "Python数据分析实战",
      imageUrl: "https://images.unsplash.com/photo-1544716278-e513176f20b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
      author: "韦斯·麦金尼",
      price: 95,
      points: 4.7
    },
    {
      bookId: 5,
      bookName: "前端工程化实践",
      imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
      author: "尼古拉斯·扎卡斯",
      price: 120,
      discountPrice: 89,
      featureLabel: "限时特惠",
      points: 4.6
    },
    {
      bookId: 6,
      bookName: "Vue.js设计与实现",
      imageUrl: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
      author: "埃文·尤",
      price: 85,
      points: 4.8
    },
    {
      bookId: 7,
      bookName: "Node.js实战指南",
      imageUrl: "https://images.unsplash.com/photo-1553729784-e91953dec042?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
      author: "亚历克斯·杨",
      price: 92,
      discountPrice: 68,
      featureLabel: "推荐",
      points: 4.4
    },
    {
      bookId: 8,
      bookName: "算法图解",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
      author: "阿迪蒂亚·巴格吉",
      price: 66,
      points: 4.2
    }
  ]);

  // 新书上架图书数据
  const [newBooks, setNewBooks] = useState<BookCardProps[]>([
    {
      bookId: 9,
      bookName: "现代前端技术解析",
      imageUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
      author: "张鑫旭",
      price: 129,
      discountPrice: 99,
      featureLabel: "新品首发",
      points: 4.9
    },
    {
      bookId: 10,
      bookName: "Web性能优化实战",
      imageUrl: "https://images.unsplash.com/photo-1534665482403-a909d0d97c67?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
      author: "史蒂夫·桑德斯",
      price: 88,
      featureLabel: "独家",
      points: 4.7
    },
    {
      bookId: 11,
      bookName: "微前端架构与实践",
      imageUrl: "https://images.unsplash.com/photo-1542736667-069246bdbc6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
      author: "迈克尔·盖斯",
      price: 75,
      discountPrice: 59,
      points: 4.5
    },
    {
      bookId: 12,
      bookName: "Serverless架构",
      imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
      author: "彼得·桑巴思",
      price: 99,
      points: 4.8
    },
    {
      bookId: 13,
      bookName: "深入浅出WebAssembly",
      imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
      author: "林德尔·布朗",
      price: 199,
      discountPrice: 159,
      featureLabel: "典藏版",
      points: 5.0
    },
    {
      bookId: 14,
      bookName: "CSS揭秘",
      imageUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
      author: "莉·维杜姆",
      price: 65,
      points: 4.3
    },
    {
      bookId: 15,
      bookName: "前端架构设计",
      imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
      author: "迈克尔·米克劳",
      price: 79,
      discountPrice: 69,
      featureLabel: "畅销",
      points: 4.6
    },
    {
      bookId: 16,
      bookName: "移动端Web开发",
      imageUrl: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
      author: "马克西米利安·施瓦茨米勒",
      price: 49,
      points: 4.1
    }
  ]);

  // 模拟API请求
  useEffect(() => {
    // 这里可以替换为实际的API调用
    // fetchHotBooks().then(data => setHotBooks(data));
    // fetchNewBooks().then(data => setNewBooks(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 主容器 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 轮播图部分 - 优化高度和比例 */}
        <div className="mb-10">
          <div className="carousel-wrapper rounded-xl overflow-hidden shadow-xl">
            <Carousel
              images={carouselImages}
              autoplay={true}
              autoplayInterval={4000}
              showIndicators={true}
              showArrows={true}
              infinite={true}
              initialIndex={0}
              onChange={(index) => {
                console.log("轮播切换到了第", index + 1, "张");
              }}
            />
          </div>
        </div>

        {/* 图书分类网格 */}
        <div className="mb-12">
          <BookCategoryGrid />
        </div>

        {/* 热门推荐部分 */}
        <div className="mb-12">
          {/* 标题 */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-red-500 rounded"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                热门推荐
              </h2>
            </div>
            <a 
              href="/hot-books" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm md:text-base font-medium transition-colors duration-200 hover:underline"
            >
              查看全部
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          
          {/* 热门推荐图书列表 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <BookList books={hotBooks} />
          </div>
        </div>

        {/* 新书上架部分 */}
        <div className="mb-12">
          {/* 标题 */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-blue-500 rounded"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                新书上架
              </h2>
            </div>
            <a 
              href="/new-books" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm md:text-base font-medium transition-colors duration-200 hover:underline"
            >
              查看全部
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          
          {/* 新书上架图书列表 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <BookList books={newBooks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;