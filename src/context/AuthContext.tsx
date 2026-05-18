import React, { createContext, useContext, useState, ReactNode } from "react";
import backendAxios from "../api/backendAxios";

interface Profile {
  _id: string;
  name: string;
  avatar: string;
  isKids: boolean;
  myList: any[];
  watchHistory: any[];
}

interface User {
  _id?: string;
  email?: string;
  name: string;
  isGuest?: boolean;
  password?: string;
  token?: string;
  profiles?: Profile[];
  myList?: any[]; // For guest user compatibility
  watchHistory?: any[]; // For guest user compatibility
  searchHistory?: any[]; // For guest user compatibility
}

interface AuthContextType {
  user: User | null;
  profile: Profile | string | null;
  isGuest: boolean;
  loginAsGuest: () => void;
  login: (email: string, password?: string) => Promise<void>;
  signup: (email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  selectProfile: (profileIdentifier: any) => void;
  updateMyList: (movie: any) => Promise<void>;
  saveWatchProgress: (progress: any) => Promise<void>;
  addSearchHistory: (query: string) => Promise<void>;
  deleteWatchProgress: (movieId: number) => Promise<void>;
  createProfile: (name: string, avatar: string, isKids: boolean) => Promise<void>;
  updateProfile: (profileId: string, name: string, avatar: string, isKids: boolean) => Promise<void>;
  deleteProfile: (profileId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });
  const [profile, setProfile] = useState<Profile | string | null>(() => {
    const saved = localStorage.getItem("profile");
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return saved;
    }
  });

  const isGuest = !!user?.isGuest;

  const loginAsGuest = () => {
    const guestUser: User = {
      isGuest: true,
      name: "Guest",
      myList: []
    };
    setUser(guestUser);
    localStorage.setItem("user", JSON.stringify(guestUser));
    setProfile(null);
    localStorage.removeItem("profile");
  };

  const login = async (email: string, password?: string) => {
    try {
      const response = await backendAxios.post("/auth/login", { email, password });
      const userData = response.data.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const signup = async (email: string, password?: string) => {
    try {
      const response = await backendAxios.post("/auth/signup", { email, password });
      const userData = response.data.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Signup failed");
    }
  };

  const logout = async () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
  };

  const selectProfile = (selectedProfile: any) => {
    setProfile(selectedProfile);
    localStorage.setItem("profile", JSON.stringify(selectedProfile));
  };

  const updateMyList = async (movie: any) => {
    if (!user) return;
    
    // Guest mode
    if (isGuest) {
      let updatedMyList = [...(user.myList || [])];
      const movieExists = updatedMyList.find((m: any) => m.id === movie.id);
      
      if (movieExists) {
        updatedMyList = updatedMyList.filter((m: any) => m.id !== movie.id);
      } else {
        updatedMyList.push(movie);
      }
      
      const updatedUser = { ...user, myList: updatedMyList };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return;
    }

    // Backend mode
    try {
      // Find profile ID. If `profile` is string, fallback to user.profiles[0]._id
      const profileId = typeof profile === 'object' && profile?._id 
        ? profile._id 
        : user.profiles?.[0]?._id;

      if (!profileId) return;

      const response = await backendAxios.post("/content/mylist", { profileId, movie });
      const newList = response.data.data;
      
      // Update the user object in state with the new list for this profile
      const updatedProfiles = user.profiles?.map(p => 
        p._id === profileId ? { ...p, myList: newList } : p
      );
      
      const updatedUser = { ...user, profiles: updatedProfiles };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Update active profile state if applicable
      if (typeof profile === 'object' && profile?._id === profileId) {
        const updatedProfile = { ...profile, myList: newList };
        setProfile(updatedProfile);
        localStorage.setItem("profile", JSON.stringify(updatedProfile));
      }
    } catch (error) {
      console.error("Failed to update My List", error);
    }
  };

  const saveWatchProgress = async (progress: any) => {
    if (!user) return;

    // Guest Mode - disabled per requirements
    if (isGuest) {
      return;
    }

    // Backend Mode
    try {
      const profileId = typeof profile === 'object' && profile?._id 
        ? profile._id 
        : user.profiles?.[0]?._id;

      if (!profileId) return;

      const response = await backendAxios.post("/content/progress", { profileId, progress });
      const newHistory = response.data.data;

      const updatedProfiles = user.profiles?.map(p => 
        p._id === profileId ? { ...p, watchHistory: newHistory } : p
      );
      
      const updatedUser = { ...user, profiles: updatedProfiles };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (typeof profile === 'object' && profile?._id === profileId) {
        const updatedProfile = { ...profile, watchHistory: newHistory };
        setProfile(updatedProfile);
        localStorage.setItem("profile", JSON.stringify(updatedProfile));
      }
    } catch (error) {
      console.error("Failed to save watch progress", error);
    }
  };

  const addSearchHistory = async (query: string) => {
    if (!user || !query.trim()) return;

    // Guest Mode - disabled per requirements
    if (isGuest) {
      return;
    }

    // Backend Mode
    try {
      const profileId = typeof profile === 'object' && profile?._id 
        ? profile._id 
        : user.profiles?.[0]?._id;

      if (!profileId) return;

      const response = await backendAxios.post("/content/search", { profileId, query });
      const newSearchHistory = response.data.data;

      const updatedProfiles = user.profiles?.map(p => 
        p._id === profileId ? { ...p, searchHistory: newSearchHistory } : p
      );
      
      const updatedUser = { ...user, profiles: updatedProfiles };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (typeof profile === 'object' && profile?._id === profileId) {
        const updatedProfile = { ...profile, searchHistory: newSearchHistory };
        setProfile(updatedProfile);
        localStorage.setItem("profile", JSON.stringify(updatedProfile));
      }
    } catch (error) {
      console.error("Failed to save search history", error);
    }
  };

  const deleteWatchProgress = async (movieId: number) => {
    if (!user) return;

    // Guest Mode
    if (isGuest) {
      let watchHistory = [...(user.watchHistory || [])];
      watchHistory = watchHistory.filter((h: any) => h.movieId !== movieId);

      const updatedUser = { ...user, watchHistory };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return;
    }

    // Backend Mode
    try {
      const profileId = typeof profile === 'object' && profile?._id 
        ? profile._id 
        : user.profiles?.[0]?._id;

      if (!profileId) return;

      const response = await backendAxios.post("/content/progress/delete", { profileId, movieId });
      const newHistory = response.data.data;

      const updatedProfiles = user.profiles?.map(p => 
        p._id === profileId ? { ...p, watchHistory: newHistory } : p
      );
      
      const updatedUser = { ...user, profiles: updatedProfiles };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (typeof profile === 'object' && profile?._id === profileId) {
        const updatedProfile = { ...profile, watchHistory: newHistory };
        setProfile(updatedProfile);
        localStorage.setItem("profile", JSON.stringify(updatedProfile));
      }
    } catch (error) {
      console.error("Failed to delete watch progress", error);
    }
  };

  const createProfile = async (name: string, avatar: string, isKids: boolean) => {
    if (!user) return;

    // Guest Mode
    if (isGuest) {
      const newProfile = { _id: Math.random().toString(), name, avatar, isKids, watchHistory: [], myList: [], searchHistory: [] };
      const updatedProfiles = [...(user.profiles || []), newProfile];
      const updatedUser = { ...user, profiles: updatedProfiles };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return;
    }

    // Backend Mode
    try {
      const response = await backendAxios.post("/profiles", { name, avatar, isKids });
      const updatedProfiles = response.data.data;
      const updatedUser = { ...user, profiles: updatedProfiles };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Failed to create profile", error);
      throw error;
    }
  };

  const updateProfile = async (profileId: string, name: string, avatar: string, isKids: boolean) => {
    if (!user) return;

    // Guest Mode
    if (isGuest) {
      const updatedProfiles = user.profiles?.map(p => 
        p._id === profileId ? { ...p, name, avatar, isKids } : p
      );
      const updatedUser = { ...user, profiles: updatedProfiles };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (typeof profile === 'object' && profile?._id === profileId) {
        const updatedProfile = { ...profile, name, avatar, isKids };
        setProfile(updatedProfile);
        localStorage.setItem("profile", JSON.stringify(updatedProfile));
      }
      return;
    }

    // Backend Mode
    try {
      const response = await backendAxios.put(`/profiles/${profileId}`, { name, avatar, isKids });
      const updatedProfiles = response.data.data;
      const updatedUser = { ...user, profiles: updatedProfiles };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (typeof profile === 'object' && profile?._id === profileId) {
        const currentProfileData = updatedProfiles.find((p: any) => p._id === profileId);
        if (currentProfileData) {
          setProfile(currentProfileData);
          localStorage.setItem("profile", JSON.stringify(currentProfileData));
        }
      }
    } catch (error) {
      console.error("Failed to update profile", error);
      throw error;
    }
  };

  const deleteProfile = async (profileId: string) => {
    if (!user) return;

    // Guest Mode
    if (isGuest) {
      const updatedProfiles = user.profiles?.filter(p => p._id !== profileId);
      const updatedUser = { ...user, profiles: updatedProfiles };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (typeof profile === 'object' && profile?._id === profileId) {
        setProfile(null);
        localStorage.removeItem("profile");
      }
      return;
    }

    // Backend Mode
    try {
      const response = await backendAxios.delete(`/profiles/${profileId}`);
      const updatedProfiles = response.data.data;
      const updatedUser = { ...user, profiles: updatedProfiles };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (typeof profile === 'object' && profile?._id === profileId) {
        setProfile(null);
        localStorage.removeItem("profile");
      }
    } catch (error) {
      console.error("Failed to delete profile", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, isGuest, loginAsGuest, login, signup, logout, selectProfile, updateMyList, saveWatchProgress, addSearchHistory, deleteWatchProgress, createProfile, updateProfile, deleteProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
