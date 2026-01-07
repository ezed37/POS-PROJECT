import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import AuthContext from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (!decoded.exp || decoded.exp < now) {
        localStorage.removeItem("token");
        setUser(null);
      } else {
        setUser(decoded);
      }
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    }

    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
