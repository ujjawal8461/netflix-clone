import axios from "axios";
import React, { useEffect, useState } from "react";

function Banner() {
  const url =
    "https://api.themoviedb.org/3/movie/popular?api_key=74b2bf9516944be552a12407fc7ba128";

  const [movieBanners, setmovieBanners] = useState([]);
  const getBannerData = async () => {
    try {
      const responce = await axios.get(url);
      const data = responce.data.results;
      setmovieBanners(data);
    } catch (error) {
      console.error("Bhai Banner lagane me dikkat aari");
    }
  };

  const num = Math.floor(Math.random() * 20);
  useEffect(() => {
    getBannerData();
  }, []);

  return (
    <>
      <div
        className="bg-cover h-[500px] text-white pl-14 pt-40"
        style={{
          backgroundImage: `url(${
            movieBanners.length > 0
              ? `https://image.tmdb.org/t/p/original/${movieBanners[num]?.backdrop_path}`
              : ""
          })`,
        }}
      >
        {movieBanners.length > 0 && (
          <>
            <div className="absolute inset-0 bg-black bg-cover h-[550px] opacity-50"></div>
            <div className="relative z-10 text-white w-1/2 my-auto ">
              <h1 className="font-bold text-5xl">{movieBanners[num]?.title}</h1>
              <p className="text-lg text-gray-300 mt-4">
                {movieBanners[num]?.overview}
              </p>
              <div className="mt-6 flex items-center ">
                <button className="bg-transparent border-2 text-white font-semibold px-6 py-3 mr-4 rounded hover:bg-red-700 transition duration-300">
                  Play
                </button>
                <button className="bg-gray-800 text-white font-semibold px-6 py-3 rounded hover:bg-gray-900 transition duration-300">
                  My List
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Banner;
