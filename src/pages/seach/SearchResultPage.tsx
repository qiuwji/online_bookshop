import type { BookCardProps } from "@/component/BookCard/BookCard";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TabBar from "./component/TabBar";
import FilterBar from "./component/FilterBar";
import BookList from "@/component/BookCard/BookList";
import { searchBooks } from '@/services/bookService';

/** ===== 分类数据 ===== */
const categorys = ["文学小说", "奇幻", "儿童文学", "教育", "传记"];

export interface CategoryItem {
  category: string;
  count: number;
}

/** ===== Mock 分类统计 ===== */
const categoryItems: CategoryItem[] = categorys.map((c, index) => ({
  category: c,
  count: 5 - index,
}));

/** ===== 每页显示数量（2 行 × 4 列） ===== */
const PAGE_SIZE = 8;

/** ================= 页面组件 ================= */
const SearchResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';

  /** ===== TabBar 状态 ===== */
  const [selectedFilter, setSelectedFilter] = useState("全部");
  const [selectedSort, setSelectedSort] = useState("相关度");

  /** ===== FilterBar 状态 ===== */
  const [categories, setCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 0]);
  const [star, setStar] = useState(0);

  /** ===== 分页和数据状态 ===== */
  const [currentPage, setCurrentPage] = useState(1);
  const [books, setBooks] = useState<BookCardProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalBooks, setTotalBooks] = useState(0);

  const totalPages = Math.ceil(totalBooks / PAGE_SIZE);

  /** ===== 当前页数据 ===== */

  // 加载搜索结果
  useEffect(() => {
    if (!keyword.trim()) return;

    const loadSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await searchBooks(keyword, currentPage, PAGE_SIZE);
        
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
          setTotalBooks(response.total);
        }
      } catch (error) {
        console.error('搜索失败:', error);
        setError('搜索失败，请检查后端是否启动');
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    loadSearchResults();
  }, [keyword, currentPage]);

  /** ===== 应用筛选 ===== */
  const handleApplyFilter = (params: {
    categories: string[];
    priceRange: number[];
    star: number;
  }) => {
    setCategories(params.categories);
    setPriceRange(params.priceRange);
    setStar(params.star);
    setCurrentPage(1); // 筛选后回到第一页
    console.log("筛选条件：", params);
  };

  /** ===== 页码切换 ===== */
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    console.log("切换到页码：", page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= 顶部 TabBar ================= */}
      <TabBar
        selectedFilter={selectedFilter}
        selectedSort={selectedSort}
        onFilterChange={setSelectedFilter}
        onSortChange={setSelectedSort}
      />

      {/* ================= 主体区域 ================= */}
      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-3">
        {/* ===== 左侧筛选栏 ===== */}
        <div className="w-full lg:w-72 shrink-0 lg:mt-9">
          <FilterBar
            categoryItems={categoryItems}
            selectedCategories={categories}
            priceRange={priceRange}
            star={star}
            onApply={handleApplyFilter}
          />
        </div>

        {/* ===== 右侧结果列表 ===== */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <i className="fa fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
              <p className="text-red-600 mb-2">{error}</p>
              <p className="text-sm text-gray-600">后端地址: http://localhost:8080</p>
            </div>
          ) : books.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
              <i className="fa fa-search text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">未找到结果</h3>
              <p className="text-gray-500">未找到与"{keyword}"相关的图书</p>
            </div>
          ) : (
            <>
              {/* 结果统计 */}
              <div className="flex justify-between items-center mb-4">
                <div></div>
                <div className="text-sm text-gray-500">
                  显示 {(currentPage - 1) * PAGE_SIZE + 1}–
                  {Math.min(currentPage * PAGE_SIZE, totalBooks)} 条，
                  共 {totalBooks} 条
                </div>
              </div>

              <BookList books={books} />

              {/* ===== 分页组件 ===== */}
              <div className="mt-6 flex justify-center">
                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                  <button
                    className="px-4 py-2 border-r border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    上一页
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    className={`px-4 py-2 border-r border-gray-300 ${
                      currentPage === pageNum
                        ? "bg-blue-500 text-white"
                        : "bg-white hover:bg-gray-50"
                    }`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                className="px-4 py-2 bg-white hover:bg-gray-50 disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                下一页
              </button>
            </div>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultPage;
