import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { createContext, useCallback, useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminContextValue {
  isAdmin: boolean;
  token: string | null;
  login: (
    adminId: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const SESSION_KEY = "asc_admin_session";
const TTL_MS = 60 * 60 * 1000; // 60 minutes

function readStoredSession(): { token: string; expiresAt: number } | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { token: string; expiresAt: number };
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const AdminContext = createContext<AdminContextValue>({
  isAdmin: false,
  token: null,
  login: async () => ({ ok: false, error: "Not initialised" }),
  logout: () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { actor, isFetching } = useActor(createActor);
  const [token, setToken] = useState<string | null>(() => {
    const s = readStoredSession();
    return s ? s.token : null;
  });

  // Validate stored token against backend on mount
  useEffect(() => {
    if (!actor || isFetching || !token) return;
    actor.adminValidateToken(token).then((valid) => {
      if (!valid) {
        localStorage.removeItem(SESSION_KEY);
        setToken(null);
      }
    });
  }, [actor, isFetching, token]);

  const login = useCallback(
    async (
      adminId: string,
      password: string,
    ): Promise<{ ok: boolean; error?: string }> => {
      if (adminId !== "PHARMACYGUIDE") {
        return { ok: false, error: "Invalid credentials" };
      }
      if (!actor) return { ok: false, error: "Backend not ready" };
      const result = await actor.adminLogin(adminId, password);
      if (result.__kind__ === "ok") {
        const t = result.ok;
        const session = { token: t, expiresAt: Date.now() + TTL_MS };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setToken(t);
        return { ok: true };
      }
      return { ok: false, error: "Invalid credentials" };
    },
    [actor],
  );

  const logout = useCallback(() => {
    if (actor && token) {
      actor.adminLogout(token).catch(() => {});
    }
    localStorage.removeItem(SESSION_KEY);
    setToken(null);
  }, [actor, token]);

  return (
    <AdminContext.Provider value={{ isAdmin: !!token, token, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}
