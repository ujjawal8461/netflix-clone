import React from "react";
import Row from "./Row";
import Banner from "./Banner";
import Header from "./Header";
import Footer from "./Footer";
import requests from "../api/requests";

interface CategoryPageProps {
  type: "tv" | "movie";
  title: string;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ type, title }) => {
  return (
    <div className="bg-[#111] min-h-screen">
      <Header />
      <Banner /> {/* Banner will automatically fetch Netflix Originals which is good */}
      
      <div className="pt-24 px-4 md:px-12 -mt-12 relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-8 text-white">{title}</h1>
        
        {type === "movie" ? (
          <>
            <Row Category_title="Action Movies" fetchUrl={requests.fetchActionMovies} isLargeRow />
            <Row Category_title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} isLargeRow />
            <Row Category_title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} isLargeRow />
            <Row Category_title="Romance Movies" fetchUrl={requests.fetchRomanceMovies} isLargeRow />
            <Row Category_title="Documentaries" fetchUrl={requests.fetchDocumentaries} isLargeRow />
          </>
        ) : (
          <>
            <Row Category_title="Netflix Originals" fetchUrl={requests.fetchNetflixOriginals} isLargeRow />
            <Row Category_title="Trending TV" fetchUrl={requests.fetchTrending} isLargeRow />
            {/* TMDB doesn't have as many genre endpoints for TV in our basic requests, 
                but we can reuse trending or top rated */}
            <Row Category_title="Top Rated TV" fetchUrl={requests.fetchTopRated} isLargeRow />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;
