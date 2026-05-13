import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./Components/Header";
import Row from "./Components/Row";
import Banner from "./Components/Banner";
import Watch from "./Components/Watch";
import Login from "./Components/Login";
import Profiles from "./Components/Profiles";
import MyList from "./Components/MyList";
import Landing from "./Components/Landing";
import requests from "./api/requests";
import axios from "./api/axios";
import { Movie } from "./types";
import { useAuth } from "./context/AuthContext";

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [myList, setMyList] = useState<Movie[]>([]);
  const location = useLocation();
  const { user, profile } = useAuth();

  // Load My List on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("myList") || "[]");
    setMyList(saved);
  }, []);

  // Handle Search
  useEffect(() => {
    if (searchQuery) {
      async function fetchSearch() {
        try {
          const response = await axios.get(`${requests.fetchSearch}${searchQuery}`);
          setSearchResults(response.data.results);
        } catch (error) {
          console.error("Search error:", error);
        }
      }
      fetchSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Clear search on navigation
  useEffect(() => {
    setSearchQuery("");
  }, [location]);

  return (
    <div className="bg-[#111] min-h-screen">
      <Routes>
        {/* If no user, show Landing or Login */}
        {!user ? (
          <>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : !profile ? (
          <>
            <Route path="/profiles" element={<Profiles />} />
            <Route path="*" element={<Navigate to="/profiles" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={
              <div className="pb-12">
                <Header onSearch={(query) => setSearchQuery(query)} />
                {searchQuery ? (
                  <div className="pt-24 px-4 md:px-12">
                    <Row
                      Category_title={`Search Results for "${searchQuery}"`}
                      moviesList={searchResults}
                    />
                  </div>
                ) : (
                  <>
                    <Banner />
                    <div className="-mt-12 relative z-10">
                      <Row
                        Category_title="My List"
                        moviesList={myList}
                      />
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
                  </>
                )}
              </div>
            } />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/mylist" element={<MyList />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
