import React from "react";

export const BannerSkeleton: React.FC = () => (
  <div className="relative h-[450px] md:h-[500px] bg-gray-800 animate-pulse">
    <div className="ml-4 md:ml-8 pt-[140px]">
      <div className="h-10 md:h-12 bg-gray-700 rounded w-1/3 mb-4"></div>
      <div className="flex space-x-4 mb-4">
        <div className="h-10 bg-gray-700 rounded w-24"></div>
        <div className="h-10 bg-gray-700 rounded w-24"></div>
      </div>
      <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-1/3"></div>
    </div>
  </div>
);

export const RowSkeleton: React.FC<{ isLargeRow?: boolean }> = ({ isLargeRow }) => (
  <div className="ml-4 md:ml-5 mb-8">
    <div className="h-6 bg-gray-800 rounded w-40 mb-4 animate-pulse"></div>
    <div className="flex space-x-4 overflow-hidden">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className={`bg-gray-800 rounded-md animate-pulse flex-shrink-0 ${
            isLargeRow ? "h-[200px] md:h-[250px] w-[140px] md:w-[170px]" : "h-[80px] md:h-[100px] w-[140px] md:w-[180px]"
          }`}
        ></div>
      ))}
    </div>
  </div>
);
