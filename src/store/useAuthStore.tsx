import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface AuthUser {
  id: string; // 用户唯一ID
  username: string; // 用户名
  avatarUrl: string;
  email?: string | null; // 手机号
}

/** 认证 + 购物车状态类型 */
interface AuthState {

  token: string | null; // 登录令牌（null = 未登录）
  user: AuthUser | null; // 用户信息（null = 未登录）

  cartCount: number; 
  // 状态操作方法
  setAuth: (token: string, user: AuthUser) => void; // 登录：设置token+用户信息
  logout: () => void; // 登出：清空所有状态
  updateCartCount: (count: number) => void; // 更新购物车数量
  incrementCart: (num?: number) => void; // 购物车数量增加（默认+1）
  decrementCart: (num?: number) => void; // 购物车数量减少（默认-1，最小为0）
}

// 2. 创建 Store（带持久化）
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      token: null,
      user: null,
      cartCount: 0,

      /**
       * 登录：设置token和用户信息
       * @param token 登录令牌
       * @param user 用户信息
       */
      setAuth: (token, user) => set({ token, user }),

      /** 登出：清空token、用户信息，重置购物车数量 */
      logout: () => set({ token: null, user: null, cartCount: 0 }),

      /**
       * 直接更新购物车数量（适合已知总数的场景）
       * @param count 目标数量
       */
      updateCartCount: (count) => set({ cartCount: Math.max(0, count) }), // 确保数量≥0

      /**
       * 购物车数量增加
       * @param num 增加的数量（默认+1）
       */
      incrementCart: (num = 1) => {
        const currentCount = get().cartCount;
        set({ cartCount: currentCount + num });
      },

      /**
       * 购物车数量减少
       * @param num 减少的数量（默认-1）
       */
      decrementCart: (num = 1) => {
        const currentCount = get().cartCount;
        set({ cartCount: Math.max(0, currentCount - num) }); // 避免负数
      },
    }),
    {
      name: 'auth-cart-store', // localStorage 存储的key（可自定义）
      storage: createJSONStorage(() => localStorage), // 持久化到localStorage
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        cartCount: state.cartCount,
      }), // 只持久化核心字段
    }
  )
);

// 3. 封装常用 Hooks
/** 获取登录状态（是否已登录） */
export const useIsLogin = () => useAuthStore((state) => !!state.token);

/** 获取购物车数量（直接用这个Hook更便捷） */
export const useCartCount = () => useAuthStore((state) => state.cartCount);

/** 获取用户信息 + 登录状态（浅比较优化重渲染） */
export const useAuthUser = () => {
  // 分别订阅 token 和 user，只在对应值变化时重渲染
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  
  // 返回组合后的状态
  return {
    isLogin: !!token,
    user,
  };
};