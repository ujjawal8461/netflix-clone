import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DEFAULT_AVATAR } from "../utils/constants";
// @ts-ignore
import netflixLogo from "../assets/netflix-logo.png";
// @ts-ignore
import profileLogo from "../assets/profile.png";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [show, handleShow] = useState(false);
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const { user, profile, logout, addSearchHistory, isGuest } = useAuth();
  const lastLoggedQueryRef = useRef("");
  const profileName = (typeof profile === 'object' && profile !== null) ? profile.name : (profile || "User");
  const profileAvatar = (typeof profile === 'object' && profile !== null && 'avatar' in profile && profile.avatar) 
    ? profile.avatar 
    : DEFAULT_AVATAR;

  const searchHistory = (typeof profile === 'object' && profile !== null && 'searchHistory' in profile) 
    ? (profile as any).searchHistory 
    : user?.searchHistory;

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 100) {
        handleShow(true);
      } else {
        handleShow(false);
      }
    };
    window.addEventListener("scroll", scrollListener);
    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  // Sync internal state if URL changes (e.g. back button)
  useEffect(() => {
    setSearchQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchQuery);
        const trimmed = searchQuery.trim();
        if (trimmed && trimmed !== lastLoggedQueryRef.current) {
          lastLoggedQueryRef.current = trimmed;
          addSearchHistory(trimmed);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch, addSearchHistory]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isKidsProfile = typeof profile === 'object' && profile !== null && 'isKids' in profile && !!profile.isKids;

  return (
    <header className={`fixed top-0 w-full px-4 md:px-12 py-4 z-50 flex justify-between items-center transition-all duration-500 ease-in ${show ? "bg-[#111]" : "bg-gradient-to-b from-black to-transparent"}`}>
      <div className="flex items-center space-x-4 md:space-x-8">
        <div className="flex items-center space-x-2.5">
          <Link to="/">
            <img className="h-6 md:h-8 object-contain cursor-pointer" src={netflixLogo} alt="Netflix Logo" />
          </Link>
          {isKidsProfile && (
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-black text-[10px] md:text-xs font-black px-2 py-0.5 rounded shadow tracking-wider uppercase select-none">
              Kids
            </span>
          )}
        </div>
        
        <nav className="hidden lg:flex items-center space-x-4 text-sm text-gray-200 font-medium">
          <Link to="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <Link to="/tv" className="hover:text-gray-400 transition-colors">TV Shows</Link>
          <Link to="/movies" className="hover:text-gray-400 transition-colors">Movies</Link>
          <a href="#" className="hover:text-gray-400 transition-colors">New & Popular</a>
          <Link to="/mylist" className="hover:text-gray-400 transition-colors">My List</Link>
          {!isGuest && (
            <Link to="/history" className="hover:text-gray-400 transition-colors">Watch History</Link>
          )}
        </nav>

        {/* Mobile Nav Trigger */}
        <div className="lg:hidden text-white text-sm font-medium flex items-center cursor-pointer">
          Browse
          <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
             <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative group flex items-center">
          <button className="text-white focus:outline-none z-10">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Titles, people, genres"
            className={`bg-black bg-opacity-70 text-white border border-white text-xs py-1 px-8 focus:outline-none transition-all duration-300 absolute right-0 -z-10 ${
              searchQuery 
                ? "w-40 md:w-64 opacity-100" 
                : "w-0 opacity-0 group-hover:w-40 md:group-hover:w-64 group-hover:opacity-100"
            }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
          />
          {!isGuest && searchFocused && (searchHistory || []).length > 0 && (
            <div className="absolute right-0 top-full mt-2 w-48 md:w-64 bg-black bg-opacity-95 border border-neutral-800 rounded shadow-2xl py-2 z-50">
               <div className="px-3 py-1 text-[9px] text-gray-500 font-bold uppercase tracking-wider">Recent Searches</div>
               {[...(searchHistory || [])].reverse().slice(0, 5).map((s: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSearchQuery(s.query);
                    if (onSearch) onSearch(s.query);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-neutral-900 flex items-center space-x-2"
                >
                  <svg className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="truncate">{s.query}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div 
          className="relative flex items-center cursor-pointer group"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <img 
            className="h-8 md:h-8 rounded object-cover" 
            src={profileAvatar} 
            alt="User Profile" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
            }}
          />
          <svg className={`w-4 h-4 ml-1 text-white transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} fill="currentColor" viewBox="0 0 20 20">
             <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>

          {dropdownOpen && (
            <div className="absolute right-0 top-full pt-4 w-48">
              <div className="bg-black bg-opacity-90 border border-gray-700 py-2 shadow-xl animate-fadeIn">
                <div className="px-4 py-2 flex items-center space-x-3 hover:underline">
                  <img 
                    src={profileAvatar} 
                    className="w-8 h-8 rounded object-cover" 
                    alt="" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                    }}
                  />
                  <span className="text-white text-sm">{profileName}</span>
                </div>
                <hr className="border-gray-700 my-2" />
                {!isGuest && (
                  <>
                    <button 
                      onClick={() => navigate("/profiles")}
                      className="w-full text-left px-4 py-2 text-white text-sm hover:underline"
                    >
                      Manage Profiles
                    </button>
                    <button 
                      onClick={() => navigate("/history")}
                      className="w-full text-left px-4 py-2 text-white text-sm hover:underline"
                    >
                      Viewing Activity
                    </button>
                  </>
                )}
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-white text-sm font-bold hover:underline"
                >
                  Sign out of Netflix
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

