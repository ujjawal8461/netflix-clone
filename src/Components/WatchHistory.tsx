import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const base_url = "https://image.tmdb.org/t/p/w300/";

const WatchHistory: React.FC = () => {
  const { user, profile, deleteWatchProgress, isGuest } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isGuest) {
      navigate("/");
      return;
    }
    const watchHistory = (typeof profile === 'object' && profile !== null && 'watchHistory' in profile ? profile.watchHistory : user?.watchHistory) || [];
    setHistory(watchHistory);
  }, [user, profile, navigate]);

  const handleClick = (item: any) => {
    navigate(`/watch/${item.mediaType || "movie"}/${item.movieId}`);
  };

  const handleDelete = async (e: React.MouseEvent, movieId: number) => {
    e.stopPropagation();
    await deleteWatchProgress(movieId);
  };

  const getGroupLabel = (dateString: string) => {
    if (!dateString) return "Today";
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const dDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    const diffTime = dToday.getTime() - dDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (dDate.getTime() === dToday.getTime()) {
      return "Today";
    } else if (dDate.getTime() === dYesterday.getTime()) {
      return "Yesterday";
    } else if (diffDays <= 7) {
      return "This Week";
    } else {
      return date.toLocaleDateString([], { month: 'long', year: 'numeric' });
    }
  };

  // Group history items by chronological time groups
  const groupedHistory = [...history].reverse().reduce((acc: { [key: string]: any[] }, item: any) => {
    const label = getGroupLabel(item.lastWatched);
    if (!acc[label]) acc[label] = [];
    acc[label].push(item);
    return acc;
  }, {});

  // Order of group rendering
  const sortedGroupKeys = Object.keys(groupedHistory).sort((a, b) => {
    const orderMap: { [key: string]: number } = { "Today": 1, "Yesterday": 2, "This Week": 3 };
    const valA = orderMap[a] || 99;
    const valB = orderMap[b] || 99;
    return valA - valB;
  });

  return (
    <div className="bg-[#141414] min-h-screen text-white font-sans">
      <Header />
      
      <div className="pt-24 px-4 md:px-12 pb-12">
        <div className="flex items-center justify-between mb-8 border-b border-neutral-800 pb-4">
          <h1 className="text-3xl font-bold">Watch History</h1>
          {history.length > 0 && (
            <p className="text-sm text-neutral-400">
              {history.length} {history.length === 1 ? "title" : "titles"} watched
            </p>
          )}
        </div>

        {history.length > 0 ? (
          <div className="space-y-12">
            {sortedGroupKeys.map((groupKey) => (
              <div key={groupKey} className="space-y-4">
                <h2 className="text-xl font-semibold text-neutral-300 border-l-4 border-red-600 pl-3">
                  {groupKey}
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {groupedHistory[groupKey].map((item) => {
                    const progress = (item.timestamp / (item.duration || 1)) * 100;
                    return (
                      <div 
                        key={item.movieId} 
                        className="relative group cursor-pointer transition-transform duration-300 hover:scale-105 rounded-md overflow-hidden bg-neutral-900 shadow-lg"
                        onClick={() => handleClick(item)}
                      >
                        {/* Poster Image */}
                        <div className="aspect-[2/3] w-full relative">
                          <img
                            className="w-full h-full object-cover rounded-t-md"
                            src={`${base_url}${item.posterPath}`}
                            alt={item.title || item.name}
                            onError={(e: any) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=300";
                            }}
                          />
                          
                          {/* Play overlay on hover */}
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>

                          {/* Delete activity overlay icon */}
                          <button
                            onClick={(e) => handleDelete(e, item.movieId)}
                            className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-70 hover:bg-red-600 rounded-full text-white transition-colors duration-200 z-20"
                            title="Remove from history"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>

                          {/* Red progress bar at the bottom of the poster */}
                          <div className="absolute bottom-0 left-0 w-full h-1 bg-[#555] overflow-hidden">
                            <div 
                              className="h-full bg-[#e50914]" 
                              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                            />
                          </div>
                        </div>

                        {/* Title and metadata box under poster */}
                        <div className="p-3 bg-[#181818]">
                          <p className="text-xs font-bold text-white truncate mb-1">
                            {item.title || item.name}
                          </p>
                          <div className="flex justify-between items-center text-[10px] text-gray-400">
                            <span className="capitalize">{item.mediaType}</span>
                            <span>{Math.round(progress)}% watched</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
            <svg className="w-16 h-16 text-neutral-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-xl">Your watch history is empty.</p>
            <button 
              onClick={() => navigate("/")}
              className="mt-6 px-6 py-2 border border-gray-600 rounded text-sm text-gray-300 hover:text-white hover:border-white hover:bg-white hover:bg-opacity-5 transition-all"
            >
              Browse Shows & Movies
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchHistory;
