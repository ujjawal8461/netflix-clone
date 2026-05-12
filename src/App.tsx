import React from "react";
import Header from "./Components/Header";
import Row from "./Components/Row";
import Banner from "./Components/Banner";
import requests from "./api/requests";

const App: React.FC = () => {
  return (
    <div className="bg-[#111] min-h-screen pb-12">
      <Header />
      <Banner />
      <Row
        Category_title="NETFLIX ORIGINALS"
        fetchUrl={requests.fetchNetflixOriginals}
        isLargeRow
      />
      <Row
        Category_title="Trending Now"
        fetchUrl={requests.fetchTrending}
      />
      <Row
        Category_title="Top Rated"
        fetchUrl={requests.fetchTopRated}
      />
      <Row
        Category_title="Action Movies"
        fetchUrl={requests.fetchActionMovies}
      />
      <Row
        Category_title="Comedy Movies"
        fetchUrl={requests.fetchComedyMovies}
      />
      <Row
        Category_title="Horror Movies"
        fetchUrl={requests.fetchHorrorMovies}
      />
      <Row
        Category_title="Romance Movies"
        fetchUrl={requests.fetchRomanceMovies}
      />
      <Row
        Category_title="Documentaries"
        fetchUrl={requests.fetchDocumentaries}
      />
    </div>
  );
}

export default App;
