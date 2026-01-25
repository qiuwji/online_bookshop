import BookList from '@/component/BookCard/BookList';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getBooksByCategory, searchBooks } from '@/services/bookService';
import type { BookCardProps } from '@/component/BookCard/BookCard';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const CategoryPage = () => {
  useDocumentTitle("图书分类");
  
  const navigate = useNavigate();

  // 使用6种新分类
  const [categories] = useState<Category[]>([
    {
      id: 1,
      name: '文学',
      icon: 'fa-book',
      description: '小说、散文、诗歌等文学作品',
      bookCount: 156
    },
    {
      id: 2,
      name: '历史',
      icon: 'fa-history',
      description: '历史传记、文化研究、史学研究',
      bookCount: 89
    },
    {
      id: 3,
      name: '科学',
      icon: 'fa-flask',
      description: '自然科学、技术科学、科普读物',
      bookCount: 134
    },
    {
      id: 4,
      name: '艺术',
      icon: 'fa-paint-brush',
      description: '绘画、音乐、设计、摄影等艺术类书籍',
      bookCount: 76
    },
    {
      id: 5,
      name: '商业',
      icon: 'fa-briefcase',
      description: '经济管理、市场营销、投资理财',
      bookCount: 112
    },
    {
      id: 6,
      name: '教育',
      icon: 'fa-graduation-cap',
      description: '教材教辅、教育理论、学习方法',
      bookCount: 67
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [books, setBooks] = useState<BookCardProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'rating' | 'date'>('default');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [size] = useState<number>(8);
  
  // 防抖计时器引用
  const debounceTimerRef = useRef<number | null>(null);
  
  interface Category {
    id: number;
    name: string;
    icon: string;
    description?: string;
    bookCount: number;
  }

  // 获取排序参数
  const getSortParam = useCallback(() => {
    switch (sortBy) {
      case 'price_asc': return 'price_asc';
      case 'price_desc': return 'price_desc';
      case 'rating': return 'score_desc';
      case 'date': return 'new';
      default: return '';
    }
  }, [sortBy]);

  // 处理搜索输入变化的防抖函数
  const handleSearchInputChange = useCallback((value: string) => {
    setSearchTerm(value);
    
    // 清除之前的计时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // 设置新的防抖计时器（500毫秒后触发搜索）
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(value);
      setPage(1); // 搜索时重置到第一页
    }, 500);
  }, []);

  // 清理防抖计时器
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // 加载分类图书
  const loadBooks = useCallback(async () => {
    if (!selectedCategoryName) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const params: any = {
        page,
        size,
        sort: getSortParam()
      };
      
      let response;
      
      // 如果有搜索词，使用searchBooks
      if (debouncedSearchTerm.trim()) {
        params.keyword = debouncedSearchTerm.trim();
        params.category = selectedCategoryName;
        response = await searchBooks(params);
      } else {
        // 否则使用分类查询
        response = await getBooksByCategory(selectedCategoryName, page, size);
        // 如果需要排序，可以在这里处理
        if (sortBy !== 'default') {
          const sortedResponse = await searchBooks({
            category: selectedCategoryName,
            page,
            size,
            sort: getSortParam()
          });
          if (sortedResponse) response = sortedResponse;
        }
      }
      
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
        setTotal(response.total);
      }
    } catch (error) {
      console.error('加载分类图书失败:', error);
      setError('加载图书失败，请检查后端是否启动');
      setBooks([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategoryName, page, size, sortBy, debouncedSearchTerm, getSortParam]);

  // 当debouncedSearchTerm或page变化时加载图书
  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // 处理分类选择
  const handleCategorySelect = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setSelectedCategoryName(null);
      setBooks([]);
      setTotal(0);
      setPage(1);
    } else {
      setSelectedCategory(categoryId);
      setSelectedCategoryName(category?.name || null);
      setPage(1); // 重置到第一页
    }
    setSearchTerm(''); // 清空搜索词
    setDebouncedSearchTerm(''); // 清空防抖后的搜索词
  };

  // 处理搜索表单提交（手动点击搜索按钮）
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setDebouncedSearchTerm(searchTerm);
    setPage(1); // 搜索时重置到第一页
  };

  // 获取当前分类名称
  const getSelectedCategoryName = () => {
    if (!selectedCategory) return '全部';
    return categories.find(c => c.id === selectedCategory)?.name || '';
  };

  // 处理分页
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > Math.ceil(total / size)) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 生成页码数组
  const generatePageNumbers = () => {
    const totalPages = Math.ceil(total / size);
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, page - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    
    return pages;
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedCategoryName(null);
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSortBy('default');
    setPage(1);
    setBooks([]);
    setTotal(0);
  };

  // 加载状态
  if (isLoading && books.length === 0) {
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
              onClick={clearFilters}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              返回
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        <p className="text-gray-600">探索各类图书，找到适合你的阅读资源</p>
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
                <div className="flex items-center">
                  <i className={`fa fa-th-list mr-3 text-lg ${selectedCategory === null ? 'text-blue-500' : 'text-gray-400'}`}></i>
                  <span className="font-medium">全部图书</span>
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
                  <div className="flex items-center">
                    <i className={`fa ${category.icon} mr-3 text-lg ${selectedCategory === category.id ? 'text-blue-500' : 'text-gray-400'}`}></i>
                    <span className="font-medium">{category.name}</span>
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
                  {debouncedSearchTerm && (
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
                      搜索: {debouncedSearchTerm}
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setDebouncedSearchTerm('');
                        }}
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
                      <button
                        onClick={() => setSortBy('default')}
                        className="ml-1 text-purple-400 hover:text-purple-600"
                      >
                        <i className="fa fa-times"></i>
                      </button>
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <p>找到 <span className="font-bold text-blue-500">{total}</span> 本图书</p>
                  {total > 0 && (
                    <p className="text-xs text-gray-500">第 {page} 页，共 {Math.ceil(total / size)} 页</p>
                  )}
                </div>
                {(selectedCategory !== null || debouncedSearchTerm || sortBy !== 'default') && (
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
              <form onSubmit={handleSearch} className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  placeholder={`在${selectedCategory ? getSelectedCategoryName() : '全部'}分类中搜索...`}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!selectedCategory}
                />
                <i className="fa fa-search absolute left-3 top-3 text-gray-400"></i>
                {selectedCategory && (
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm"
                  >
                    搜索
                  </button>
                )}
              </form>

              {/* 排序选项 */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 whitespace-nowrap">排序：</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!selectedCategory}
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
              {selectedCategory ? getSelectedCategoryName() : '请选择分类'}
              {selectedCategory && (
                <span className="text-blue-500 ml-2">({total})</span>
              )}
            </h2>
            {selectedCategory && (
              <p className="text-gray-600">
                {categories.find(c => c.id === selectedCategory)?.description}
              </p>
            )}
            {!selectedCategory && (
              <p className="text-gray-600">请从左侧选择一个分类查看相关图书</p>
            )}
          </div>

          {/* 书籍列表 - 使用BookList组件 */}
          {selectedCategory && books.length > 0 ? (
            <>
              <BookList books={books} />
              
              {/* 分页 */}
              {Math.ceil(total / size) > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="inline-flex rounded-md shadow">
                    {/* 上一页按钮 */}
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                      className={`py-2 px-4 border border-gray-300 rounded-l-md ${
                        page <= 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <i className="fa fa-angle-left"></i>
                    </button>
                    
                    {/* 页码按钮 */}
                    {generatePageNumbers().map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`py-2 px-4 border border-gray-300 ${
                          page === pageNum
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    
                    {/* 下一页按钮 */}
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= Math.ceil(total / size)}
                      className={`py-2 px-4 border border-gray-300 rounded-r-md ${
                        page >= Math.ceil(total / size)
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <i className="fa fa-angle-right"></i>
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : selectedCategory ? (
            /* 无搜索结果 */
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <i className="fa fa-search text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {debouncedSearchTerm ? `没有找到"${debouncedSearchTerm}"相关的图书` : '该分类暂无图书'}
              </h3>
              <p className="text-gray-500 mb-6">尝试调整搜索关键词或选择其他分类</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setDebouncedSearchTerm('');
                  }}
                  className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md transition-colors flex items-center"
                >
                  <i className="fa fa-times mr-2"></i> 清空搜索
                </button>
                <button
                  onClick={() => navigate('/search')}
                  className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors flex items-center"
                >
                  <i className="fa fa-search mr-2"></i> 高级搜索
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;