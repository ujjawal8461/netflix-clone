import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { RowSkeleton } from "./Skeleton";
import { Movie } from "../types";

const base_url = "https://image.tmdb.org/t/p/original/";



interface RowProps {
  Category_title: string;
  fetchUrl?: string; // Optional if movies are passed directly
  isLargeRow?: boolean;
  moviesList?: Movie[]; // For "My List" or Search Results
}

const Row: React.FC<RowProps> = ({ Category_title, fetchUrl, isLargeRow, moviesList }) => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [myList, setMyList] = useState<number[]>([]);

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

    // Load "My List" IDs from LocalStorage for the icons
    const savedList = JSON.parse(localStorage.getItem("myList") || "[]");
    setMyList(savedList.map((m: any) => m.id));
  }, [fetchUrl, moviesList]);

  const handleClick = (movie: Movie) => {
    navigate(`/watch/${movie.id}`);
  };

  const toggleMyList = (e: React.MouseEvent, movie: Movie) => {
    e.stopPropagation();
    let currentList = JSON.parse(localStorage.getItem("myList") || "[]");
    const isSaved = currentList.some((m: any) => m.id === movie.id);

    if (isSaved) {
      currentList = currentList.filter((m: any) => m.id !== movie.id);
    } else {
      currentList.push(movie);
    }

    localStorage.setItem("myList", JSON.stringify(currentList));
    setMyList(currentList.map((m: any) => m.id));
    
    // If we are in the "My List" row, we might want to update the UI immediately
    if (Category_title === "My List") {
        setMovies(currentList);
    }
  };

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1 as const,
    },
  };

  if (!moviesList && movies.length === 0) return <RowSkeleton isLargeRow={isLargeRow} />;
  if (movies.length === 0 && Category_title === "My List") return null; // Don't show empty My List

  return (
    <div className="ml-4 md:ml-12 text-white mb-8 group/row">
      <div className="flex items-center justify-between pr-4 md:pr-12">
        <h2 className="text-xl md:text-2xl font-bold mb-4">{Category_title}</h2>
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
        {movies.map((movie) => (
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
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                 <p className="text-[10px] md:text-xs font-bold truncate">{movie.title || movie.name}</p>
              </div>
              <button
                onClick={(e) => toggleMyList(e, movie)}
                className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
              >
                {myList.includes(movie.id) ? (
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
    </div>
  );
};

export default Row;
