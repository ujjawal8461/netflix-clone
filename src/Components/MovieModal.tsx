import React from "react";
import { Movie } from "../types";
import { useNavigate } from "react-router-dom";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-fadeIn">
      <div className="absolute inset-0 bg-black bg-opacity-80" onClick={onClose} />
      
      <div className="relative bg-[#181818] w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl animate-scaleIn overflow-y-auto max-h-[90vh] scrollbar-hide">
        {/* Header/Banner Area */}
        <div 
          className="relative h-64 md:h-96 bg-cover bg-center"
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-[#181818] rounded-full p-2 hover:bg-white hover:text-black transition-all"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          <div className="absolute bottom-8 left-8 right-8">
            <h2 className="text-2xl md:text-5xl font-black mb-6 drop-shadow-lg text-white">
                {movie.title || movie.name}
            </h2>
            <div className="flex space-x-4">
              <button 
                onClick={() => {
                  onClose();
                  navigate(`/watch/${movie.media_type || (movie.title ? 'movie' : 'tv')}/${movie.id}`);
                }}
                className="bg-white text-black px-8 py-2 rounded font-bold hover:bg-opacity-80 transition-all flex items-center"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Play
              </button>
            </div>
          </div>
        </div>

        {/* Info Area */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center space-x-3 text-sm">
                <span className="text-green-500 font-bold">{Math.round((movie.vote_average || 0) * 10)}% Match</span>
                <span className="text-gray-400">{movie.release_date?.split("-")[0] || movie.first_air_date?.split("-")[0]}</span>
                <span className="border border-gray-600 px-1 text-[10px] rounded">HD</span>
            </div>
            <p className="text-lg leading-relaxed">{movie.overview}</p>
          </div>
          
          <div className="space-y-4 text-sm">
            <div>
              <span className="text-gray-500">Genres: </span>
              <span>Action, Drama, Thriller</span> {/* Placeholder as genres aren't in search/list usually */}
            </div>
            <div>
              <span className="text-gray-500">This movie is: </span>
              <span>Exciting, Suspenseful, Gritty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
