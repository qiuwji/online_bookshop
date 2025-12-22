// api.ts
import axios, { 
  type AxiosInstance, 
  type AxiosRequestConfig, 
  type AxiosResponse, 
  type InternalAxiosRequestConfig,
  type AxiosHeaders,
  type RawAxiosRequestHeaders
} from 'axios';
import { useAuthStore } from '@/store/useAuthStore'; 

// 统一的响应体类型
type ApiResponse<T = any> = {
  code: number;
  msg: string;
  data: T;
};

// 扩展 AxiosRequestConfig 类型，添加自定义配置
interface CustomRequestConfig extends Omit<AxiosRequestConfig, 'headers'> {
  // 是否跳过响应拦截器的统一处理（直接返回原始响应）
  skipResponseInterceptor?: boolean;
  // 是否显示错误信息（默认显示）
  showErrorMessage?: boolean;
  // headers 需要明确定义以避免类型冲突
  headers?: RawAxiosRequestHeaders | AxiosHeaders;
}

// 错误处理接口
interface ApiError extends Error {
  code?: number;
  data?: any;
  config?: AxiosRequestConfig;
}

// 创建 axios 实例
const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// 请求拦截器：从 Zustand store 获取 token
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers = config.headers || ({} as RawAxiosRequestHeaders);
    
    // 从 Zustand store 获取 token（注意：这里在非 React 组件中也能使用）
    try {
      const { token } = useAuthStore.getState();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('获取 token 失败:', error);
    }
    
    // 添加请求时间戳，防止缓存
    if (config.method?.toLowerCase() === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    
    return config;
  },
  (error) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器：统一处理后端响应格式
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // 如果需要跳过拦截器处理，直接返回原始响应
    const config = response.config as CustomRequestConfig;
    if (config.skipResponseInterceptor) {
      return response;
    }
    
    const data = response.data as ApiResponse;
    
    // 检查响应格式是否符合约定
    if (!data || typeof data !== 'object') {
      const error: ApiError = new Error('无效的响应格式');
      error.code = 500;
      error.data = response.data;
      error.config = response.config;
      return Promise.reject(error);
    }
    
    // 根据业务逻辑判断请求是否成功
    // 这里假设 code 为 200 或 0 表示成功，您可以根据实际项目调整
    const successCodes = [200, 0];
    if (!successCodes.includes(data.code)) {
      const error: ApiError = new Error(data.msg || '请求失败');
      error.code = data.code;
      error.data = data.data;
      error.config = response.config;
      
      // 根据配置决定是否显示错误信息
      if (config.showErrorMessage !== false) {
        // 这里可以集成您项目的消息提示组件
        console.error(`请求失败 [${data.code}]: ${data.msg}`);
        // 例如：message.error(data.msg);
      }
      
      // 特殊错误码处理（如 token 过期）
      if (data.code === 401) {
        const { logout } = useAuthStore.getState();
        logout(); // 清除本地 token
        
        // 重定向到登录页（如果不是登录页）
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      
      return Promise.reject(error);
    }
    
    // 返回处理后的数据
    return {
      ...response,
      data: data.data,
      originalData: data, // 保留原始响应数据，方便调试
    };
  },
  (error) => {
    // 处理网络错误、超时等
    let errorMessage = '请求失败';
    let errorCode = error.response?.status || 500;
    
    if (error.response) {
      // 服务器返回了错误状态码
      const data = error.response.data as ApiResponse;
      errorMessage = data?.msg || `服务器错误: ${error.response.status}`;
      errorCode = data?.code || error.response.status;
      
      // 处理 401 未授权错误
      if (error.response.status === 401) {
        const { logout } = useAuthStore.getState();
        logout(); // 清除本地 token
        
        // 重定向到登录页（如果不是登录页）
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // 请求已发送但无响应
      if (error.code === 'ECONNABORTED') {
        errorMessage = '请求超时，请检查网络连接';
      } else {
        errorMessage = '网络异常，请检查网络连接';
      }
    } else {
      errorMessage = error.message || '请求配置错误';
    }
    
    const apiError: ApiError = new Error(errorMessage);
    apiError.code = errorCode;
    apiError.data = error.response?.data;
    apiError.config = error.config;
    
    // 显示错误消息
    const config = error.config as CustomRequestConfig;
    if (config?.showErrorMessage !== false) {
      console.error(errorMessage);
      // 例如：message.error(errorMessage);
    }
    
    return Promise.reject(apiError);
  }
);

// 统一的请求函数
async function request<T = any>(config: CustomRequestConfig): Promise<T> {
  try {
    const response = await http.request(config);
    return response.data;
  } catch (error) {
    // 如果已经是我们定义的 ApiError，直接抛出
    if ((error as ApiError).code !== undefined) {
      throw error;
    }
    
    // 转换为统一的错误格式
    const apiError: ApiError = error instanceof Error 
      ? error 
      : new Error('未知错误');
    throw apiError;
  }
}

// API 方法封装
const api = {
  // GET 请求
  get<T = any>(url: string, params?: any, config?: CustomRequestConfig) {
    return request<T>({ 
      ...(config || {}), 
      method: 'GET', 
      url, 
      params 
    });
  },
  
  // POST 请求
  post<T = any>(url: string, data?: any, config?: CustomRequestConfig) {
    return request<T>({ 
      ...(config || {}), 
      method: 'POST', 
      url, 
      data 
    });
  },
  
  // PUT 请求
  put<T = any>(url: string, data?: any, config?: CustomRequestConfig) {
    return request<T>({ 
      ...(config || {}), 
      method: 'PUT', 
      url, 
      data 
    });
  },
  
  // DELETE 请求
  delete<T = any>(url: string, params?: any, config?: CustomRequestConfig) {
    return request<T>({ 
      ...(config || {}), 
      method: 'DELETE', 
      url, 
      params 
    });
  },
  
  // PATCH 请求
  patch<T = any>(url: string, data?: any, config?: CustomRequestConfig) {
    return request<T>({ 
      ...(config || {}), 
      method: 'PATCH', 
      url, 
      data 
    });
  },
  
  // 下载文件
  download(url: string, params?: any, config?: CustomRequestConfig) {
    return request<Blob>({
      ...(config || {}),
      method: 'GET',
      url,
      params,
      responseType: 'blob',
    });
  },
  
  // 上传文件
  upload<T = any>(url: string, formData: FormData, config?: CustomRequestConfig) {
    return request<T>({
      ...(config || {}),
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(config?.headers || {}),
      } as RawAxiosRequestHeaders,
    });
  },
  
  // 原始 axios 实例（用于特殊情况）
  raw: http,
  
  // 设置默认配置
  setDefaultConfig(config: Partial<CustomRequestConfig>) {
    Object.assign(http.defaults, config);
  },
  
  // 设置认证令牌
  setToken(token: string) {
    http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
  
  // 清除认证令牌
  clearToken() {
    delete http.defaults.headers.common['Authorization'];
  },
  
  // 获取当前默认配置（修复类型问题）
  getDefaultConfig() {
    return http.defaults as Partial<CustomRequestConfig>;
  },
};

// 导出类型
export type { ApiResponse, ApiError, CustomRequestConfig };

// 导出实例
export default api;