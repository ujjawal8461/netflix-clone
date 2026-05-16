import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const profilesList = [
  { name: "Guest", avatar: "https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-qo9h82134t9nv0j0.jpg" },
  { name: "Kids", avatar: "https://ih1.redbubble.net/image.618363037.0853/flat,1000x1000,075,f.u2.jpg" },
];

const Profiles: React.FC = () => {
  const navigate = useNavigate();
  const { selectProfile: setProfile } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState<string | null>(null);

  const handleSelect = (name: string) => {
    setLoadingProfile(name);
    setTimeout(() => {
      setProfile(name);
      navigate("/");
    }, 1200); // Simulate loading animation
  };

  return (
    <div className="h-screen w-screen bg-[#141414] flex flex-col items-center justify-center text-white animate-fadeIn">
      {loadingProfile ? (
        <div className="flex flex-col items-center animate-pulse">
           <div className="w-24 h-24 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-8" />
           <h2 className="text-2xl font-medium tracking-widest uppercase">Loading {loadingProfile}'s Profile...</h2>
        </div>
      ) : (
        <>
          <h1 className="text-3xl md:text-5xl mb-12 font-medium opacity-0 animate-slideDown fill-mode-forwards">
            Who's watching?
          </h1>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10 px-4">
            {profilesList.map((profile, index) => (
              <div
                key={profile.name}
                className={`group flex flex-col items-center cursor-pointer opacity-0 animate-slideUp fill-mode-forwards`}
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => handleSelect(profile.name)}
              >
                <div className="relative w-28 h-28 md:w-40 md:h-40 mb-4 overflow-hidden rounded border-4 border-transparent group-hover:border-white transition-all duration-300">
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-gray-500 text-lg md:text-xl group-hover:text-white transition-colors font-medium">
                  {profile.name}
                </span>
              </div>
            ))}

            {/* Add Profile */}
            <div className="flex flex-col items-center cursor-pointer group opacity-0 animate-slideUp fill-mode-forwards" style={{ animationDelay: '600ms' }}>
              <div className="w-28 h-28 md:w-40 md:h-40 mb-4 flex items-center justify-center bg-transparent rounded hover:bg-gray-700 transition-all duration-300 border-4 border-transparent group-hover:border-white">
                <svg className="w-16 h-16 text-gray-500 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-500 text-lg md:text-xl group-hover:text-white transition-colors">
                Add Profile
              </span>
            </div>
          </div>

          <button className="mt-20 border border-gray-600 text-gray-600 px-6 py-2 uppercase tracking-[3px] hover:text-white hover:border-white transition-all text-sm md:text-base font-medium">
            Manage Profiles
          </button>
        </>
      )}
    </div>
  );
};

export default Profiles;
