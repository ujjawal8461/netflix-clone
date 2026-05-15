import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  email: string;
  name: string;
  password?: string;
  myList?: any[];
}

interface AuthContextType {
  user: User | null;
  profile: string | null;
  login: (email: string, password?: string) => Promise<void>;
  signup: (email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  selectProfile: (profileName: string) => void;
  updateMyList: (movie: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState<string | null>(() => {
    return localStorage.getItem("profile");
  });

  const login = async (email: string, password?: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find((u: User) => u.email === email);

    if (email === "guest@example.com") {
      const guestUser = foundUser || { email, name: "Guest", myList: [] };
      setUser(guestUser);
      localStorage.setItem("user", JSON.stringify(guestUser));
      return;
    }

    if (foundUser) {
      if (foundUser.password === password) {
        setUser(foundUser);
        localStorage.setItem("user", JSON.stringify(foundUser));
      } else {
        throw new Error("Invalid password. Please try again.");
      }
    } else {
      throw new Error("User not found. Please sign up.");
    }
  };

  const signup = async (email: string, password?: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u: User) => u.email === email)) {
      throw new Error("User already exists.");
    }

    const newUser = { email, name: email.split("@")[0], password, myList: [] };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    setProfile(null);
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
  };

  const selectProfile = (profileName: string) => {
    setProfile(profileName);
    localStorage.setItem("profile", profileName);
  };

  const updateMyList = (movie: any) => {
    if (!user) return;
    
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex((u: User) => u.email === user.email);
    
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
    
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem("users", JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, login, signup, logout, selectProfile, updateMyList }}>
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
