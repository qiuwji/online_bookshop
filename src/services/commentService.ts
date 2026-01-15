import { api } from './http';
import { uploadImages, type UploadData } from './uploadService';

/**
 * 评论项
 */
export interface CommentItem {
  id: number;
  userId: number;
  userName: string;
  avatar: string;
  rating: number;
  content: string;
  createTime: string;
  likeCount: number;
  isLiked: boolean;
  images: string[];
}

/**
 * 评论列表响应
 */
export interface CommentsListResponse {
  code: number;
  msg: string;
  data: {
    total: number;
    page: number;
    size: number;
    list: CommentItem[];
  };
}

/**
 * 点赞评论响应
 */
export interface LikeCommentResponse {
  code: number;
  data: string;
  msg: {
    liked: boolean;
    likeCount: number;
  };
}

/**
 * 发布评论请求
 */
export interface PublishCommentRequest {
  content: string;
  score: number | string;
  images?: Array<{
    url: string;
    file_name: string;
    file_size: number;
  }> | {
    url: string;
    file_name: string;
    file_size: number;
  };
}

/**
 * 获取某书的评论
 * @param bookId 书籍ID
 * @param page 页码，默认1
 * @param size 每页数量，默认10
 */
export const getBookComments = async (
  bookId: number,
  page = 1,
  size = 10
): Promise<CommentsListResponse['data'] | null> => {
  try {
    const response = await api.get<CommentsListResponse>(`/books/${bookId}/comments`, {
      params: { page, size }
    });

    if (response.code === 0 && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(`获取书籍${bookId}的评论失败:`, error);
    throw error;
  }
};

/**
 * 发布评论
 * @param bookId 书籍ID
 * @param content 评论内容
 * @param score 评分(1-5)
 * @param images 评论图片URL数组
 */
export const publishComment = async (
  bookId: number | string,
  content: string,
  score: number | string,
  images?: File[] | UploadData[]
): Promise<object | null> => {
  try {
    let imagesPayload: any = undefined;

    if (images && images.length > 0) {
      // 如果传入 File[]，先上传
      if ((images as File[])[0] instanceof File) {
        const files = images as File[];
        const uploaded = await uploadImages(files, 'comment');
        if (uploaded.length === 1) {
          imagesPayload = {
            url: uploaded[0].url,
            file_name: uploaded[0].file_name,
            file_size: uploaded[0].file_size
          };
        } else {
          imagesPayload = uploaded.map(u => ({
            url: u.url,
            file_name: u.file_name,
            file_size: u.file_size
          }));
        }
      } else {
        // 已经是 UploadData[]
        const uploaded = images as UploadData[];
        if (uploaded.length === 1) {
          imagesPayload = {
            url: uploaded[0].url,
            file_name: uploaded[0].file_name,
            file_size: uploaded[0].file_size
          };
        } else {
          imagesPayload = uploaded.map(u => ({
            url: u.url,
            file_name: u.file_name,
            file_size: u.file_size
          }));
        }
      }
    }

    const body: any = {
      content,
      score: String(score)
    };
    if (imagesPayload !== undefined) {
      body.images = imagesPayload;
    }

    const response = await api.post<any>(`/books/${bookId}/comments`, body);

    if (response && (response.code === 0 || response.code === 200 || response.code === '0' || response.code === '200')) {
      return response.data || {};
    }
    return null;
  } catch (error) {
    console.error('发布评论失败:', error);
    throw error;
  }
};

/**
 * 点赞评论
 * @param commentId 评论ID
 */
export const likeComment = async (commentId: string): Promise<{ liked: boolean; likeCount: number } | null> => {
  try {
    const response = await api.post<LikeCommentResponse>(
      `/comments/${commentId}/like`,
      {}
    );

    if (response.code === 0 && response.msg) {
      return response.msg;
    }
    return null;
  } catch (error) {
    console.error('点赞评论失败:', error);
    throw error;
  }
};

/**
 * 获取评分统计
 * @param bookId 书籍ID
 */
export const getRatingStats = async (bookId: number) => {
  try {
    const comments = await getBookComments(bookId, 1, 100);
    if (!comments || comments.list.length === 0) {
      return {
        averageRating: 0,
        totalCount: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRating = 0;

    comments.list.forEach(comment => {
      const rating = Math.min(5, Math.max(1, comment.rating));
      distribution[rating as keyof typeof distribution]++;
      totalRating += comment.rating;
    });

    return {
      averageRating: (totalRating / comments.list.length).toFixed(1),
      totalCount: comments.total,
      distribution
    };
  } catch (error) {
    console.error('获取评分统计失败:', error);
    return null;
  }
};

/**
 * 获取高评分评论（5星）
 * @param bookId 书籍ID
 */
export const getHighRatedComments = async (bookId: number): Promise<CommentItem[]> => {
  try {
    const comments = await getBookComments(bookId, 1, 100);
    if (!comments) return [];
    return comments.list.filter(comment => comment.rating === 5);
  } catch (error) {
    console.error('获取高评分评论失败:', error);
    return [];
  }
};
