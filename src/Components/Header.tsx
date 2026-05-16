import React, { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  const navigate = useNavigate();
  const { profile, logout } = useAuth();
  const profileName = profile || "User";

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
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className={`fixed top-0 w-full px-4 md:px-12 py-4 z-50 flex justify-between items-center transition-all duration-500 ease-in ${show ? "bg-[#111]" : "bg-gradient-to-b from-black to-transparent"}`}>
      <div className="flex items-center space-x-4 md:space-x-8">
        <Link to="/">
          <img className="h-6 md:h-8 object-contain cursor-pointer" src={netflixLogo} alt="Netflix Logo" />
        </Link>
        
        <nav className="hidden lg:flex items-center space-x-4 text-sm text-gray-200 font-medium">
          <Link to="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <Link to="/tv" className="hover:text-gray-400 transition-colors">TV Shows</Link>
          <Link to="/movies" className="hover:text-gray-400 transition-colors">Movies</Link>
          <a href="#" className="hover:text-gray-400 transition-colors">New & Popular</a>
          <Link to="/mylist" className="hover:text-gray-400 transition-colors">My List</Link>
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
          />
        </div>

        <div 
          className="relative flex items-center cursor-pointer group"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <img className="h-8 md:h-8 rounded" src={profileLogo} alt="User Profile" />
          <svg className={`w-4 h-4 ml-1 text-white transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} fill="currentColor" viewBox="0 0 20 20">
             <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>

          {dropdownOpen && (
            <div className="absolute right-0 top-full pt-4 w-48">
              <div className="bg-black bg-opacity-90 border border-gray-700 py-2 shadow-xl">
                <div className="px-4 py-2 flex items-center space-x-3 hover:underline">
                  <img src={profileLogo} className="w-8 h-8 rounded" alt="" />
                  <span className="text-white text-sm">{profileName}</span>
                </div>
                <hr className="border-gray-700 my-2" />
                <button 
                  onClick={() => navigate("/profiles")}
                  className="w-full text-left px-4 py-2 text-white text-sm hover:underline"
                >
                  Manage Profiles
                </button>
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

