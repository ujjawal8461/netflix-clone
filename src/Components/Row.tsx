import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { RowSkeleton } from "./Skeleton";
import { Movie } from "../types";
import { getPlayableCache, setPlayableCache } from "../utils";
import requests from "../api/requests";
import { useAuth } from "../context/AuthContext";
import MovieModal from "./MovieModal";
import YouTube from "react-youtube";

const base_url = "https://image.tmdb.org/t/p/w500/";

interface RowProps {
  Category_title: string;
  fetchUrl?: string; 
  isLargeRow?: boolean;
  moviesList?: Movie[];
}

const MovieCard = React.memo<{ 
  movie: Movie; 
  isLargeRow?: boolean; 
  onPlayClick: (movie: Movie) => void;
  toggleMyList: (e: React.MouseEvent, movie: Movie) => void;
  isAdded: boolean;
}>(({ movie, isLargeRow, onPlayClick, toggleMyList, isAdded }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);
  const navigate = useNavigate();
  const cache = getPlayableCache();
  const mType = movie.media_type || (movie.title ? "movie" : "tv");
  const videoKey = cache[`${mType}-${movie.id}`];

  useEffect(() => {
    let timeout: any;
    if (isHovered) {
      console.log(`[DEBUG] Hover started for: ${movie.title || movie.name}`);
      if (typeof videoKey === "string") {
        console.log(`[DEBUG] Video key found: ${videoKey}. Setting play timeout...`);
        timeout = setTimeout(() => {
          console.log(`[DEBUG] Timeout reached. Setting shouldPlay to true for: ${movie.title || movie.name}`);
          setShouldPlay(true);
        }, 600);
      } else {
        console.log(`[DEBUG] No video key in cache yet for: ${movie.title || movie.name}. (videoKey: ${videoKey})`);
      }
    } else {
      setShouldPlay(false);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isHovered, videoKey, movie.id, movie.title, movie.name]);

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      mute: 1,
      origin: window.location.origin,
      enablejsapi: 1,
      widget_referrer: window.location.origin,
    },
    host: 'https://www.youtube-nocookie.com',
  };

  return (
    <div 
      className={`relative flex-shrink-0 transition-all duration-300 z-10 ${
        isHovered ? "scale-125 z-[60] mx-4" : "scale-100"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative overflow-hidden rounded-md shadow-lg bg-[#181818] transition-all duration-300 ${
        isHovered ? (isLargeRow ? "w-[240px] md:w-[280px]" : "w-[240px] md:w-[300px]") : (isLargeRow ? "h-[200px] md:h-[250px] w-[140px] md:w-[170px]" : "h-[80px] md:h-[100px] w-[140px] md:w-[180px]")
      }`}>
        {/* Top Section: Image or Video */}
        <div className={`relative w-full overflow-hidden ${isHovered ? "aspect-video" : "h-full"}`}>
          {shouldPlay && typeof videoKey === "string" ? (
            <div className="absolute inset-0 w-full h-full pointer-events-none">
              <YouTube 
                videoId={videoKey} 
                opts={opts} 
                className="absolute top-[-30%] left-[-10%] w-[120%] h-[160%]"
                onReady={(event: any) => {
                  console.log(`[DEBUG] YouTube Player Ready for: ${movie.title || movie.name}`);
                  try {
                    event.target.mute();
                    const playPromise = event.target.playVideo();
                    // YouTube API sometimes returns a promise for playVideo in modern browsers
                    if (playPromise && typeof playPromise.catch === 'function') {
                      playPromise.catch((err: any) => {
                        console.error(`[DEBUG] playVideo() promise rejected for ${movie.title || movie.name}:`, err);
                      });
                    }
                  } catch (e) {
                    console.error(`[DEBUG] Error in onReady for ${movie.title || movie.name}:`, e);
                  }
                }}
                onPlay={() => console.log(`[DEBUG] YouTube Player STARTED playing: ${movie.title || movie.name}`)}
                onStateChange={(e: any) => {
                    console.log(`[DEBUG] YouTube Player State Change for ${movie.title || movie.name}:`, e.data);
                    // 1 is playing, 3 is buffering, -1 is unstarted, 2 is paused, 0 is ended
                    if (e.data === -1) console.log(`[DEBUG] Player state is UNSTARTED (-1)`);
                    if (e.data === 2) console.log(`[DEBUG] Player state is PAUSED (2) - Likely blocked by browser`);
                }}
                onEnd={() => {
                  console.log(`[DEBUG] YouTube Player Ended: ${movie.title || movie.name}`);
                  setShouldPlay(false);
                }}
                onError={(e: any) => {
                  console.error(`[DEBUG] YouTube Player Error for ${movie.title || movie.name}:`, e.data);
                  setShouldPlay(false);
                }}
              />
            </div>
          ) : (
            <div className="relative w-full h-full">
              <img
                onClick={() => onPlayClick(movie)}
                className="w-full h-full object-cover cursor-pointer"
                loading="lazy"
                src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                alt={movie.name || movie.title}
              />
              {movie.progress !== undefined && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#555] overflow-hidden">
                  <div 
                    className="h-full bg-[#e50914]" 
                    style={{ width: `${Math.min(100, Math.max(0, movie.progress))}%` }}
                  />
                </div>
              )}
            </div>
          )}
          
          {isHovered && (
            <div className="absolute top-2 right-2 flex space-x-2">
                <button
                    onClick={(e) => toggleMyList(e, movie)}
                    className="bg-black bg-opacity-60 rounded-full p-1.5 hover:bg-red-600 transition-colors"
                >
                    {isAdded ? (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    ) : (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    )}
                </button>
            </div>
          )}
        </div>

        {/* Bottom Section: Info (Only on Hover) */}
        {isHovered && (
          <div className="p-3 bg-[#181818]">
            <div className="flex items-center space-x-2 mb-2">
              <button 
                onClick={() => navigate(`/watch/${mType}/${movie.id}`)}
                className="bg-white text-black rounded-full p-1.5 hover:bg-opacity-80 transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                onClick={() => onPlayClick(movie)}
                className="bg-transparent border border-gray-500 text-white rounded-full p-1.5 hover:border-white transition-all"
              >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                 </svg>
              </button>
            </div>
            <p className="text-[10px] md:text-xs font-bold text-white truncate mb-1">{movie.title || movie.name}</p>
            <div className="flex items-center space-x-2">
                <span className="text-[8px] text-green-500 font-bold">{Math.round((movie.vote_average || 0) * 10)}% Match</span>
                <span className="text-[8px] text-gray-400 border border-gray-600 px-1 rounded">HD</span>
            </div>
            {movie.progress !== undefined && (
              <div className="w-full h-1 bg-[#555] rounded-full mt-2.5 overflow-hidden">
                <div 
                  className="h-full bg-[#e50914]" 
                  style={{ width: `${Math.min(100, Math.max(0, movie.progress))}%` }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

const Row: React.FC<RowProps> = ({ Category_title, fetchUrl, isLargeRow, moviesList }) => {
  const { user, profile, updateMyList } = useAuth();
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
    const verified = movies.filter(m => cache[`${getMediaType(m)}-${m.id}`] !== undefined && cache[`${getMediaType(m)}-${m.id}`] !== false);
    setFilteredMovies(verified);

    const unverified = movies.filter(m => {
      const val = cache[`${getMediaType(m)}-${m.id}`];
      return val === undefined || val === true;
    });
    
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
            const videos = res.data.videos?.results || [];
            const trailer = videos.find((v: any) => v.type === "Trailer" && v.site === "YouTube") || videos[0];
            
            const videoKey = trailer ? trailer.key : false;
            setPlayableCache(movie.id, mType, videoKey);
            
            if (videoKey) {
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
    <div className="ml-4 md:ml-12 text-white mb-12 group/row relative">
      <div className="flex items-center justify-between pr-4 md:pr-12 relative z-20">
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

      <div className="flex overflow-y-visible overflow-x-scroll p-4 md:p-8 -m-4 md:-m-8 scrollbar-hide space-x-2 md:space-x-4 min-h-[150px] md:min-h-[200px]">
        {filteredMovies.map((movie) => (
          movie.backdrop_path && movie.poster_path && (
            <MovieCard 
              key={movie.id}
              movie={movie}
              isLargeRow={isLargeRow}
              onPlayClick={handleClick}
              toggleMyList={toggleMyList}
              isAdded={((typeof profile === 'object' && profile !== null && 'myList' in profile) ? profile.myList : user?.myList)?.some((m: any) => m.id === movie.id) || false}
            />
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
