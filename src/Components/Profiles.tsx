import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GUEST_NAME, KIDS_NAME, GUEST_PROFILE_ID, KIDS_PROFILE_ID, DEFAULT_AVATAR, KIDS_AVATAR } from "../utils/constants";

const avatars = [
  "https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-qo9h82134t9nv0j0.jpg",
  "https://mir-s3-cdn-cf.behance.net/project_modules/disp/366be133850498.56ba69ac36858.png",
  "https://ih1.redbubble.net/image.618363037.0853/flat,1000x1000,075,f.u2.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
];

const Profiles: React.FC = () => {
  const navigate = useNavigate();
  const { user, isGuest, selectProfile: setProfile, createProfile, updateProfile, deleteProfile } = useAuth();
  
  const [loadingProfile, setLoadingProfile] = useState<string | null>(null);
  const [isManaging, setIsManaging] = useState(false);
  
  // Modals state
  const [activeModal, setActiveModal] = useState<"add" | "edit" | null>(null);
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  
  // Form fields state
  const [profileName, setProfileName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [isKids, setIsKids] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isGuestMode = isGuest;

  const defaultProfiles = [
    { _id: GUEST_PROFILE_ID, name: GUEST_NAME, avatar: DEFAULT_AVATAR, isKids: false },
    { _id: KIDS_PROFILE_ID, name: KIDS_NAME, avatar: KIDS_AVATAR, isKids: true },
  ];

  const activeProfiles = isGuestMode ? defaultProfiles : (user?.profiles || []);

  const handleSelect = (profile: any) => {
    if (isManaging) {
      // Edit Profile
      setSelectedProfileId(profile._id);
      setProfileName(profile.name);
      setSelectedAvatar(profile.avatar || avatars[0]);
      setIsKids(profile.isKids || false);
      setErrorMessage("");
      setActiveModal("edit");
    } else {
      // Select Profile & Load
      setLoadingProfile(profile.name);
      setTimeout(() => {
        setProfile(profile);
        navigate("/");
      }, 1200);
    }
  };

  const handleAddClick = () => {
    if (activeProfiles.length >= 5) {
      alert("Maximum 5 profiles allowed.");
      return;
    }
    setProfileName("");
    setSelectedAvatar(DEFAULT_AVATAR);
    setIsKids(false);
    setErrorMessage("");
    setActiveModal("add");
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      setErrorMessage("Profile name is required");
      return;
    }
    try {
      await createProfile(profileName.trim(), selectedAvatar, isKids);
      setActiveModal(null);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to add profile");
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      setErrorMessage("Profile name is required");
      return;
    }
    try {
      await updateProfile(selectedProfileId, profileName.trim(), selectedAvatar, isKids);
      setActiveModal(null);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleDeleteProfile = async () => {
    if (activeProfiles.length <= 1) {
      alert("You must keep at least one profile.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this profile? All viewing history and lists will be permanently lost.")) {
      try {
        await deleteProfile(selectedProfileId);
        setActiveModal(null);
      } catch (err: any) {
        alert(err.response?.data?.message || "Failed to delete profile");
      }
    }
  };

  return (
    <div className="h-screen w-screen bg-[#141414] flex flex-col items-center justify-center text-white relative select-none overflow-hidden">
      
      {loadingProfile ? (
        <div className="flex flex-col items-center animate-pulse">
          <div className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-8" />
          <h2 className="text-2xl font-bold tracking-widest uppercase">Loading {loadingProfile}'s Profile...</h2>
        </div>
      ) : (
        <>
          <h1 className="text-3xl md:text-5xl mb-12 font-medium">
            {isManaging ? "Manage Profiles:" : "Who's watching?"}
          </h1>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10 px-4 max-w-4xl animate-fadeIn">
            {activeProfiles.map((p: any) => (
              <div
                key={p._id}
                className="group flex flex-col items-center cursor-pointer relative"
                onClick={() => handleSelect(p)}
              >
                <div className="relative w-28 h-28 md:w-36 md:h-36 mb-4 overflow-hidden rounded border-4 border-transparent group-hover:border-white transition-all duration-300">
                  <img 
                    src={p.avatar || avatars[0]} 
                    alt={p.name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                    }}
                  />
                  
                  {isManaging && (
                    <div className="absolute inset-0 bg-black bg-opacity-65 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white border border-white rounded-full p-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  )}
                </div>
                <span className="text-gray-400 text-lg md:text-xl group-hover:text-white transition-colors font-medium">
                  {p.name}
                </span>
                {p.isKids && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wide shadow-md">
                    Kids
                  </span>
                )}
              </div>
            ))}

            {/* Add Profile button */}
            {!isGuestMode && activeProfiles.length < 5 && (
              <div 
                className="flex flex-col items-center cursor-pointer group"
                onClick={handleAddClick}
              >
                <div className="w-28 h-28 md:w-36 md:h-36 mb-4 flex items-center justify-center bg-transparent rounded border-4 border-dashed border-neutral-700 hover:border-white hover:bg-neutral-900 transition-all duration-300">
                  <svg className="w-12 h-12 text-neutral-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-500 text-lg md:text-xl group-hover:text-white transition-colors">
                  Add Profile
                </span>
              </div>
            )}
          </div>

          {!isGuestMode && (
            <button 
              onClick={() => setIsManaging(!isManaging)}
              className={`mt-16 border px-8 py-2 uppercase tracking-[3px] text-xs font-semibold rounded transition-all duration-200 ${
                isManaging 
                  ? "bg-white text-black border-white hover:bg-opacity-90" 
                  : "border-neutral-600 text-neutral-500 hover:text-white hover:border-white"
              }`}
            >
              {isManaging ? "Done" : "Manage Profiles"}
            </button>
          )}
        </>
      )}

      {/* ==================== ADD PROFILE MODAL ==================== */}
      {activeModal === "add" && (
        <div className="absolute inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <form onSubmit={handleSaveAdd} className="bg-[#181818] border border-neutral-800 rounded-lg p-6 md:p-10 max-w-lg w-full space-y-6 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight border-b border-neutral-800 pb-3">Add Profile</h2>
            
            {errorMessage && <p className="text-red-500 text-xs font-bold">{errorMessage}</p>}
            
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded overflow-hidden flex-shrink-0 border border-neutral-700 bg-neutral-800">
                <img 
                  src={selectedAvatar} 
                  alt="Profile Icon" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                  }}
                />
              </div>
              <div className="flex-grow space-y-3">
                <input
                  type="text"
                  placeholder="Profile Name"
                  maxLength={15}
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-neutral-800 border border-transparent focus:border-neutral-600 px-4 py-2 text-sm text-white rounded focus:outline-none"
                  autoFocus
                />
                <label className="flex items-center space-x-3 text-sm text-neutral-400 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isKids}
                      onChange={(e) => setIsKids(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                      isKids 
                        ? "bg-red-600 border-red-600 text-white" 
                        : "bg-[#2b2b2b] border-[#444] text-transparent hover:border-[#666]"
                    }`}>
                      <svg className="w-3.5 h-3.5 stroke-current stroke-[3px]" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="group-hover:text-white transition-colors">Kid's profile?</span>
                </label>
              </div>
            </div>

            {/* Choose Avatar */}
            <div>
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-3">Choose profile picture:</p>
              <div className="grid grid-cols-6 gap-2">
                {avatars.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`aspect-square rounded overflow-hidden border-2 transition-all ${
                      selectedAvatar === av ? "border-red-600 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={av} alt="Avatar option" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-4 border-t border-neutral-800">
              <button
                type="submit"
                className="flex-grow bg-white text-black py-2 rounded text-sm font-bold hover:bg-opacity-90 transition-all"
              >
                Save Profile
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-sm font-bold rounded transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== EDIT PROFILE MODAL ==================== */}
      {activeModal === "edit" && (
        <div className="absolute inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <form onSubmit={handleSaveEdit} className="bg-[#181818] border border-neutral-800 rounded-lg p-6 md:p-10 max-w-lg w-full space-y-6 shadow-2xl relative">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight border-b border-neutral-800 pb-3">Edit Profile</h2>
            
            {errorMessage && <p className="text-red-500 text-xs font-bold">{errorMessage}</p>}
            
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded overflow-hidden flex-shrink-0 border border-neutral-700 bg-neutral-800">
                <img 
                  src={selectedAvatar} 
                  alt="Profile Icon" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                  }}
                />
              </div>
              <div className="flex-grow space-y-3">
                <input
                  type="text"
                  placeholder="Profile Name"
                  maxLength={15}
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-neutral-800 border border-transparent focus:border-neutral-600 px-4 py-2 text-sm text-white rounded focus:outline-none"
                  autoFocus
                />
                <label className="flex items-center space-x-3 text-sm text-neutral-400 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isKids}
                      onChange={(e) => setIsKids(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                      isKids 
                        ? "bg-red-600 border-red-600 text-white" 
                        : "bg-[#2b2b2b] border-[#444] text-transparent hover:border-[#666]"
                    }`}>
                      <svg className="w-3.5 h-3.5 stroke-current stroke-[3px]" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="group-hover:text-white transition-colors">Kid's profile?</span>
                </label>
              </div>
            </div>

            {/* Choose Avatar */}
            <div>
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-3">Change profile picture:</p>
              <div className="grid grid-cols-6 gap-2">
                {avatars.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`aspect-square rounded overflow-hidden border-2 transition-all ${
                      selectedAvatar === av ? "border-red-600 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={av} alt="Avatar option" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-3 pt-4 border-t border-neutral-800">
              <div className="flex items-center space-x-3">
                <button
                  type="submit"
                  className="flex-grow bg-white text-black py-2 rounded text-sm font-bold hover:bg-opacity-90 transition-all"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-sm font-bold rounded transition-all"
                >
                  Cancel
                </button>
              </div>
              <button
                type="button"
                onClick={handleDeleteProfile}
                className="w-full py-2 bg-red-950 text-red-200 border border-red-900 rounded text-sm font-bold hover:bg-red-900 hover:text-white transition-all mt-2"
              >
                Delete Profile
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profiles;
