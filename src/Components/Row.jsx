import React, { useEffect, useState } from "react";
import axios from "axios";

function Row({ title }) {
  const API_KEY = "74b2bf9516944be552a12407fc7ba128";

  const getData = async () => {
    try {
      const responce = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
      );
      const movies = responce.data.results;
      movies.forEach((movie) => {
        console.log("Title:", movie.title);
        console.log("poster:", movie.poster_path);
        console.log("--------------");
      });
    } catch (error) {
      console.error("bhsi Dikkat aari he");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <h2>{title}</h2>
    </>
  );
}

export default Row;
