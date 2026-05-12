import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import YouTube from "react-youtube";
// @ts-ignore
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  original_name?: string;
  poster_path: string;
  backdrop_path: string;
}

interface RowProps {
  Category_title: string;
  fetchUrl: string;
  isLargeRow?: boolean;
}

const Row: React.FC<RowProps> = ({ Category_title, fetchUrl, isLargeRow }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [trailerUrl, setTrailerUrl] = useState<string | null>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(fetchUrl);
        setMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching row data:", error);
      }
    }
    fetchData();
  }, [fetchUrl]);

  const handleClick = (movie: Movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.title || movie?.name || movie?.original_name || "")
        .then((url: string) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error: any) => console.error("Error finding trailer:", error));
    }
  };

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1 as const,
    },
  };

  return (
    <div className="ml-4 md:ml-5 text-white mb-8">
      <h2 className="text-xl md:text-2xl font-bold mb-4">{Category_title}</h2>
      <div className="flex overflow-y-hidden overflow-x-scroll p-2 md:p-4 scrollbar-hide space-x-2 md:space-x-4">
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`cursor-pointer rounded-md transition-transform duration-300 hover:scale-105 md:hover:scale-110 object-cover ${
              isLargeRow ? "h-[200px] md:h-[250px] min-w-[140px] md:min-w-[170px]" : "h-[80px] md:h-[100px] min-w-[140px] md:min-w-[180px]"
            }`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name || movie.title}
          />
        ))}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
};

export default Row;
