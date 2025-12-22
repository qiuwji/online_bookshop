import React, { useEffect, useState } from "react";

interface CarouselImage {
  imgUrl: string;
  onClick: () => void;
  alt?: string;
}

interface CarouselProps {
  images: CarouselImage[];
  autoplay?: boolean;
  autoplayInterval?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
  infinite?: boolean;
  onChange?: (index: number) => void;
  initialIndex?: number;
  className?: string; // 添加 className 属性
}

const Carousel: React.FC<CarouselProps> = ({
  images,
  autoplay = true,
  autoplayInterval = 3000,
  showIndicators = true,
  showArrows = true,
  infinite = true,
  onChange,
  initialIndex = 0,
  className = "", // 添加默认值
}) => {
  const [mouseIn, setMouseIn] = useState(false);
  const [imgIndex, setImgIndex] = useState(initialIndex);
  const total = images.length;

  const [loadedImageIndexes, setLoadedImageIndexes] = useState<Set<number>>(
    new Set([initialIndex])
  );

  const goTo = (index: number) => {
    let next = index;
    if (infinite) {
      next = (index + total) % total;
    } else {
      next = Math.max(0, Math.min(index, total - 1));
    }
    setImgIndex(next);
    onChange?.(next);
  };

  const next = () => goTo(imgIndex + 1);
  const prev = () => goTo(imgIndex - 1);

  // 监听索引变化，加载当前及相邻图片
  useEffect(() => {
    const loadAdjacentImages = () => {
      setLoadedImageIndexes((prevLoaded) => {
        const newLoadedIndexes = new Set(prevLoaded);
        newLoadedIndexes.add(imgIndex);
        
        // 加载前一张图片
        if (infinite) {
          const prevIndex = (imgIndex - 1 + total) % total;
          newLoadedIndexes.add(prevIndex);
        } else if (imgIndex > 0) {
          newLoadedIndexes.add(imgIndex - 1);
        }
        
        // 加载后一张图片
        if (infinite) {
          const nextIndex = (imgIndex + 1) % total;
          newLoadedIndexes.add(nextIndex);
        } else if (imgIndex < total - 1) {
          newLoadedIndexes.add(imgIndex + 1);
        }
        
        return newLoadedIndexes;
      });
    };
    
    loadAdjacentImages();
  }, [imgIndex, total, infinite]);

  // 自动播放效果
  useEffect(() => {
    if (!autoplay || total <= 1 || mouseIn) return;

    const timer = window.setInterval(() => {
      setImgIndex((prev) => {
        if (infinite) {
          return (prev + 1) % total;
        }
        return prev === total - 1 ? prev : prev + 1;
      });
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [autoplay, autoplayInterval, infinite, total, mouseIn]);

  return (
    <div 
      className={`relative w-full overflow-hidden group ${className}`}
      onMouseEnter={() => setMouseIn(true)}
      onMouseLeave={() => setMouseIn(false)}
      style={{ height: '400px' }} // 添加固定高度
    >
      {/** 图片容器 */}
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{
          transform: `translateX(-${imgIndex * 100}%)`,
        }}
      >
        {images.map((img, index) => (
          <div 
            key={index} 
            className="w-full h-full shrink-0"
            onClick={img.onClick}
          >
            <img
              src={
                loadedImageIndexes.has(index)
                  ? img.imgUrl
                  : "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
              }
              alt={img.alt ?? ""}
              className="w-full h-full object-cover cursor-pointer"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/** 左右箭头：鼠标悬停时显示 */}
      {showArrows && total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* 指示器 */}
      {showIndicators && total > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                imgIndex === index 
                  ? "bg-white scale-125" 
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;