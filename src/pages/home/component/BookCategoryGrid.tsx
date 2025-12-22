import React from "react";
import "font-awesome/css/font-awesome.min.css";

interface Category {
  id: number;
  title: string;
  icon: string; // Font Awesome class
  onClick?: () => void;
}

const categories: Category[] = [
  { id: 1, title: "文学", icon: "fa-book", onClick: () => {
    console.log(1)
  } },
  { id: 2, title: "历史", icon: "fa-history" },
  { id: 3, title: "科学", icon: "fa-flask" },
  { id: 4, title: "艺术", icon: "fa-paint-brush" },
  { id: 5, title: "商业", icon: "fa-briefcase" },
  { id: 6, title: "教育", icon: "fa-graduation-cap" },
  { id: 7, title: "更多分类", icon: "fa-ellipsis-h" },
];

const BookCategoryGrid: React.FC = () => {
  return (
    <section className="w-full">
      {/* 标题 */}
      <h2 className="mb-6 text-center text-xl font-semibold text-gray-900">
        图书分类
      </h2>

      {/* 分类网格 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-7">
        {categories.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className="
            flex flex-col items-center gap-3
            rounded-xl bg-gray-100/90 p-4 
            hover:shadow-md 
            hover:-translate-y-0.5
            transition-all duration-300 ease-in-out
            "
          >
            {/* 图标圆 */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <i
                className={`fa ${item.icon} text-blue-500`}
                aria-hidden="true"
              />
            </div>

            {/* 文本 */}
            <span className="text-sm font-medium text-gray-900">
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default BookCategoryGrid;
