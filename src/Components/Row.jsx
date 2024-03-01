import React, { useEffect, useState } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

function Row({ Category_title, url, genre, isLargeRow }) {
  const API_KEY = "74b2bf9516944be552a12407fc7ba128";
  const URL = `${url}${API_KEY}${genre}`;

  const [MovieInfo, setMovieInfo] = useState([]);

  const getData = async () => {
    try {
      const responce = await axios.get(URL);
      const movies = responce.data.results;
      setMovieInfo(movies);
    } catch (error) {
      console.error("bhai Dikkat aari he");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const [trailerId, settrailerId] = useState("");

  const getVideoID = (movie_name) => {
    if (trailerId) {
      settrailerId("");
    } else {
      movieTrailer(`${movie_name}`).then((url) => {
        const videoTrailerId = extractVideoIdFromUrl(url);
        settrailerId(videoTrailerId);
      });
    }
  };
  function extractVideoIdFromUrl(url) {
    const videoIdRegex = /[?&]v=([^&#]*)/;
    const match = url.match(videoIdRegex);
    return match ? match[1] : null;
  }
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <>
      <h2 className="text-white text-2xl font-bold">{Category_title}</h2>
      <div className=" overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="my-4 flex gap-4 py-4 pr-4">
          {MovieInfo.map((movie) => (
            <img
              key={movie.id}
              src={`https://image.tmdb.org/t/p/w200/${
                isLargeRow ? movie.poster_path : movie.backdrop_path
              }`}
              alt={movie.title}
              className="object-cover rounded transition-transform duration-300 hover:scale-90"
              onClick={() => movie.title && getVideoID(movie.title)}
            />
          ))}
        </div>
      </div>
      {trailerId && <YouTube videoId={trailerId} opts={opts} />}
    </>
  );
}

export default Row;
