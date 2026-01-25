import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCollections, removeCollection } from '@/services/collectionService';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

interface CollectionItem {
  id: number;
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  bookCover?: string;
  collectTime: string;
}


const CollectionsPage = () => {

  useDocumentTitle("我的收藏");

  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('📚 请求收藏列表...');
      const res = await getCollections(1, 100);
      console.log('✅ 收藏列表响应:', res);

      if (res) {
        console.log(`📖 成功加载 ${res.list.length} 本收藏图书`);
        setCollections(res.list); // ✅ 直接用，不再 map
      } else {
        setCollections([]);
      }
    } catch (err) {
      console.error('❌ 加载收藏失败:', err);
      setError('加载收藏失败，请检查网络连接');
      setCollections([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // 取消收藏
  const handleCancelCollection = async (bookId: number) => {
    if (!window.confirm('确定要取消收藏这本书吗？')) return;

    try {
      const ok = await removeCollection(bookId);
      if (ok) {
        await load();
      } else {
        alert('取消收藏失败，请重试');
      }
    } catch {
      alert('取消收藏失败，请检查网络连接');
    }
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          <span className="ml-4 text-gray-600">正在加载收藏列表...</span>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={load}
          className="bg-blue-500 text-white px-6 py-2 rounded"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* 标题 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">我的收藏</h1>
          <p className="text-gray-500 mt-1">
            共 {collections.length} 本收藏图书
          </p>
        </div>

        {/* 列表 */}
        {collections.length > 0 ? (
          <div className="space-y-4">
            {collections.map(item => (
              <div
                key={item.bookId}
                className="bg-white rounded-lg shadow p-4 flex gap-6 items-center"
              >
                {/* 封面 */}
                <img
                  src={item.bookCover || 'https://via.placeholder.com/120x180'}
                  alt={item.bookAuthor}
                  className="w-24 h-36 object-cover rounded"
                />

                {/* 信息 */}
                <div className="flex-1">
                  <Link
                    to={`/book/${item.bookId}`}
                    className="text-lg font-semibold text-gray-800 hover:text-blue-600"
                  >
                    {item.bookTitle}
                  </Link>
                  <p className="text-gray-500 mt-1">作者：{item.bookAuthor}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    收藏时间：{item.collectTime}
                  </p>
                </div>

                {/* 操作 */}
                <div className="flex flex-col gap-2">
                  <Link
                    to={`/book/${item.bookId}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-center"
                  >
                    查看详情
                  </Link>
                  <button
                    onClick={() => handleCancelCollection(item.bookId)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  >
                    取消收藏
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="mb-4">暂无收藏图书</p>
            <Link
              to="/"
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded"
            >
              返回首页
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default CollectionsPage;
