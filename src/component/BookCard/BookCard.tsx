import React from 'react'; 
import 'font-awesome/css/font-awesome.min.css';
import './BookCard.css';

export interface BookCardProps {
  bookId: number;
  bookName: string;
  imageUrl: string;
  author: string;
  price: number;
  discountPrice?: number;
  featureLabel?: string;
  points?: number; // 已定义的得分属性
}

const BookCard: React.FC<BookCardProps> = ({
  bookId,
  bookName,
  imageUrl,
  author,
  price,
  discountPrice,
  featureLabel,
  points // 解构获取得分属性
}) => {
  const handleAddToCart = () => {
    console.log(`加入购物车：图书ID=${bookId}，名称=${bookName}`);
  };

  return (
    <div className="BookCard">
      {featureLabel && (
        <div className="feature-tag-container">
          <span className="feature-tag">{featureLabel}</span>
        </div>
      )}
      
      <div className="book-img-container">
        <img 
          src={imageUrl}
          alt={bookName}
          loading='lazy'
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://ts3.tc.mm.bing.net/th/id/OIP-C.oUYGYFTtQwQ8NJV1q8TkCgHaGI?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3';
          }}
        />
      </div>
      
      <h2 className='BookName'>{bookName}</h2>
      <p className='AuthorName'>{author}</p>
      
      {points && (
        <p className="BookPoints">
          <i className="fa fa-star" style={{ color: "#ffd700", marginRight: "4px" }}></i>
          评分：{points}
        </p>
      )}
      
      <div className="price-cart-wrap">
        <div>
          {discountPrice ? (
            <>
              <span className="Price discount-price">¥{discountPrice}</span>
              <span className="Price original-price">¥{price}</span>
            </>
          ) : (
            <span className="Price discount-price">¥{price}</span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          className='shopCart'
        >
          <i className="fa fa-shopping-cart"></i>
        </button>
      </div>
    </div>
  );
};

export default BookCard;