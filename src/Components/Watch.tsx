import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import requests from "../api/requests";
import YouTube from "react-youtube";
// @ts-ignore
import movieTrailer from "movie-trailer";
import Row from "./Row";
import Header from "./Header";
import { Movie } from "../types";

const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [trailerUrl, setTrailerUrl] = useState<string | null>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(requests.fetchMovieDetails(id!));
        const movieData = response.data;
        setMovie(movieData);
        
        // 1. Try to find official trailer from TMDB videos
        const officialTrailer = movieData.videos?.results?.find(
          (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
        ) || movieData.videos?.results?.find(
          (vid: any) => vid.site === "YouTube"
        );

        if (officialTrailer) {
          setTrailerUrl(officialTrailer.key);
        } else {
          // 2. Fallback to movie-trailer search if no official video found
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
  }, [id]);

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1 as const,
      controls: 1,
      modestbranding: 1,
      rel: 0,
    },
  };

  if (!movie) return null;

  return (
    <div className="bg-[#111] min-h-screen text-white pb-20">
      <Header />
      
      {/* Video Player Section - Immersive Height */}
      <div className="relative w-full h-[60vh] md:h-[80vh] bg-black group">
        {trailerUrl ? (
          <YouTube 
            videoId={trailerUrl} 
            opts={opts} 
            className="w-full h-full" 
          />
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
                <h2 className="text-2xl font-bold">Trailer Unavailable</h2>
            </div>
          </div>
        )}
        
        {/* Back Button Overlay */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-24 left-4 md:left-12 z-20 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-80 transition-all"
        >
          <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
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

            {movie.budget ? (
              <div>
                <h4 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Budget</h4>
                <p className="text-gray-300 text-base">${movie.budget.toLocaleString()}</p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="mt-24 border-t border-gray-800 pt-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">More Like This</h2>
          <div className="-mx-4 md:-mx-12">
            <Row 
              Category_title="" 
              fetchUrl={requests.fetchRecommendations(id!)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;
