import { useEffect, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { FaSpinner } from "react-icons/fa";
import useAuthStore from "@/store/auth";
import api from "@/utils/api";

/**
 * Hydrates the Zustand auth store from GET /v1/auth/me on app load.
 * Guests can still browse; failed profile only clears the session.
 */
const AuthHydrateProvider = ({ children }: { children: React.ReactNode }) => {
  const { login, logout } = useAuthStore();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const hydrateSession = async () => {
      try {
        const { data } = await api.get("/v1/auth/me");
        if (cancelled) return;

        if (data?.user) {
          login(data.user);
          if (pathname.startsWith("/auth")) {
            navigate({ to: "/shop", replace: true });
          }
        }
      } catch {
        if (cancelled) return;
        logout();
      } finally {
        if (!cancelled) {
          setCheckingAuth(false);
        }
      }
    };

    void hydrateSession();

    return () => {
      cancelled = true;
    };
    // Hydrate once on mount; pathname is read for initial redirect only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checkingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-ash">
        <FaSpinner className="animate-spin text-4xl text-scotch" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthHydrateProvider;
