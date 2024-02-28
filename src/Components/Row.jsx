import React, { useEffect, useState } from "react";
import axios from "axios";

function Row({ Category_title, url, genre }) {
  const API_KEY = "74b2bf9516944be552a12407fc7ba128";
  const URL = `${url}${API_KEY}${genre}`;

  const [MovieInfo, setMovieInfo] = useState([]);

  const getData = async () => {
    try {
      const responce = await axios.get(URL);
      const movies = responce.data.results;
      console.log(MovieInfo);
      setMovieInfo(movies);
    } catch (error) {
      console.error("bhai Dikkat aari he");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <h2 className="text-white text-2xl font-bold mb-2">{Category_title}</h2>
      <div className="my-8 overflow-x-auto whitespace-nowrap scrollbar-hidden">
        <div className="flex gap-4 py-4 pr-4">
          {MovieInfo.map((movie) => (
            <img
              key={movie.id}
              src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
              alt={movie.title}
              className="w-24 h-36 object-cover rounded"
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Row;
