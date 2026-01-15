import React, { useEffect, useState } from 'react';
import BookCategoryGrid from "./component/BookCategoryGrid";
import Carousel from "./component/Carousel";
import type { BookCardProps } from '@/component/BookCard/BookCard';
import BookList from '@/component/BookCard/BookList';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getHotBooks, getNewBooks } from '@/services/bookService';

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
  const [hotBooks, setHotBooks] = useState<BookCardProps[]>([]);
  const [hotBooksLoading, setHotBooksLoading] = useState(true);
  const [hotBooksError, setHotBooksError] = useState<string | null>(null);

  // 新书上架图书数据
  const [newBooks, setNewBooks] = useState<BookCardProps[]>([]);
  const [newBooksLoading, setNewBooksLoading] = useState(true);
  const [newBooksError, setNewBooksError] = useState<string | null>(null);

  // 加载热门推荐和新书数据
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setHotBooksLoading(true);
        setNewBooksLoading(true);
        setHotBooksError(null);
        setNewBooksError(null);

        // 并行加载热门书籍和新书
        const [hotResponse, newResponse] = await Promise.all([
          getHotBooks(1, 8),
          getNewBooks(1, 8)
        ]);

        // 转换API响应格式为BookCardProps格式
        if (hotResponse) {
          setHotBooks(hotResponse.list.map(book => ({
            bookId: book.id,
            bookName: book.bookName,
            imageUrl: book.bookCover,
            author: book.author,
            price: book.price,
            discountPrice: book.price * book.discountRate,
            featureLabel: book.featureLabel,
            points: book.totalScore
          })));
        }

        if (newResponse) {
          setNewBooks(newResponse.list.map(book => ({
            bookId: book.id,
            bookName: book.bookName,
            imageUrl: book.bookCover,
            author: book.author,
            price: book.price,
            discountPrice: book.price * book.discountRate,
            featureLabel: book.featureLabel,
            points: book.totalScore
          })));
        }
      } catch (error) {
        console.error('加载图书数据失败:', error);
        setHotBooksError('加载热门推荐失败，请检查后端');
        setNewBooksError('加载新书上架失败，请检查后端');
      } finally {
        setHotBooksLoading(false);
        setNewBooksLoading(false);
      }
    };

    loadBooks();
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
            {/* <a 
              href="/hot-books" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm md:text-base font-medium transition-colors duration-200 hover:underline"
            >
              查看全部
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a> */}
          </div>
          
          {/* 热门推荐图书列表 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            {hotBooksLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : hotBooksError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-600 mb-2">{hotBooksError}</p>
                <p className="text-sm text-gray-600">后端地址: http://localhost:8080</p>
              </div>
            ) : hotBooks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>暂无热门推荐</p>
              </div>
            ) : (
              <BookList books={hotBooks} />
            )}
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
            {/* <a 
              href="/new-books" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm md:text-base font-medium transition-colors duration-200 hover:underline"
            >
              查看全部
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a> */}
          </div>
          
          {/* 新书上架图书列表 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            {newBooksLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : newBooksError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-600 mb-2">{newBooksError}</p>
                <p className="text-sm text-gray-600">后端地址: http://localhost:8080</p>
              </div>
            ) : newBooks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>暂无新书上架</p>
              </div>
            ) : (
              <BookList books={newBooks} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;