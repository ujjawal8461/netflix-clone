import React from "react";
import netflixLogo from "../assets/netflix-logo.png";
import profileLogo from "../assets/profile.png";

function Header() {
  return (
    <>
      <header className="bg-black py-2">
        <div className="mx-auto flex justify-between items-center">
          <img className="h-8 ml-2" src={netflixLogo} alt="Logo" />
          <img className="h-8 mr-2" src={profileLogo} alt="profile" />
        </div>
      </header>
    </>
  );
}

export default Header;
