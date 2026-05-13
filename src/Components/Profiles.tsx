import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const profiles = [
  { name: "Guest1", avatar: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" },
  { name: "Guest2", avatar: "https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-qo9h82134t9nv0j0.jpg" },
  { name: "Kids", avatar: "https://ih1.redbubble.net/image.618363037.0853/flat,1000x1000,075,f.u2.jpg" },
];

const Profiles: React.FC = () => {
  const navigate = useNavigate();
  const { selectProfile: setProfile } = useAuth();

  const handleSelect = (name: string) => {
    setProfile(name);
    navigate("/");
  };

  return (
    <div className="h-screen w-screen bg-[#141414] flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl md:text-6xl mb-12 font-medium">Who's watching?</h1>

      <div className="flex flex-wrap justify-center gap-8 px-4">
        {profiles.map((profile) => (
          <div
            key={profile.name}
            className="group flex flex-col items-center cursor-pointer"
            onClick={() => handleSelect(profile.name)}
          >
            <div className="relative w-32 h-32 md:w-40 md:h-40 mb-4 overflow-hidden rounded border-4 border-transparent group-hover:border-white transition-all duration-300">
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-gray-400 text-lg md:text-xl group-hover:text-white transition-colors">
              {profile.name}
            </span>
          </div>
        ))}

        {/* Add Profile */}
        <div className="flex flex-col items-center cursor-pointer group">
          <div className="w-32 h-32 md:w-40 md:h-40 mb-4 flex items-center justify-center bg-transparent rounded group-hover:bg-gray-300 transition-all duration-300 border-4 border-transparent">
            <svg className="w-20 h-20 text-gray-500 group-hover:text-black" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-gray-400 text-lg md:text-xl group-hover:text-white transition-colors">
            Add Profile
          </span>
        </div>
      </div>

      <button className="mt-16 px-8 py-2 border border-gray-500 text-gray-500 text-lg hover:text-white hover:border-white transition-all">
        Manage Profiles
      </button>
    </div>
  );
};

export default Profiles;
