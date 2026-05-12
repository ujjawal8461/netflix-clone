import React, { useEffect, useState } from "react";
// @ts-ignore
import netflixLogo from "../assets/netflix-logo.png";
// @ts-ignore
import profileLogo from "../assets/profile.png";

const Header: React.FC = () => {
  const [show, handleShow] = useState(false);

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

  return (
    <header className={`fixed top-0 w-full p-4 md:p-5 z-50 flex justify-between items-center transition-all duration-500 ease-in ${show && "bg-[#111]"}`}>
      <img className="h-6 md:h-8 object-contain" src={netflixLogo} alt="Netflix Logo" />
      <img className="h-6 md:h-8 object-contain cursor-pointer" src={profileLogo} alt="User Profile" />
    </header>
  );
}

export default Header;
