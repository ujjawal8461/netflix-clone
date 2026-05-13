import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// @ts-ignore
import netflixBackground from "../assets/netflix-background.jpg";
// @ts-ignore
import netflixLogo from "../assets/netflix-logo.png";

const Login: React.FC = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignUp) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      navigate("/profiles");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGuest = async () => {
    try {
      await login("guest@example.com");
      navigate("/profiles");
    } catch (err) {
      // If guest doesn't exist, sign them up
      await signup("guest@example.com");
      navigate("/profiles");
    }
  };

  return (
    <div 
      className="relative h-screen w-screen bg-cover bg-no-repeat bg-center"
      style={{ backgroundImage: `url(${netflixBackground})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60" />
      
      <div className="absolute top-0 left-0 p-8">
        <img 
          className="h-10 md:h-12 cursor-pointer" 
          src={netflixLogo} 
          alt="Netflix" 
          onClick={() => navigate("/")}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black bg-opacity-75 p-16 rounded-md w-full max-w-md">
          <h1 className="text-white text-3xl font-bold mb-8">
            {isSignUp ? "Sign Up" : "Sign In"}
          </h1>
          
          {error && (
            <div className="bg-[#e87c03] text-white text-[13px] py-2.5 px-5 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="email"
              placeholder="Email or phone number"
              className="w-full bg-neutral-700 rounded p-4 text-white placeholder-gray-400 focus:outline-none focus:bg-neutral-600 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-neutral-700 rounded p-4 text-white placeholder-gray-400 focus:outline-none focus:bg-neutral-600 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-red-600 text-white font-bold py-4 rounded hover:bg-red-700 transition-colors mt-4"
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <div className="mt-8 flex flex-col space-y-4">
            {!isSignUp && (
              <button
                onClick={handleGuest}
                className="w-full bg-white bg-opacity-10 text-white font-bold py-3 rounded hover:bg-opacity-20 transition-all border border-gray-600"
              >
                Enter as Guest
              </button>
            )}
            
            <div className="flex items-center justify-between text-gray-400 text-sm">
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>Remember me</span>
              </div>
              <a href="#" className="hover:underline">Need help?</a>
            </div>
          </div>

          <div className="mt-12 text-gray-500">
            <span>{isSignUp ? "Already have an account?" : "New to Netflix?"} </span>
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-white hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              {isSignUp ? "Sign in now." : "Sign up now."}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
