import type React from "react";

const Footer: React.FC = () => {
    return (
        <>
        {/* 页脚或底部内容 */}
        <div className="text-center py-8 border-t bg-gray-900 border-gray-700 mt-8">
          <p className="text-gray-200 text-base md:text-lg mb-2">
            欢迎访问我们的在线书店，发现更多精彩图书
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 md:gap-6">
            <a href="/about" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">关于我们</a>
            <span className="text-gray-600">•</span>
            <a href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">联系我们</a>
            <span className="text-gray-600">•</span>
            <a href="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">隐私政策</a>
            <span className="text-gray-600">•</span>
            <a href="/terms" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">服务条款</a>
            <span className="text-gray-600">•</span>
            <a href="/help" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">帮助中心</a>
          </div>
          <p className="text-gray-400 text-sm mt-6">
            © 2024 在线书店 版权所有
          </p>
        </div>
        </>
    )
}

export default Footer;