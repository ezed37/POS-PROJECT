import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const INACTIVITY_TIME = 60 * 1000; // 60 seconds

export default function AutoLogout() {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const logout = () => {
    // Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(logout, INACTIVITY_TIME);
  };

  useEffect(() => {
    // Events that mean "user is active"
    const events = ["mousemove", "keydown", "click", "scroll"];

    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Start timer first time
    resetTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, []);
}
