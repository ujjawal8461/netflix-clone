import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  profile: string | null;
  login: (email: string, password?: string) => Promise<void>;
  signup: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  selectProfile: (profileName: string) => void;
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

  const login = async (email: string, _password?: string) => {
    // For "without DB", we'll check against a "users" list in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find((u: User) => u.email === email);

    if (foundUser || email === "guest@example.com") {
      const userData = foundUser || { email, name: email.split("@")[0] };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      throw new Error("User not found. Please sign up.");
    }
  };

  const signup = async (email: string, _password?: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u: User) => u.email === email)) {
      throw new Error("User already exists.");
    }

    const newUser = { email, name: email.split("@")[0] };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    
    // Auto login after signup
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
  };

  const selectProfile = (profileName: string) => {
    setProfile(profileName);
    localStorage.setItem("profile", profileName);
  };

  return (
    <AuthContext.Provider value={{ user, profile, login, signup, logout, selectProfile }}>
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
