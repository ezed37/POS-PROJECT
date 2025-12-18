import { Navigate, Route, Routes } from "react-router-dom";
import { useContext, useState } from "react";
import LoginPage from "./pages/LoginPage";
import AuthContext from "./auth/AuthContext";
import AdminPage from "./pages/AdminPage";
import CashierPage from "./pages/CashierPage";
import Loading from "./components/Loading";

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/*"
        element={
          !user ? (
            <Navigate to="/login" replace />
          ) : user.role === "admin" ? (
            <AdminPage />
          ) : user.role === "cashier" ? (
            <CashierPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
