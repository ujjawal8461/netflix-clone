import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import requests from "../api/requests";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  original_name?: string;
  backdrop_path: string;
  overview: string;
}

const Banner: React.FC = () => {
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(requests.fetchNetflixOriginals);
        const data = response.data.results;
        const randomIndex = Math.floor(Math.random() * data.length);
        setMovie(data[randomIndex]);
      } catch (error) {
        console.error("Error fetching banner data:", error);
      }
    }
    fetchData();
  }, []);

  if (!movie) return null;

  function truncate(str: string, n: number) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  return (
    <header
      className="relative h-[450px] md:h-[500px] text-white object-contain"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
        backgroundPosition: "center center",
      }}
    >
      <div className="ml-4 md:ml-8 pt-[100px] md:pt-[140px] h-[190px]">
        <h1 className="text-3xl md:text-5xl font-extrabold pb-[0.3rem]">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>

        <div className="flex space-x-2 md:space-x-4 mt-4">
          <button className="cursor-pointer text-white outline-none border-none font-bold rounded-sm px-6 md:px-8 py-2 bg-gray-900 bg-opacity-50 hover:bg-white hover:text-black transition-all duration-200 text-sm md:text-base">
            Play
          </button>
          <button className="cursor-pointer text-white outline-none border-none font-bold rounded-sm px-6 md:px-8 py-2 bg-gray-900 bg-opacity-50 hover:bg-white hover:text-black transition-all duration-200 text-sm md:text-base">
            My List
          </button>
        </div>

        <h1 className="w-full md:w-[45rem] leading-[1.3] pt-4 text-xs md:text-sm max-w-[90%] md:max-w-[360px] h-[80px]">
          {truncate(movie?.overview, 150)}
        </h1>
      </div>

      <div className="h-[7.4rem] bg-gradient-to-t from-black via-transparent to-transparent absolute bottom-0 w-full" />
    </header>
  );
};

export default Banner;
