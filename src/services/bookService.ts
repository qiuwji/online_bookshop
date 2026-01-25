import api from './http';

export interface BookListItem {
  id: number;
  bookName: string;
  bookCover: string;
  author: string;
  price: number;
  discountRate: number;
  totalScore: number;
  featureLabel: string | null;
  category: string | null;  
}

/**
 * 图书列表响应（对应API返回的data字段）
 */
export interface BooksListData {
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
  keyword?: string;
  sort?: string;
  category?: string;
  categorys?: string;
  minPrice?: number;
  maxPrice?: number;
  scoreMin?: number;
}

/**
 * 图书详情数据
 */
export interface BookDetailData {
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

export const getNewBooks = (page: number = 1, size: number = 8): Promise<BooksListData> => {
  // 直接构建URL，确保参数正确传递
  const url = `/books?page=${page}&size=${size}&sort=new`;
  return api.get<BooksListData>(url);
};

export const getHotBooks = (page: number = 1, size: number = 8): Promise<BooksListData> => {
  // 直接构建URL，确保参数正确传递
  const url = `/books?page=${page}&size=${size}&sort=hot`;
  return api.get<BooksListData>(url);
};

/**
 * 获取图书列表
 */
export const getBooks = (params: GetBooksParams = {}): Promise<BooksListData> => {
  // 构建查询字符串，确保参数正确传递给后端
  const queryParams = new URLSearchParams();
  
  // 设置默认值
  const page = params.page || 1;
  const size = params.size || 8;
  
  queryParams.append('page', page.toString());
  queryParams.append('size', size.toString());
  
  // 添加其他参数
  if (params.sort) queryParams.append('sort', params.sort);
  if (params.category) queryParams.append('category', params.category);
  if (params.categorys) queryParams.append('categorys', params.categorys);
  if (params.keyword) queryParams.append('keyword', params.keyword);
  if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
  if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
  if (params.scoreMin !== undefined) queryParams.append('scoreMin', params.scoreMin.toString());
  
  const url = `/books?${queryParams.toString()}`;
  return api.get<BooksListData>(url);
};

/**
 * 按分类获取图书（单分类）
 */
export const getBooksByCategory = (category: string, page: number = 1, size: number = 8): Promise<BooksListData> => {
  // 使用URLSearchParams确保参数正确传递
  const queryParams = new URLSearchParams();
  queryParams.append('category', category);
  queryParams.append('page', page.toString());
  queryParams.append('size', size.toString());
  
  const url = `/books?${queryParams.toString()}`;
  return api.get<BooksListData>(url);
};

export const searchBooks = (params: GetBooksParams): Promise<BooksListData> => {
  // 直接复用getBooks函数，避免重复代码
  return getBooks(params);
};

/**
 * 获取图书详情
 */
export const getBookDetail = (id: number): Promise<BookDetailData> => {
  return api.get<BookDetailData>(`/books/${id}`);
};