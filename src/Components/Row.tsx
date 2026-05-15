import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { RowSkeleton } from "./Skeleton";
import { Movie } from "../types";
import { getPlayableCache, setPlayableCache } from "../utils";
import requests from "../api/requests";
import { useAuth } from "../context/AuthContext";
import MovieModal from "./MovieModal";

const base_url = "https://image.tmdb.org/t/p/original/";

interface RowProps {
  Category_title: string;
  fetchUrl?: string; 
  isLargeRow?: boolean;
  moviesList?: Movie[];
}

const Row: React.FC<RowProps> = ({ Category_title, fetchUrl, isLargeRow, moviesList }) => {
  const { user, updateMyList } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [verifying, setVerifying] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (moviesList) {
      setMovies(moviesList);
    } else if (fetchUrl) {
      async function fetchData() {
        try {
          const response = await axios.get(fetchUrl!);
          setMovies(response.data.results);
        } catch (error) {
          console.error("Error fetching row data:", error);
        }
      }
      fetchData();
    }
  }, [fetchUrl, moviesList]);

  // Handle filtering and background verification automatically
  useEffect(() => {
    const cache = getPlayableCache();
    
    // Helper to determine media type
    const getMediaType = (m: Movie) => m.media_type || (m.title ? "movie" : "tv");

    // Always show what we know is verified
    const verified = movies.filter(m => cache[`${getMediaType(m)}-${m.id}`] === true);
    setFilteredMovies(verified);

    const unverified = movies.filter(m => cache[`${getMediaType(m)}-${m.id}`] === undefined);
    
    if (unverified.length > 0 && !verifying) {
      setVerifying(true);
      const verifyBatch = async () => {
        for (const movie of unverified.slice(0, 10)) {
          const mType = getMediaType(movie);
          try {
            const fetchUrl = mType === "movie" 
              ? requests.fetchMovieDetails(movie.id) 
              : requests.fetchTvDetails(movie.id);
              
            const res = await axios.get(fetchUrl);
            const hasVideo = (res.data.videos?.results?.length || 0) > 0;
            setPlayableCache(movie.id, mType, hasVideo);
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
    setSelectedMovie(movie);
  };

  const toggleMyList = (e: React.MouseEvent, movie: Movie) => {
    e.stopPropagation();
    updateMyList(movie);
  };

  const isLoading = !moviesList && movies.length === 0;
  const isVerifyingInitial = !moviesList && filteredMovies.length === 0 && verifying;

  if (isLoading || isVerifyingInitial) return <RowSkeleton isLargeRow={isLargeRow} />;
  
  // If we have movies but none are playable and we're done verifying, hide the row
  if (movies.length > 0 && filteredMovies.length === 0 && !verifying && Category_title !== "My List") return null;
  // Special case for My List
  if (movies.length === 0 && Category_title === "My List") return null;

  return (
    <div className="ml-4 md:ml-12 text-white mb-8 group/row">
      <div className="flex items-center justify-between pr-4 md:pr-12">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl md:text-2xl font-bold mb-4">{Category_title}</h2>
          {verifying && (
            <div className="mb-4 w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin ml-1" title="Verifying playability..." />
          )}
        </div>
        {Category_title === "My List" && (
           <span 
            onClick={() => navigate("/mylist")}
            className="text-xs md:text-sm text-gray-400 hover:text-white cursor-pointer transition-colors"
           >
             View All
           </span>
        )}
      </div>
      <div className="flex overflow-y-hidden overflow-x-scroll p-2 md:p-4 scrollbar-hide space-x-2 md:space-x-4">
        {filteredMovies.map((movie) => (
          movie.backdrop_path && movie.poster_path && (
            <div key={movie.id} className="relative group flex-shrink-0">
              <img
                onClick={() => handleClick(movie)}
                className={`cursor-pointer rounded-md transition-transform duration-300 group-hover:scale-105 md:group-hover:scale-110 object-cover ${
                  isLargeRow ? "h-[200px] md:h-[250px] w-[140px] md:w-[170px]" : "h-[80px] md:h-[100px] w-[140px] md:w-[180px]"
                }`}
                src={`${base_url}${
                  isLargeRow ? movie.poster_path : movie.backdrop_path
                }`}
                alt={movie.name || movie.title}
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-col justify-end">
                 <p className="text-[10px] md:text-xs font-bold truncate text-white">{movie.title || movie.name}</p>
                 <div className="flex items-center space-x-1 mt-1">
                    <span className="text-[8px] text-green-500 font-bold">{Math.round((movie.vote_average || 0) * 10)}% Match</span>
                 </div>
              </div>
              <button
                onClick={(e) => toggleMyList(e, movie)}
                className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
              >
                {user?.myList?.some((m: any) => m.id === movie.id) ? (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </button>
            </div>
          )
        ))}
      </div>
      
      {selectedMovie && (
        <MovieModal 
            movie={selectedMovie} 
            onClose={() => setSelectedMovie(null)} 
        />
      )}
    </div>
  );
};

export default Row;
