import React from "react";
import Header from "./Components/Header";
import Row from "./Components/Row";

// api key : 74b2bf9516944be552a12407fc7ba128

// https://api.themoviedb.org/3/movie/popular?api_key=74b2bf9516944be552a12407fc7ba128

function App() {
  return (
    <>
      <Header />
      <Row title="NETFLIX ORIGINALS" />
      {/* <Row title="Trending Now" />
      <Row title="Top Rated" />
      <Row title="Most Popular" /> */}
    </>
  );
}

export default App;
