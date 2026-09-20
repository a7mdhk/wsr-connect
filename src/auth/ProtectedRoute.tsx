import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const { user, isSRC, loading } = useAuth();

  if (loading) {
    return (
      <main
        style={{
          minHeight: "50vh",
          display: "grid",
          placeItems: "center",
          padding: "40px 20px",
        }}
      >
        <p style={{ color: "#73777C" }}>
          Checking access...
        </p>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isSRC) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}