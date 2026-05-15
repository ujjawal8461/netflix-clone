import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import Header from "./Components/Header";
import Row from "./Components/Row";
import Banner from "./Components/Banner";
import Watch from "./Components/Watch";
import Login from "./Components/Login";
import Profiles from "./Components/Profiles";
import MyList from "./Components/MyList";
import Landing from "./Components/Landing";
import CategoryPage from "./Components/CategoryPage";
import Footer from "./Components/Footer";
import requests from "./api/requests";
import axios from "./api/axios";
import { Movie } from "./types";
import { useAuth } from "./context/AuthContext";
import { Analytics } from "@vercel/analytics/react";

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

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
                  <div className="pt-28 px-4 md:px-12 pb-20 min-h-screen bg-[#111]">
                    <h2 className="text-xl md:text-2xl font-bold mb-8 text-white">Search Results for "{searchQuery}"</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-12">
                      {searchResults.filter(m => m.poster_path).map((movie) => (
                         <div key={movie.id} className="relative group cursor-pointer transition-transform duration-300 hover:scale-105">
                            <img 
                             onClick={() => navigate(`/watch/${movie.media_type || (movie.title ? 'movie' : 'tv')}/${movie.id}`)}
                             className="rounded-md w-full aspect-[2/3] object-cover"
                             loading="lazy"
                             src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                             alt={movie.title || movie.name} 
                            />
                           <div className="mt-2 text-white text-sm font-bold truncate">
                             {movie.title || movie.name}
                           </div>
                         </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <Banner />
                    <div className="-mt-12 relative z-10">
                      <Row
                        Category_title="My List"
                        moviesList={user?.myList || []}
                        isLargeRow
                      />
                      <Row
                        Category_title="NETFLIX ORIGINALS"
                        fetchUrl={requests.fetchNetflixOriginals}
                        isLargeRow
                      />
                      <Row
                        Category_title="Trending Now"
                        fetchUrl={requests.fetchTrending}
                        isLargeRow
                      />
                      <Row
                        Category_title="Top Rated"
                        fetchUrl={requests.fetchTopRated}
                        isLargeRow
                      />
                      <Row
                        Category_title="Action Movies"
                        fetchUrl={requests.fetchActionMovies}
                        isLargeRow
                      />
                      <Row
                        Category_title="Comedy Movies"
                        fetchUrl={requests.fetchComedyMovies}
                        isLargeRow
                      />
                      <Row
                        Category_title="Horror Movies"
                        fetchUrl={requests.fetchHorrorMovies}
                        isLargeRow
                      />
                      <Row
                        Category_title="Romance Movies"
                        fetchUrl={requests.fetchRomanceMovies}
                        isLargeRow
                      />
                      <Row
                        Category_title="Documentaries"
                        fetchUrl={requests.fetchDocumentaries}
                        isLargeRow
                      />
                    </div>
                    <Footer />
                  </>
                )}
              </div>
            } />
            <Route path="/watch/:type/:id" element={<Watch />} />
            <Route path="/mylist" element={<MyList />} />
            <Route path="/tv" element={<CategoryPage type="tv" title="TV Shows" />} />
            <Route path="/movies" element={<CategoryPage type="movie" title="Movies" />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
      <Analytics />
    </div>
  );
}

export default App;
