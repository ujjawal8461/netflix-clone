import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Movie } from "../types";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import requests from "../api/requests";
import { getPlayableCache, setPlayableCache } from "../utils";
import { useAuth } from "../context/AuthContext";

const base_url = "https://image.tmdb.org/t/p/original/";

const MyList: React.FC = () => {
  const { user, updateMyList } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.myList) {
      setMovies(user.myList);
    }
  }, [user?.myList]);

  // Handle filtering and background verification automatically
  useEffect(() => {
    const cache = getPlayableCache();
    const getMediaType = (m: Movie) => m.media_type || (m.title ? "movie" : "tv");
    
    const verified = movies.filter(m => {
      const key = `${getMediaType(m)}-${m.id}`;
      return cache[key] !== undefined && cache[key] !== false;
    });
    setFilteredMovies(verified);

    const unverified = movies.filter(m => {
      const val = cache[`${getMediaType(m)}-${m.id}`];
      return val === undefined || val === true;
    });
    
    if (unverified.length > 0 && !verifying) {
      setVerifying(true);
      const verifyBatch = async () => {
        for (const movie of unverified.slice(0, 15)) {
          const mType = getMediaType(movie);
          try {
            const fetchUrl = mType === "movie" 
              ? requests.fetchMovieDetails(movie.id) 
              : requests.fetchTvDetails(movie.id);
              
            const res = await axios.get(fetchUrl);
            const videos = res.data.videos?.results || [];
            const hasVideo = videos.length > 0;
            
            setPlayableCache(movie.id, mType, hasVideo ? videos[0].key : false);
            
            if (hasVideo) {
              setFilteredMovies(prev => {
                if (prev.some(m => m.id === movie.id)) return prev;
                return [...prev, movie];
              });
            }
          } catch (err) {
            setPlayableCache(movie.id, mType, false);
          }
          await new Promise(resolve => setTimeout(resolve, 150));
        }
        setVerifying(false);
      };
      verifyBatch();
    }
  }, [movies, verifying]);

  const handleClick = (movie: Movie) => {
    const mType = movie.media_type || (movie.title ? "movie" : "tv");
    navigate(`/watch/${mType}/${movie.id}`);
  };

  const removeFromList = (e: React.MouseEvent, movie: Movie) => {
    e.stopPropagation();
    updateMyList(movie);
  };

  return (
    <div className="bg-[#141414] min-h-screen text-white">
      <Header />
      
      <div className="pt-24 px-4 md:px-12 pb-12">
        <div className="flex items-center space-x-6 mb-8">
          <h1 className="text-3xl font-bold">My List</h1>
          {verifying && (
            <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin ml-1" title="Verifying playability..." />
          )}
        </div>
        
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredMovies.map((movie) => (
              <div key={movie.id} className="relative group cursor-pointer transition-transform duration-300 hover:scale-105">
                <img
                  onClick={() => handleClick(movie)}
                  className="rounded-md w-full aspect-[2/3] object-cover"
                  src={`${base_url}${movie.poster_path || movie.backdrop_path}`}
                  alt={movie.name || movie.title}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                   <button 
                    onClick={(e) => removeFromList(e, movie)}
                    className="bg-white text-black p-2 rounded-full hover:bg-red-600 hover:text-white transition-colors"
                   >
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                     </svg>
                   </button>
                </div>
                <div className="mt-2 text-sm font-medium truncate">
                   {movie.title || movie.name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
            <p className="text-xl">You haven't added any playable titles to your list yet.</p>
            <button 
              onClick={() => navigate("/")}
              className="mt-4 px-6 py-2 border border-gray-500 hover:border-white hover:text-white transition-all"
            >
              Browse Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyList;
