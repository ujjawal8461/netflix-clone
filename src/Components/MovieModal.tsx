import React, { useEffect, useState } from "react";
import { Movie } from "../types";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import requests from "../api/requests";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const navigate = useNavigate();
  const [details, setDetails] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        const type = movie.media_type || (movie.title ? "movie" : "tv");
        const fetchUrl = type === "movie" 
          ? requests.fetchMovieDetails(movie.id) 
          : requests.fetchTvDetails(movie.id);
          
        const response = await axios.get(fetchUrl);
        setDetails(response.data);
      } catch (error) {
        console.error("Error fetching modal details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [movie.id, movie.media_type, movie.title]);

  const movieGenres = details?.genres?.map(g => g.name).join(", ") || "Action, Drama";
  
  // Create some dynamic keywords based on genres if keywords aren't available
  const getKeywords = () => {
    if (!details?.genres) return "Exciting, Suspenseful, Gritty";
    const keywords = details.genres.slice(0, 3).map(g => {
      if (g.name === "Action") return "Adrenaline-pumping";
      if (g.name === "Drama") return "Emotional";
      if (g.name === "Comedy") return "Witty";
      if (g.name === "Horror") return "Chilling";
      if (g.name === "Science Fiction") return "Mind-bending";
      return g.name;
    });
    return keywords.join(", ");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-fadeIn">
      <div className="absolute inset-0 bg-black bg-opacity-80" onClick={onClose} />
      
      <div className="relative bg-[#181818] w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl animate-scaleIn overflow-y-auto max-h-[90vh] scrollbar-hide">
        {/* Header/Banner Area */}
        <div 
          className="relative h-64 md:h-[500px] bg-cover bg-center"
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-[#181818] rounded-full p-2 hover:bg-white hover:text-black transition-all z-20"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          <div className="absolute bottom-12 left-8 right-8">
            <h2 className="text-3xl md:text-6xl font-black mb-8 drop-shadow-lg text-white">
                {movie.title || movie.name}
            </h2>
            <div className="flex space-x-4">
              <button 
                onClick={() => {
                  onClose();
                  navigate(`/watch/${movie.media_type || (movie.title ? 'movie' : 'tv')}/${movie.id}`);
                }}
                className="bg-white text-black px-10 py-3 rounded font-bold hover:bg-opacity-80 transition-all flex items-center text-lg shadow-lg"
              >
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Play
              </button>
            </div>
          </div>
        </div>

        {/* Info Area */}
        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-white">
          <div className="md:col-span-2 space-y-8">
            <div className="flex items-center space-x-4 text-lg">
                <span className="text-green-500 font-bold">{Math.round((movie.vote_average || 0) * 10)}% Match</span>
                <span className="text-gray-400">{movie.release_date?.split("-")[0] || movie.first_air_date?.split("-")[0]}</span>
                <span className="border border-gray-600 px-2 py-0.5 text-xs font-bold rounded uppercase">HD</span>
                {details?.status && <span className="text-gray-400 text-sm">{details.status}</span>}
            </div>
            
            {loading ? (
              <div className="space-y-4">
                <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3 animate-pulse"></div>
              </div>
            ) : (
              <p className="text-xl leading-relaxed text-gray-200">{movie.overview || details?.overview}</p>
            )}
          </div>
          
          <div className="space-y-6 text-base">
            <div>
              <span className="text-gray-500 font-medium">Genres: </span>
              <span className="text-gray-200">
                {loading ? "..." : movieGenres}
              </span>
            </div>
            <div>
              <span className="text-gray-500 font-medium">This movie is: </span>
              <span className="text-gray-200">
                {loading ? "..." : getKeywords()}
              </span>
            </div>
            {details?.budget ? (
               <div>
                  <span className="text-gray-500 font-medium">Budget: </span>
                  <span className="text-gray-200">${(details.budget / 1000000).toFixed(1)}M</span>
               </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;

