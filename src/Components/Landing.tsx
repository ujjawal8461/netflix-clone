import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// @ts-ignore
import netflixBackground from "../assets/netflix-background.jpg";
// @ts-ignore
import netflixLogo from "../assets/netflix-logo.png";

const Landing: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { login, signup, loginAsGuest } = useAuth();

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/login", { state: { email } });
  };

  const handleGuest = async () => {
    loginAsGuest();
    navigate("/profiles");
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden flex flex-col">
      {/* Background Collage - Scale removed to prevent leakage */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{
          backgroundImage: `url(${netflixBackground})`,
        }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-black pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto w-full">
        <img 
          className="h-8 md:h-11" 
          src={netflixLogo} 
          alt="Netflix" 
        />
      </header>

      {/* Hero Content */}
      <main className="relative z-20 flex flex-col items-center justify-center text-center px-6 flex-grow pb-20 pt-20 max-w-[950px] mx-auto">
        <h1 className="text-white text-[2.5rem] md:text-[4.5rem] font-[900] mb-4 leading-[1.1] tracking-tight">
          Unlimited movies, TV shows and more
        </h1>
        <p className="text-white text-xl md:text-3xl mb-8 font-normal">
          Watch anywhere. Cancel anytime.
        </p>
        <p className="text-white text-lg md:text-xl mb-12 opacity-90 max-w-[800px]">
          Experience the world of stories. Start your journey today.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center w-full gap-4 md:gap-6">
          <button
            onClick={() => navigate("/login")}
            className="bg-[#e50914] text-white text-xl md:text-2xl font-bold px-12 py-4 md:py-5 rounded hover:bg-[#c11119] transition-all w-full md:w-auto shadow-lg hover:scale-105 transform active:scale-95"
          >
            Sign In
          </button>
          <button
            onClick={handleGuest}
            className="bg-white/10 backdrop-blur-md text-white text-xl md:text-2xl font-bold px-12 py-4 md:py-5 rounded border border-white/40 hover:bg-white/20 transition-all w-full md:w-auto shadow-lg hover:scale-105 transform active:scale-95"
          >
            Guest Mode
          </button>
        </div>
      </main>

      {/* Bottom transition gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
      
      {/* The Famous Netflix Curve - Extended height to block all overflow */}
      <div className="absolute bottom-0 left-0 w-full z-30 pointer-events-none overflow-hidden h-[100px] md:h-[150px] bg-black">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[500%] border-t-[6px] border-[#e50914] rounded-[100%_100%_0_0]"
          style={{
            background: 'radial-gradient(50% 100% at 50% 0%, #14182a 0%, #000000 100%)',
          }}
        />
      </div>
    </div>
  );
};

export default Landing;
