import React from "react";
import Header from "./Components/Header";
import Row from "./Components/Row";
import Banner from "./Components/Banner";

function App() {
  return (
    <>
      <div className="bg-black">
        <Header />
        <Banner />
        <Row
          Category_title="NETFLIX ORIGINALS"
          url={`https://api.themoviedb.org/3/discover/tv?api_key=`}
          genre={``}
          isLargeRow
        />
        <Row
          Category_title="Trending Now"
          url={`https://api.themoviedb.org/3/trending/all/week?api_key=`}
          genre={``}
          isLargeRow
        />
        <Row
          Category_title="Top Rated"
          url={`https://api.themoviedb.org/3/movie/top_rated?api_key=`}
          genre={``}
        />
        <Row
          Category_title="Most Popular"
          url={`https://api.themoviedb.org/3/discover/movie?api_key=`}
          genre={``}
        />
        <Row
          Category_title="Comedy Movies"
          url={`https://api.themoviedb.org/3/discover/movie?api_key=`}
          genre={`&with_genres=35`}
        />
        <Row
          Category_title="Horror Movies"
          url={`https://api.themoviedb.org/3/discover/movie?api_key=`}
          genre={`&with_genres=27`}
        />
        <Row
          Category_title="Romance Movies"
          url={`https://api.themoviedb.org/3/discover/movie?api_key=`}
          genre={`&with_genres=10749`}
        />
        <Row
          Category_title="Action Movies"
          url={`https://api.themoviedb.org/3/discover/movie?api_key=`}
          genre={`&with_genres=28`}
        />
      </div>
    </>
  );
}

export default App;
