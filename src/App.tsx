import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Header from "./Components/Header";
import Row from "./Components/Row";
import Banner from "./Components/Banner";
import Watch from "./Components/Watch";
import Login from "./Components/Login";
import Profiles from "./Components/Profiles";
import MyList from "./Components/MyList";
import WatchHistory from "./Components/WatchHistory";
import Landing from "./Components/Landing";
import CategoryPage from "./Components/CategoryPage";
import Footer from "./Components/Footer";
import { SearchSkeleton } from "./Components/Skeleton";
import requests from "./api/requests";
import axios from "./api/axios";
import { Movie } from "./types";
import { useAuth } from "./context/AuthContext";
import { Analytics } from "@vercel/analytics/react";

const App: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, isGuest } = useAuth();
  const isKidsProfile = typeof profile === 'object' && profile !== null && 'isKids' in profile && !!profile.isKids;

  const watchHistory = (typeof profile === 'object' && profile !== null && 'watchHistory' in profile ? profile.watchHistory : user?.watchHistory) || [];
  const continueWatchingMovies: Movie[] = watchHistory.map((item: any) => ({
    id: item.movieId,
    title: item.title,
    name: item.name,
    poster_path: item.posterPath,
    backdrop_path: item.posterPath,
    overview: "",
    media_type: item.mediaType,
    progress: (item.timestamp / (item.duration || 1)) * 100,
    timestamp: item.timestamp,
    duration: item.duration
  })).reverse(); // Reverse so latest watched is first

  // Handle Search
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await axios.get(`${requests.fetchSearch}${searchQuery}`);
        setSearchResults(response.data.results || []);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    if (query) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  };

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
                <Header onSearch={handleSearch} />
                {isSearching ? (
                  <SearchSkeleton />
                ) : searchQuery ? (
                  <div className="pt-28 px-4 md:px-12 pb-20 min-h-screen bg-[#111]">
                    <h2 className="text-xl md:text-2xl font-bold mb-8 text-white">Search Results for "{searchQuery}"</h2>
                    {searchResults.filter(m => m.poster_path).length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-12">
                        {searchResults.filter(m => m.poster_path).map((movie) => (
                          <div key={movie.id} className="relative group cursor-pointer transition-transform duration-300 hover:scale-105">
                              <img 
                              onClick={() => navigate(`/watch/${movie.media_type || (movie.title ? 'movie' : 'tv')}/${movie.id}`)}
                              className="rounded-md w-full aspect-[2/3] object-cover shadow-lg"
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
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-20 text-gray-400">
                        <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="text-xl">Your search for "{searchQuery}" did not have any matches.</p>
                        <p className="mt-2 text-sm">Suggestions:</p>
                        <ul className="mt-1 list-disc list-inside text-xs">
                          <li>Try different keywords</li>
                          <li>Looking for a movie or TV show?</li>
                          <li>Try using a movie title or actor name</li>
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Banner />
                    <div className="-mt-12 relative z-10">
                      <Row
                        Category_title="My List"
                        moviesList={(typeof profile === 'object' && profile !== null && 'myList' in profile ? profile.myList : user?.myList) || []}
                        isLargeRow
                      />
                      {!isGuest && continueWatchingMovies.length > 0 && (
                        <Row
                          Category_title="Continue Watching"
                          moviesList={continueWatchingMovies}
                          isLargeRow
                        />
                      )}
                      {isKidsProfile ? (
                        <>
                          <Row
                            Category_title="Kids Television & Shows"
                            fetchUrl={requests.fetchKidsTv}
                            isLargeRow
                          />
                          <Row
                            Category_title="Kids & Family Favorites"
                            fetchUrl={requests.fetchFamilyMovies}
                            isLargeRow
                          />
                          <Row
                            Category_title="Animated Cartoons"
                            fetchUrl={requests.fetchAnimationMovies}
                            isLargeRow
                          />
                          <Row
                            Category_title="Magical Fantasy & Animals"
                            fetchUrl={requests.fetchFantasyMovies}
                            isLargeRow
                          />
                          <Row
                            Category_title="Action & Adventure Fun"
                            fetchUrl={requests.fetchAdventureMovies}
                            isLargeRow
                          />
                          <Row
                            Category_title="Comedy Fun"
                            fetchUrl={requests.fetchComedyMovies}
                            isLargeRow
                          />
                          <Row
                            Category_title="Science & Nature Documentaries"
                            fetchUrl={requests.fetchDocumentaries}
                            isLargeRow
                          />
                        </>
                      ) : (
                        <>
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
                            Category_title="Popular on Netflix"
                            fetchUrl={requests.fetchPopular}
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
                            Category_title="Sci-Fi Movies"
                            fetchUrl={requests.fetchSciFiMovies}
                            isLargeRow
                          />
                          <Row
                            Category_title="Animation"
                            fetchUrl={requests.fetchAnimationMovies}
                            isLargeRow
                          />
                          <Row
                            Category_title="Mystery & Thriller"
                            fetchUrl={requests.fetchMysteryMovies}
                            isLargeRow
                          />
                          <Row
                            Category_title="Trending Thrillers"
                            fetchUrl={requests.fetchThrillerMovies}
                            isLargeRow
                          />
                          <Row
                            Category_title="History & War"
                            fetchUrl={requests.fetchHistoryMovies}
                            isLargeRow
                          />
                          <Row
                            Category_title="Documentaries"
                            fetchUrl={requests.fetchDocumentaries}
                            isLargeRow
                          />
                        </>
                      )}
                    </div>
                    <Footer />
                  </>
                )}
              </div>
            } />
            <Route path="/watch/:type/:id" element={<Watch />} />
            <Route path="/mylist" element={<MyList />} />
            <Route path="/history" element={<WatchHistory />} />
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
