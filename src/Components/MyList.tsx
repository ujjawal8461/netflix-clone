import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Movie } from "../types";
import { useNavigate } from "react-router-dom";

const base_url = "https://image.tmdb.org/t/p/original/";

const MyList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("myList") || "[]");
    setMovies(saved);
  }, []);

  const handleClick = (movie: Movie) => {
    navigate(`/watch/${movie.id}`);
  };

  const removeFromList = (e: React.MouseEvent, movie: Movie) => {
    e.stopPropagation();
    const updatedList = movies.filter((m) => m.id !== movie.id);
    localStorage.setItem("myList", JSON.stringify(updatedList));
    setMovies(updatedList);
  };

  return (
    <div className="bg-[#141414] min-h-screen text-white">
      <Header />
      
      <div className="pt-24 px-4 md:px-12 pb-12">
        <h1 className="text-3xl font-bold mb-8">My List</h1>
        
        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <div key={movie.id} className="relative group cursor-pointer transition-transform duration-300 hover:scale-105">
                <img
                  onClick={() => handleClick(movie)}
                  className="rounded-md w-full aspect-video object-cover"
                  src={`${base_url}${movie.backdrop_path || movie.poster_path}`}
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
            <p className="text-xl">You haven't added any titles to your list yet.</p>
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
