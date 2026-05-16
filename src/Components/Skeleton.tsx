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

export const SearchSkeleton: React.FC = () => (
  <div className="pt-28 px-4 md:px-12 pb-20 min-h-screen bg-[#111]">
    <div className="h-8 bg-gray-800 rounded w-64 mb-8 animate-pulse"></div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-12">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
        <div key={i} className="space-y-2">
          <div className="bg-gray-800 rounded-md animate-pulse w-full aspect-[2/3]"></div>
          <div className="h-4 bg-gray-800 rounded w-3/4 animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
);

