import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeFromCart } from '@/services/cartService';
import { useIsLogin } from '@/store/useAuthStore';
import { Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

interface CartItem {
  id: number;
  bookId: number;
  bookName: string;
  imageUrl: string;
  author: string;
  price: number;
  discountPrice: number;
  originalPrice: number;
  quantity: number;
  count: number;
  selected: boolean;
}

// 本地存储键名
const SELECTED_CART_ITEMS_KEY = 'selected_cart_items';

const ShoppingCartPage = () => {

  useDocumentTitle("购物车");

  const navigate = useNavigate();
  const isLogin = useIsLogin();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelectAll, setIsSelectAll] = useState(false);

  // 从本地存储获取选中的商品
  const getSelectedItemsFromStorage = (): Array<{book_id: number, quantity: number}> => {
    try {
      const saved = localStorage.getItem(SELECTED_CART_ITEMS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('读取选中商品失败:', error);
      return [];
    }
  };

  // 保存选中的商品到本地存储
  const saveSelectedItemsToStorage = (items: CartItem[]) => {
    try {
      const selectedItems = items
        .filter(item => item.selected)
        .map(item => ({
          book_id: item.bookId, // 注意：使用 book_id 而不是 bookId
          quantity: item.quantity
        }));
      
      localStorage.setItem(SELECTED_CART_ITEMS_KEY, JSON.stringify(selectedItems));
      console.log('💾 保存选中商品到本地存储:', selectedItems);
    } catch (error) {
      console.error('保存选中商品失败:', error);
    }
  };

  // 清理本地存储中无效的选中商品
  const cleanupSelectedItemsStorage = (currentItems: CartItem[]) => {
    try {
      const savedItems = getSelectedItemsFromStorage();
      const currentBookIds = new Set(currentItems.map(item => item.bookId));
      
      // 过滤掉购物车中不存在的商品
      const validItems = savedItems.filter(item => currentBookIds.has(item.book_id));
      
      if (validItems.length !== savedItems.length) {
        localStorage.setItem(SELECTED_CART_ITEMS_KEY, JSON.stringify(validItems));
        console.log('🧹 清理了无效的选中商品');
      }
    } catch (error) {
      console.error('清理选中商品失败:', error);
    }
  };

  // 加载购物车数据
  useEffect(() => {
    const loadCart = async () => {
      console.log("加载购物车数据");
      
      try {
        if (!isLogin) {
          navigate('/login');
          return;
        }

        setIsLoading(true);
        const cartData = await getCart();
        
        console.log('🎯 cartService 返回的数据:', cartData);
        
        if (cartData && cartData.list) {
          console.log('📊 购物车列表数据:', cartData.list);
          
          // 从本地存储加载之前选中的商品
          const savedSelectedItems = getSelectedItemsFromStorage();
          const savedSelectedBookIds = new Set(savedSelectedItems.map(item => item.book_id));
          
          // 初始化购物车项目，恢复之前选中的状态
          const items = cartData.list.map(item => ({
            id: item.id,
            bookId: item.bookId,
            bookName: item.bookName,
            imageUrl: item.imageUrl || '',
            author: item.author || '',
            price: item.price || 0,
            discountPrice: item.discountPrice || 0,
            originalPrice: item.price || 0,
            quantity: item.quantity,
            count: item.count,
            selected: savedSelectedBookIds.has(item.bookId) // 恢复选中状态
          }));
          
          console.log('✅ 初始化的购物车项目:', items);
          setCartItems(items);
          
          // 如果本地有选中的商品，但购物车中没有对应的商品，清理本地存储
          cleanupSelectedItemsStorage(items);
        }
      } catch (error) {
        console.error('加载购物车失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [isLogin, navigate]);

  // 更新全选状态
  useEffect(() => {
    const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);
    setIsSelectAll(allSelected);
  }, [cartItems]);

  // 当选中的商品变化时，保存到本地存储
  useEffect(() => {
    if (cartItems.length > 0) {
      saveSelectedItemsToStorage(cartItems);
    }
  }, [cartItems]);

  // 计算总金额
  const calculateTotal = () => {
    const selectedItems = cartItems.filter(item => item.selected);
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const total = subtotal;
    return { subtotal, total };
  };

  // 计算选中的商品数量
  const selectedCount = cartItems.filter(item => item.selected).length;

  // 单个商品选择切换 - 更新本地状态并保存到本地存储
  const toggleItemSelection = (id: number) => {
    setCartItems(prev => {
      const newItems = prev.map(i => 
        i.id === id ? { ...i, selected: !i.selected } : i
      );
      
      // 更新全选状态
      const allSelected = newItems.length > 0 && newItems.every(item => item.selected);
      setIsSelectAll(allSelected);
      
      return newItems;
    });
  };

  // 全选/全不选 - 更新本地状态并保存到本地存储
  const toggleSelectAll = () => {
    const newSelectAll = !isSelectAll;
    setIsSelectAll(newSelectAll);
    setCartItems(prev => prev.map(item => ({ ...item, selected: newSelectAll })));
  };

  // 修改商品数量 - 同步到后端并更新本地存储
  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      const item = cartItems.find(i => i.id === id);
      if (!item) return;

      const success = await updateCartItem(id, newQuantity, item.selected);
      if (success) {
        setCartItems(prev => prev.map(i => {
          if (i.id === id) {
            return { ...i, quantity: newQuantity, count: newQuantity };
          }
          return i;
        }));
      }
    } catch (error) {
      console.error('更新商品数量失败:', error);
      Modal.error({ title: '更新失败', content: '请稍后重试' });
    }
  };

  // 删除商品
  const removeItem = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleFilled />,
      content: '你确定要删除该购物车商品吗？此操作不可恢复',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const success = await removeFromCart(id);
          if (success) {
            setCartItems(prev => prev.filter(item => item.id !== id));
            Modal.success({ title: '删除成功', content: '商品已从购物车移除' });
          }
        } catch (error) {
          console.error('删除商品失败:', error);
          Modal.error({ title: '删除失败', content: '请稍后重试' });
        }
      }
    });
  };

  // 批量删除选中的商品
  const removeSelectedItems = () => {
    const selectedItems = cartItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      Modal.warning({ title: '提示', content: '请先选择要删除的商品' });
      return;
    }
    
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleFilled />,
      content: `确定要删除选中的 ${selectedItems.length} 件商品吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const promises = selectedItems.map(item => removeFromCart(item.id));
          await Promise.all(promises);
          setCartItems(prev => prev.filter(item => !item.selected));
          Modal.success({ title: '删除成功', content: '已删除选中的商品' });
        } catch (error) {
          console.error('批量删除商品失败:', error);
          Modal.error({ title: '删除失败', content: '请稍后重试' });
        }
      }
    });
  };

  // 去结算
  const handleCheckout = () => {
    const selectedItems = cartItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      Modal.warning({ title: '提示', content: '请先选择要结算的商品' });
      return;
    }

    // 跳转到结算页面
    navigate('/checkout');
  };

  // 继续购物
  const continueShopping = () => {
    navigate('/');
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">加载购物车中...</span>
          </div>
        </div>
      </div>
    );
  }

  const { subtotal, total } = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            <i className="fa fa-shopping-cart mr-3"></i>购物车
          </h1>
          <p className="text-gray-500 mt-2">
            已选 <span className="text-blue-600 font-semibold">{selectedCount}</span> 件商品，共 <span className="text-blue-600 font-semibold">{cartItems.length}</span> 件
          </p>
        </div>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 左侧商品列表 */}
            <div className="lg:w-2/3">
              {/* 商品列表头部 */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isSelectAll}
                      onChange={toggleSelectAll}
                      className="h-5 w-5 text-blue-600 rounded cursor-pointer"
                    />
                    <span className="ml-2 text-gray-700 cursor-pointer" onClick={toggleSelectAll}>
                      全选
                    </span>
                    <span className="ml-4 text-gray-500 text-sm">
                      ({selectedCount}/{cartItems.length})
                    </span>
                  </div>
                  <button 
                    onClick={removeSelectedItems}
                    className="text-red-500 hover:text-red-700 flex items-center cursor-pointer"
                    disabled={selectedCount === 0}
                  >
                    <i className="fa fa-trash-can mr-1"></i>
                    删除选中
                  </button>
                </div>
              </div>

              {/* 商品列表 */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                      {/* 选择框 */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => toggleItemSelection(item.id)}
                          className="h-5 w-5 text-blue-600 rounded cursor-pointer"
                        />
                      </div>

                      {/* 图书封面 */}
                      <img 
                        src={item.imageUrl} 
                        alt={item.bookName}
                        className="w-24 h-32 object-cover rounded shadow shrink-0"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/120x160?text=Book+Cover';
                        }}
                      />

                      {/* 商品信息 */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 mb-2">
                              <Link to={`/book/${item.bookId}`} className="hover:underline">
                                {item.bookName}
                              </Link>
                            </h3>
                            <p className="text-gray-500">
                              <i className="fa fa-user-pen mr-2 text-sm"></i>
                              {item.author}
                            </p>
                          </div>

                          {/* 价格区域 */}
                          <div className="mt-3 md:mt-0 md:ml-4">
                            <div className="flex items-center">
                              {item.price > item.discountPrice && (
                                <span className="text-gray-400 line-through mr-2 text-sm">
                                  ¥{item.originalPrice.toFixed(2)}
                                </span>
                              )}
                              <span className="text-xl font-bold text-red-500">
                                ¥{item.discountPrice.toFixed(2)}
                              </span>
                            </div>
                            {item.price > item.discountPrice && (
                              <div className="mt-1">
                                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                                  省¥{(item.price - item.discountPrice).toFixed(2)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 操作区域 */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          {/* 数量调整 */}
                          <div className="flex items-center mb-3 md:mb-0">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1}
                            >
                              <i className="fa fa-minus text-sm"></i>
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="w-12 h-8 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              min="1"
                            />
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-100 cursor-pointer"
                            >
                              <i className="fa fa-plus text-sm"></i>
                            </button>
                            <span className="text-gray-500 text-sm ml-2">
                              库存充足
                            </span>
                          </div>

                          {/* 小计 */}
                          <div className="text-lg font-bold text-red-500 mb-3 md:mb-0">
                            ¥{(item.discountPrice * item.quantity).toFixed(2)}
                          </div>

                          {/* 操作按钮 */}
                          <div className="flex gap-3">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-500 hover:text-red-500 flex items-center cursor-pointer"
                            >
                              <i className="fa fa-trash-can mr-1"></i>
                              删除
                            </button>
                            <Link 
                              to={`/book/${item.bookId}`}
                              className="text-blue-500 hover:text-blue-700 flex items-center"
                            >
                              <i className="fa fa-info-circle mr-1"></i>
                              详情
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 继续购物按钮 */}
              <div className="mt-6">
                <button
                  onClick={continueShopping}
                  className="cursor-pointer border border-blue-500 text-blue-500 hover:bg-blue-50 px-6 py-2 rounded-md transition-colors flex items-center"
                >
                  <i className="fa fa-arrow-left mr-2"></i>
                  继续购物
                </button>
              </div>
            </div>

            {/* 右侧结算区域 */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">订单结算</h2>

                {/* 金额明细 */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>商品总价</span>
                    <span>¥{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>应付总额</span>
                      <span className="text-red-500">¥{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* 结算按钮 */}
                <button
                  onClick={handleCheckout}
                  disabled={selectedCount === 0}
                  className={`w-full py-3 rounded-md font-medium flex items-center justify-center transition-all ${
                    selectedCount > 0 
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg cursor-pointer' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <i className="fa fa-credit-card mr-2"></i>
                  {selectedCount > 0 ? `去结算 (${selectedCount} 件)` : '请选择商品'}
                </button>

                {/* 购物提示 */}
                <div className="mt-4 text-sm text-gray-500 space-y-2">
                  <p><i className="fa fa-check-circle mr-2 text-green-500"></i>正品保证</p>
                  <p><i className="fa fa-truck mr-2 text-blue-500"></i>全场满99元包邮</p>
                  <p><i className="fa fa-shield mr-2 text-orange-500"></i>7天无理由退换</p>
                  <p><i className="fa fa-clock mr-2 text-purple-500"></i>24小时内发货</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 空购物车状态 */
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <i className="fa fa-shopping-cart text-4xl text-gray-400"></i>
              </div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">购物车空空如也</h2>
              <p className="text-gray-500 mb-6">快去挑选心仪的图书吧～</p>
              <div className="flex gap-4">
                <button
                  onClick={continueShopping}
                  className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors flex items-center shadow-md hover:shadow-lg"
                >
                  <i className="fa fa-home mr-2"></i> 返回首页
                </button>
                <Link
                  to="/collections"
                  className="cursor-pointer border border-blue-500 text-blue-500 hover:bg-blue-50 px-6 py-2 rounded-md transition-colors flex items-center"
                >
                  <i className="fa fa-heart mr-2"></i> 查看收藏
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCartPage;