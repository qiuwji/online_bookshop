import React, { useEffect, useState } from 'react';
import BookOverview from './component/BookOverview';
import BookDetailTabs from './component/BookDetailTabs';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookDetail } from '@/services/bookService';

/**
 * 这里的接口定义要和 api.ts 中 toCamelCase 处理后的字段一致
 */
interface BookDetail {
  id: number;
  bookName: string;
  bookCover: string;
  author: string;
  publisher: string;
  isbn: string;
  price: number;
  discountRate: number;
  commentCount: number;
  totalScore: number;
  stock: number;
  publishTime: string;
  category: string;
  isFavorited: boolean;
  description?: string; // 后端返回了，可以加上
}

interface BookDetailPageProps {
  bookId?: number;
}

const BookDetailPage: React.FC<BookDetailPageProps> = ({ bookId }) => {
  const params = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  
  // 获取实际的图书ID
  const actualBookId = bookId || (params?.bookId ? parseInt(params.bookId, 10) : null);
  
  // 状态管理
  const [bookData, setBookData] = useState<BookDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 加载数据的函数
  const fetchBookDetail = async () => {
    if (!actualBookId || isNaN(actualBookId)) {
      setError('无效的图书ID');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`🚀 请求图书ID: ${actualBookId}`);
      
      /**
       * ⚠️ 重要：根据你的 api.ts 逻辑：
       * 1. 拦截器已将下划线转为驼峰 (book_name -> bookName)
       * 2. request 函数已经返回了 response.data (即 data.data 部分)
       * 所以这里的 res 直接就是 BookDetail 对象
       */
      const res = await getBookDetail(actualBookId);
      
      console.log('✅ API 返回并自动转换后的数据:', res);

      if (res) {
        // 由于 api.ts 里的 toCamelCase 已经把所有 key 转成了驼峰
        // 我们只需要直接存入 state 即可
        setBookData(res as unknown as BookDetail);
      } else {
        throw new Error('未获取到图书详情内容');
      }
    } catch (err: any) {
      console.error('❌ 获取图书详情失败:', err);
      // 捕获 api.ts 中 reject 抛出的 ApiError
      setError(err.message || '网络请求失败，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookDetail();
  }, [actualBookId]);

  // --- 以下渲染逻辑保持原样，确保样式不改动 ---

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">正在加载图书详情...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error && !bookData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-12">
          <div className="container mx-auto px-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto text-center">
              <div className="text-4xl text-red-500 mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-red-700 mb-2">加载失败</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <div className="space-y-3">
                <button onClick={fetchBookDetail} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                  重新加载
                </button>
                <button onClick={() => navigate('/')} className="ml-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors">
                  返回首页
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 无数据状态
  if (!bookData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-4xl text-yellow-500 mb-4">📚</div>
              <h3 className="text-xl font-semibold text-yellow-700 mb-2">未找到图书</h3>
              <button onClick={() => navigate('/')} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                返回首页
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 正常渲染 - 严格对应 BookOverview 的 props 命名
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-6 space-y-6">
        <BookOverview
          bookName={bookData.bookName}
          book_cover={bookData.bookCover}
          author={bookData.author}
          publisher={bookData.publisher}
          ISBN={bookData.isbn}
          price={bookData.price}
          discount_rate={bookData.discountRate}
          comment_count={bookData.commentCount}
          total_score={bookData.totalScore}
          stock={bookData.stock}
          publish_time={bookData.publishTime}
          category={bookData.category}
          isFavorited={bookData.isFavorited}
          bookId={bookData.id}
        />

        <BookDetailTabs bookId={bookData.id} />
      </div>
    </div>
  );
};

export default BookDetailPage;