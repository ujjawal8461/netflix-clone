import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import requests from "../api/requests";
import YouTube, { YouTubePlayer } from "react-youtube";
// @ts-ignore
import movieTrailer from "movie-trailer";
import Row from "./Row";
import Header from "./Header";
import { Movie } from "../types";

const Watch: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [trailerUrl, setTrailerUrl] = useState<string | null>("");
  
  // Custom Player State
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const isTv = type === "tv";
        const response = await axios.get(
          isTv ? requests.fetchTvDetails(id!) : requests.fetchMovieDetails(id!)
        );
        const movieData = response.data;
        setMovie(movieData);
        
        const officialTrailer = movieData.videos?.results?.find(
          (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
        ) || movieData.videos?.results?.find(
          (vid: any) => vid.site === "YouTube"
        );

        if (officialTrailer) {
          setTrailerUrl(officialTrailer.key);
        } else {
          movieTrailer(movieData?.title || movieData?.name || "")
            .then((url: string) => {
              if (url) {
                const urlParams = new URLSearchParams(new URL(url).search);
                setTrailerUrl(urlParams.get("v"));
              } else {
                setTrailerUrl(null);
              }
            })
            .catch(() => setTrailerUrl(null));
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    }
    fetchData();
    window.scrollTo(0, 0);
  }, [id, type]);

  // Handle Controls Visibility
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  // Sync Progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (player && isPlaying) {
      interval = setInterval(async () => {
        const time = await player.getCurrentTime();
        setCurrentTime(time);
        const dur = await player.getDuration();
        setDuration(dur);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [player, isPlaying]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowRight") {
        skip(10);
      } else if (e.code === "ArrowLeft") {
        skip(-10);
      } else if (e.code === "KeyM") {
        toggleMute();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [player, isPlaying, isMuted]);

  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!player) return;
    if (isMuted) {
      player.unMute();
    } else {
      player.mute();
    }
    setIsMuted(!isMuted);
  };

  const skip = (seconds: number) => {
    if (!player) return;
    player.seekTo(currentTime + seconds, true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    player?.seekTo(time, true);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h > 0 ? h + ":" : ""}${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
  };

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1 as const,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
      disablekb: 1,
    },
  };

  if (!movie) return null;

  return (
    <div className="bg-[#111] min-h-screen text-white pb-20 select-none" onMouseMove={handleMouseMove}>
      <Header />
      
      {/* Video Player Section */}
      <div className="relative w-full h-[60vh] md:h-[85vh] bg-black group overflow-hidden">
        {trailerUrl ? (
          <div className="w-full h-full pointer-events-none">
            <YouTube 
              videoId={trailerUrl} 
              opts={opts} 
              className="w-full h-full scale-[1.35]" 
              onReady={(e) => setPlayer(e.target)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
        ) : (
          <div 
            className="w-full h-full bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-60" />
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4">Trailer Unavailable</h2>
                <a 
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent((movie.title || movie.name) + " trailer")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-opacity-80 transition-all flex items-center"
                >
                  Search on YouTube
                </a>
            </div>
          </div>
        )}
        
        {/* CUSTOM CONTROLS OVERLAY */}
        <div 
          className={`absolute inset-0 z-30 transition-opacity duration-500 bg-gradient-to-t from-black via-transparent to-black ${
            showControls ? "opacity-100" : "opacity-0 cursor-none"
          }`}
          onClick={togglePlay}
        >
          {/* Back Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); navigate(-1); }}
            className="absolute top-24 left-4 md:left-12 p-2 hover:scale-110 transition-transform"
          >
            <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          {/* Center Play/Pause Indicator (Optional but nice) */}
          {!isPlaying && (
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-20 h-20 bg-black bg-opacity-50 rounded-full flex items-center justify-center border-2 border-white">
                    <svg className="w-12 h-12 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                </div>
             </div>
          )}

          {/* Bottom Controls Bar */}
          <div 
            className="absolute bottom-0 left-0 right-0 p-4 md:p-8 space-y-4 bg-gradient-to-t from-black to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Seek Bar */}
            <div className="group/seek relative w-full h-1.5 bg-gray-600 rounded-full cursor-pointer">
                <input 
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div 
                    className="absolute top-0 left-0 h-full bg-red-600 rounded-full"
                    style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                />
                <div 
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full opacity-0 group-hover/seek:opacity-100 transition-opacity"
                    style={{ left: `${(currentTime / (duration || 1)) * 100}%`, transform: 'translate(-50%, -50%)' }}
                />
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 md:space-x-10">
                    <button onClick={togglePlay} className="hover:scale-110 transition-transform">
                        {isPlaying ? (
                            <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>

                    <div className="flex items-center space-x-6">
                        <button onClick={() => skip(-10)} className="hover:scale-110 transition-transform">
                            <svg className="w-7 h-7 md:w-9 md:h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                            </svg>
                        </button>
                        <button onClick={() => skip(10)} className="hover:scale-110 transition-transform">
                            <svg className="w-7 h-7 md:w-9 md:h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button onClick={toggleMute} className="hover:scale-110 transition-transform">
                            {isMuted || volume === 0 ? (
                                <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.895-4.21-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.414 0A5.982 5.982 0 0115 10a5.982 5.982 0 01-1.414 4.243 1 1 0 11-1.414-1.414A3.982 3.982 0 0013 10a3.982 3.982 0 00-1.414-2.828a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                        <div className="text-sm md:text-base font-mono">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <button className="hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m4 0h1m-7 4h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </button>
                    <button onClick={() => document.documentElement.requestFullscreen()} className="hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="md:col-span-2">
            <h1 className="text-4xl md:text-6xl font-black mb-6 drop-shadow-md">
                {movie.title || movie.name}
            </h1>
            
            <div className="flex items-center space-x-4 mb-8">
              <span className="text-green-500 font-bold text-lg">
                {Math.round((movie.vote_average || 0) * 10)}% Match
              </span>
              <span className="text-gray-400">
                {movie.release_date?.split("-")[0] || movie.first_air_date?.split("-")[0]}
              </span>
              <span className="border border-gray-600 px-2 py-0.5 text-xs text-gray-400 rounded uppercase tracking-widest font-bold">
                Ultra HD 4K
              </span>
            </div>

            <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-3xl">
              {movie.overview}
            </p>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6 pt-2">
            <div>
              <h4 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Genres</h4>
              <p className="text-gray-300 text-base">
                {movie.genres?.map((g: any) => g.name).join(", ")}
              </p>
            </div>
            
            <div>
                <h4 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Status</h4>
                <p className="text-gray-300 text-base">{movie.status || "Released"}</p>
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="mt-24 border-t border-gray-800 pt-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">More Like This</h2>
          <div className="-mx-4 md:-mx-12">
            <Row 
              key={id}
              Category_title="" 
              fetchUrl={movie.title ? requests.fetchRecommendations(id!) : requests.fetchTvRecommendations(id!)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;
