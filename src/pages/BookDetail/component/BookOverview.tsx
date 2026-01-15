import { useState, useEffect } from 'react';
import { addCollection, removeCollection, isCollected } from '@/services/collectionService';

interface BookOverviewProps {
  bookName: string;
  book_cover: string;
  author: string;
  publisher: string;
  ISBN: string;
  price: number;
  discount_rate?: number;
  discount_start?: string;
  discount_finish?: string;
  comment_count: number;
  total_score: number;
  stock: number;
  publish_time: string;
  category: string;
  isFavorited?: boolean;
  bookId?: number;
}

const BookOverview: React.FC<BookOverviewProps> = ({
  bookName,
  book_cover,
  author,
  publisher,
  ISBN,
  price,
  discount_rate,
  comment_count,
  total_score,
  stock,
  publish_time,
  category,
  isFavorited: initialIsFavorited = false,
  bookId,
}) => {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [quantity, setQuantity] = useState(1);
  const [selectedCity, setSelectedCity] = useState("广州市");
  const [favLoading, setFavLoading] = useState(false);

  // 计算当前价格
  const currentPrice = discount_rate ? price * discount_rate : price;
  // 计算折扣显示
  const discountPercent = discount_rate ? (discount_rate * 10).toFixed(1) : null;
  // 计算节省金额
  const savedAmount = discount_rate ? price - currentPrice : 0;
  
  // 计算平均评分
  const avgScore = comment_count > 0 ? total_score / comment_count : 0;

  const handleFavoriteClick = async () => {
    if (!bookId) {
      setIsFavorited(!isFavorited);
      return;
    }

    if (favLoading) return;
    setFavLoading(true);
    try {
      if (isFavorited) {
        // 取消收藏
        const ok = await removeCollection(bookId);
        if (ok) setIsFavorited(false);
      } else {
        const res = await addCollection(bookId);
        if (res) setIsFavorited(true);
      }
    } catch (err) {
      console.error('切换收藏失败:', err);
    } finally {
      setFavLoading(false);
    }
  };

  useEffect(() => {
    // 初始查询收藏状态（若未通过 props 提供）
    let mounted = true;
    const check = async () => {
      if (!bookId) return;
      try {
        const collected = await isCollected(bookId);
        if (mounted) setIsFavorited(collected);
      } catch (err) {
        // ignore
      }
    };
    check();
    return () => { mounted = false; };
  }, [bookId]);

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleBuyNow = () => {
    console.log('立即购买！！！');
  }

  const handleAddShopCart = () => {
    console.log('加入购物车');
  }

  // 生成星星数组，支持半星
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(avgScore);
    const hasHalfStar = avgScore % 1 >= 0.5;
    
    // 完整星星
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <i
          key={`full-${i}`}
          className="fa fa-star text-yellow-500 text-xl mr-1"
        />
      );
    }
    
    // 半星
    if (hasHalfStar) {
      stars.push(
        <i
          key="half"
          className="fa fa-star-half-o text-yellow-500 text-xl mr-1"
        />
      );
    }
    
    // 空星
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <i
          key={`empty-${i}`}
          className="fa fa-star-o text-gray-300 text-xl mr-1"
        />
      );
    }
    
    return stars;
  };

  return (
    // 关键修改：添加与BookDetailTabs相同的padding
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 左侧封面区域 */}
          <div className="md:w-1/4">
            <div className="flex justify-center">
              <div className="relative w-64 h-96 shadow-lg rounded-md overflow-hidden">
                <img 
                  src={book_cover} 
                  alt={bookName} 
                  className="w-full h-full object-cover"
                />
                
                <button 
                  onClick={handleFavoriteClick}
                  className="absolute top-4 right-4 w-10 h-10 
                    rounded-full bg-[rgba(255,255,255,0.7)] 
                    flex items-center justify-center 
                    hover:bg-[rgba(255,255,255,0.9)]
                    cursor-pointer transition-colors duration-200"
                  aria-label={isFavorited ? "取消收藏" : "收藏该图书"}
                >
                  <i className={`
                    fa ${isFavorited ? "fa-heart" : "fa-heart-o"} text-xl 
                    ${isFavorited ? "text-red-500" : "text-red-500"}
                  `}></i>
                </button>
              </div>
            </div>
          </div>

          {/* 右侧信息区域 */}
          <div className="md:w-3/4">
            {/* 书名 */}
            <h1 className="text-3xl font-bold mb-2">{bookName}</h1>
            
            {/* 评分和评价数量 */}
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-2">
                {renderStars()}
              </div>
              <span className="text-gray-500">
                {avgScore.toFixed(1)} ({comment_count} 条评价)
              </span>
            </div>

            {/* 作者信息 */}
            <p className="text-gray-600 mb-3">
              作者：<span className="text-blue-600 cursor-pointer hover:underline">{author}</span>
            </p>

            {/* 出版社 */}
            <p className="text-gray-600 mb-3">出版社：{publisher}</p>

            {/* 出版日期 */}
            <p className="text-gray-600 mb-3">出版日期：{new Date(publish_time).toLocaleDateString('zh-CN')}</p>

            {/* ISBN */}
            <p className="text-gray-600 mb-3">ISBN：{ISBN}</p>

            {/* 分类 */}
            <p className="text-gray-600 mb-6">分类：{category}</p>

            {/* 价格信息 */}
            <div className="mb-6">
              <div className="flex items-baseline mb-2">
                <span className="text-3xl font-bold text-orange-600">¥{currentPrice.toFixed(2)}</span>
                {discount_rate && (
                  <>
                    <span className="text-gray-400 text-lg line-through ml-3">¥{price.toFixed(2)}</span>
                    <span className="ml-3 bg-orange-100 text-orange-600 text-sm px-2 py-1 rounded">
                      {discountPercent}折
                    </span>
                  </>
                )}
              </div>
              {discount_rate && (
                <p className="text-green-600">节省 ¥{savedAmount.toFixed(2)}</p>
              )}
            </div>

            {/* 配送信息 */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <span className="text-gray-600 mr-4">配送至：</span>
                <select 
                  className="cursor-pointer border border-gray-300 rounded px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="北京市">北京市</option>
                  <option value="上海市">上海市</option>
                  <option value="广州市">广州市</option>
                  <option value="深圳市">深圳市</option>
                </select>
              </div>
            </div>

            {/* 购买数量 */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <span className="text-gray-600 mr-4">数量：</span>
                <div className="flex items-center">
                  <button 
                    onClick={handleDecreaseQuantity}
                    className="cursor-pointer w-10 h-10 bg-gray-100 rounded-l-md flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <i className="fa fa-minus"></i>
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    min="1" 
                    max={stock}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value >= 1 && value <= stock) {
                        setQuantity(value);
                      }
                    }}
                    className="w-16 h-10 border-y border-gray-300 text-center focus:outline-none"
                  />
                  <button 
                    onClick={handleIncreaseQuantity}
                    className="cursor-pointer w-10 h-10 bg-gray-100 rounded-r-md flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <i className="fa fa-plus"></i>
                  </button>
                  <span className="ml-4 text-gray-500">库存 {stock} 件</span>
                </div>
              </div>

              {/* 购买按钮 */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleAddShopCart}
                  className="cursor-pointer flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center">
                  <i className="fa fa-shopping-cart mr-2"></i> 加入购物车
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="cursor-pointer flex-1 bg-orange-400 text-white px-6 py-2 rounded-lg hover:bg-orange-500 transition-colors duration-200 flex items-center justify-center">
                  立即购买
                </button>
              </div>
            </div>

            {/* 保障信息 */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center">
                <i className="fa fa-shield text-blue-600 mr-2"></i>
                <span className="text-gray-600">正品保障</span>
              </div>
              <div className="flex items-center">
                <i className="fa fa-truck text-blue-600 mr-2"></i>
                <span className="text-gray-600">极速发货</span>
              </div>
              <div className="flex items-center">
                <i className="fa fa-refresh text-blue-600 mr-2"></i>
                <span className="text-gray-600">7天无理由退换</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookOverview;