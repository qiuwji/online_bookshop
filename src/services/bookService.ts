import api from './http';

/**
 * 图书列表项
 */
export interface BookListItem {
  id: number;
  bookName: string;
  bookCover: string;
  author: string;
  price: number;
  discountRate: number;
  totalScore: number;
  featureLabel: string;
}

/**
 * 图书列表响应
 */
export interface BooksListResponse {
  list: BookListItem[];
  total: number;
  page: number;
  size: number;
}

/**
 * 获取图书列表请求参数
 */
export interface GetBooksParams {
  page?: number;
  size?: number;
  sort?: 'new' | 'hot';
  category?: string;
  keyword?: string;
}

/**
 * 图书详情
 */
export interface BookDetail {
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
}

// ============ API 请求方法 ============

/**
 * 获取图书列表
 * @param page 页码（默认1）
 * @param size 每页数量（默认20）
 * @param sort 排序方式（new=新书, hot=热门）
 * @param category 分类
 * @param keyword 搜索关键词
 * @returns 图书列表
 */
export const getBooks = (params: GetBooksParams = {}) => {
  const defaultParams: any = {
    page: params.page || 1,
    size: params.size || 20,
    ...params,
  };

  // 过滤掉undefined的参数
  Object.keys(defaultParams).forEach(
    key => defaultParams[key] === undefined && delete defaultParams[key]
  );

  return api.get<BooksListResponse>('/books', {
    params: defaultParams,
  });
};

/**
 * 获取新书上架列表
 * @param page 页码（默认1）
 * @param size 每页数量（默认20）
 * @returns 新书列表
 */
export const getNewBooks = (page: number = 1, size: number = 20) => {
  return api.get<BooksListResponse>('/books', {
    params: { page, size, sort: 'new' },
  });
};

/**
 * 获取热门推荐图书列表
 * @param page 页码（默认1）
 * @param size 每页数量（默认20）
 * @returns 热门图书列表
 */
export const getHotBooks = (page: number = 1, size: number = 20) => {
  return api.get<BooksListResponse>('/books', {
    params: { page, size, sort: 'hot' },
  });
};

/**
 * 搜索图书
 * @param keyword 搜索关键词
 * @param page 页码（默认1）
 * @param size 每页数量（默认20）
 * @returns 搜索结果
 */
export const searchBooks = (keyword: string, page: number = 1, size: number = 20) => {
  return api.get<BooksListResponse>('/books', {
    params: { keyword, page, size },
  });
};

/**
 * 按分类获取图书
 * @param category 分类名称
 * @param page 页码（默认1）
 * @param size 每页数量（默认20）
 * @returns 分类下的图书列表
 */
export const getBooksByCategory = (category: string, page: number = 1, size: number = 20) => {
  return api.get<BooksListResponse>('/books', {
    params: { category, page, size },
  });
};

/**
 * 获取图书详情
 * @param id 图书ID
 * @returns 图书详细信息
 */
export const getBookDetail = (id: number) => {
  return api.get<BookDetail>(`/books/${id}`);
};
