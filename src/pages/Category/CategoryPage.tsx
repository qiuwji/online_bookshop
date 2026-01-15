import BookList from '@/component/BookCard/BookList';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBooksByCategory } from '@/services/bookService';
import type { BookCardProps } from '@/component/BookCard/BookCard';

const CategoryPage = () => {
  const [categories] = useState<Category[]>([
    {
      id: 1,
      name: '前端开发',
      icon: 'fa-code',
      description: 'HTML, CSS, JavaScript, React, Vue等前端技术',
      bookCount: 156
    },
    {
      id: 2,
      name: '后端开发',
      icon: 'fa-server',
      description: 'Java, Python, Node.js, Go等后端技术',
      bookCount: 203
    },
    {
      id: 3,
      name: '移动开发',
      icon: 'fa-mobile-alt',
      description: 'Android, iOS, React Native, Flutter',
      bookCount: 89
    },
    {
      id: 4,
      name: '数据库',
      icon: 'fa-database',
      description: 'MySQL, PostgreSQL, MongoDB, Redis',
      bookCount: 76
    },
    {
      id: 5,
      name: '人工智能',
      icon: 'fa-brain',
      description: '机器学习, 深度学习, 数据科学',
      bookCount: 134
    },
    {
      id: 6,
      name: '设计模式',
      icon: 'fa-puzzle-piece',
      description: '设计原则, 架构模式, 最佳实践',
      bookCount: 45
    },
    {
      id: 7,
      name: '测试运维',
      icon: 'fa-tools',
      description: '自动化测试, DevOps, 持续集成',
      bookCount: 67
    },
    {
      id: 8,
      name: '计算机基础',
      icon: 'fa-laptop-code',
      description: '算法, 数据结构, 操作系统, 网络',
      bookCount: 112
    },
    {
      id: 9,
      name: '产品设计',
      icon: 'fa-palette',
      description: '用户体验, 交互设计, 产品思维',
      bookCount: 58
    },
    {
      id: 10,
      name: '项目管理',
      icon: 'fa-project-diagram',
      description: '敏捷开发, Scrum, 团队协作',
      bookCount: 42
    }
  ]);

const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [books, setBooks] = useState<BookCardProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'rating' | 'date'>('default');
  const [searchTerm, setSearchTerm] = useState<string>('');

  interface Category {
    id: number;
    name: string;
    icon: string;
    description?: string;
    bookCount: number;
  }

  // 加载分类图书
  useEffect(() => {
    if (!selectedCategoryName) return;

    const loadBooks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getBooksByCategory(selectedCategoryName, 1, 20);
        
        if (response) {
          setBooks(response.list.map(book => ({
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
        console.error('加载分类图书失败:', error);
        setError('加载图书失败，请检查后端是否启动');
        setBooks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, [selectedCategoryName]);

  // 处理分类选择
  const handleCategorySelect = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setSelectedCategoryName(null);
    } else {
      setSelectedCategory(categoryId);
      setSelectedCategoryName(category?.name || null);
    }
  };

  // 获取当前分类名称
  const getSelectedCategoryName = () => {
    if (!selectedCategory) return '全部';
    return categories.find(c => c.id === selectedCategory)?.name || '';
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error && selectedCategoryName) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md text-center">
            <i className="fa fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
            <h3 className="text-xl font-semibold text-red-700 mb-2">加载失败</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-sm text-gray-600 mb-4">
              请确保后端服务运行在 <code className="bg-gray-200 px-2 py-1 rounded">http://localhost:8080</code>
            </p>
            <button
              onClick={() => {
                setError(null);
                setSelectedCategoryName(null);
                setSelectedCategory(null);
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              返回
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 将Book转换为BookCardProps

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedCategoryName(null);
    setSearchTerm('');
    setSortBy('default');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题和面包屑 */}
      <div className="mb-8">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link to="/" className="hover:text-blue-500">首页</Link>
          <i className="fa fa-chevron-right mx-2 text-xs"></i>
          <span className="text-blue-500">图书分类</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          <i className="fa fa-th-large mr-3 text-blue-500"></i>图书分类
        </h1>
        <p className="text-gray-600">探索各类技术图书，找到适合你的学习资源</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 左侧分类导航 */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">全部分类</h2>
              <span className="text-sm text-blue-500 bg-blue-50 px-2 py-1 rounded">
                {categories.length} 个分类
              </span>
            </div>

            {/* 分类列表 */}
            <div className="space-y-2">
              {/* 全部分类选项 */}
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left p-3 rounded-md transition-colors ${
                  selectedCategory === null
                    ? 'bg-blue-50 border border-blue-200 text-blue-600'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <i className={`fa fa-th-list mr-3 text-lg ${selectedCategory === null ? 'text-blue-500' : 'text-gray-400'}`}></i>
                    <span className="font-medium">全部图书</span>
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {books.length}
                  </span>
                </div>
              </button>

              {/* 具体分类 */}
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`w-full text-left p-3 rounded-md transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-50 border border-blue-200 text-blue-600'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <i className={`fa ${category.icon} mr-3 text-lg ${selectedCategory === category.id ? 'text-blue-500' : 'text-gray-400'}`}></i>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {selectedCategory === category.id ? books.length : category.bookCount}
                    </span>
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-500 mt-1 ml-8">{category.description}</p>
                  )}
                </button>
              ))}
            </div>

            {/* 筛选统计 */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <p className="mb-1">当前筛选：</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCategory !== null && (
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
                      {getSelectedCategoryName()}
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="ml-1 text-blue-400 hover:text-blue-600"
                      >
                        <i className="fa fa-times"></i>
                      </button>
                    </span>
                  )}
                  {searchTerm && (
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
                      搜索: {searchTerm}
                      <button
                        onClick={() => setSearchTerm('')}
                        className="ml-1 text-green-400 hover:text-green-600"
                      >
                        <i className="fa fa-times"></i>
                      </button>
                    </span>
                  )}
                  {sortBy !== 'default' && (
                    <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs">
                      排序: {{
                        'price_asc': '价格从低到高',
                        'price_desc': '价格从高到低',
                        'rating': '评分最高',
                        'date': '最新出版'
                      }[sortBy]}
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <p>找到 <span className="font-bold text-blue-500">{books.length}</span> 本图书</p>
                </div>
                {(selectedCategory !== null || searchTerm || sortBy !== 'default') && (
                  <button
                    onClick={clearFilters}
                    className="mt-3 text-sm text-red-500 hover:text-red-700 flex items-center"
                  >
                    <i className="fa fa-times mr-1"></i> 清空所有筛选
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 右侧书籍列表 */}
        <div className="lg:w-3/4">
          {/* 筛选工具栏 */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* 搜索框 */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索图书标题或作者..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <i className="fa fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>

              {/* 排序选项 */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 whitespace-nowrap">排序：</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="default">默认排序</option>
                  <option value="price_asc">价格从低到高</option>
                  <option value="price_desc">价格从高到低</option>
                  <option value="rating">评分最高</option>
                  <option value="date">最新出版</option>
                </select>
              </div>
            </div>
          </div>

          {/* 分类标题 */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {selectedCategory ? getSelectedCategoryName() : '全部图书'}
              <span className="text-blue-500 ml-2">({books.length})</span>
            </h2>
            {selectedCategory && (
              <p className="text-gray-600">
                {categories.find(c => c.id === selectedCategory)?.description}
              </p>
            )}
          </div>

          {/* 书籍列表 - 使用BookList组件 */}
          {books.length > 0 ? (
            <>
              <BookList books={books} />
              
              {/* 分页 */}
              <div className="mt-8 flex justify-center">
                <nav className="inline-flex rounded-md shadow">
                  <button className="py-2 px-4 bg-white border border-gray-300 rounded-l-md text-gray-500 hover:bg-gray-50">
                    <i className="fa fa-angle-left"></i>
                  </button>
                  <button className="py-2 px-4 bg-blue-600 text-white border border-blue-600">1</button>
                  <button className="py-2 px-4 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                    2
                  </button>
                  <button className="py-2 px-4 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                    3
                  </button>
                  <span className="py-2 px-4 bg-white border border-gray-300 text-gray-700">...</span>
                  <button className="py-2 px-4 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                    10
                  </button>
                  <button className="py-2 px-4 bg-white border border-gray-300 rounded-r-md text-gray-700 hover:bg-gray-50">
                    <i className="fa fa-angle-right"></i>
                  </button>
                </nav>
              </div>
            </>
          ) : (
            /* 无搜索结果 */
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <i className="fa fa-search text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">没有找到相关图书</h3>
              <p className="text-gray-500 mb-6">尝试调整筛选条件或搜索关键词</p>
              <button
                onClick={clearFilters}
                className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors flex items-center mx-auto"
              >
                <i className="fa fa-redo mr-2"></i> 显示全部图书
              </button>
            </div>
          )}

          {/* 热门分类推荐 */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              <i className="fa fa-fire text-red-500 mr-2"></i>热门分类
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {categories
                .filter(category => selectedCategory === category.id || category.bookCount > 0)
                .sort((a, b) => b.bookCount - a.bookCount)
                .slice(0, 5)
                .map((category) => (
                  <Link
                    key={category.id}
                    to={`#`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleCategorySelect(category.id);
                    }}
                    className="text-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors block"
                  >
                    <i className={`fa ${category.icon} text-2xl text-blue-500 mb-2`}></i>
                    <p className="font-medium text-gray-800">{category.name}</p>
                    <p className="text-sm text-gray-500">
                      {selectedCategory === category.id ? books.length : category.bookCount} 本图书
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;