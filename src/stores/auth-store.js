import { authLogin } from "@/api/auth";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {jwtDecode} from "jwt-decode";

// helper function
const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const AuthStore = (set, get) => ({
  token: null,
  user: null,
  logoutTimer: null,

  actionLogin: async (data) => {
    const res = await authLogin(data);
    const token = res.data.access_token;

    set({
      token,
      user: res.data.payload,
    });

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp) {
        const expiresIn = decoded.exp * 1000 - Date.now();

        const { logoutTimer } = get();
        if (logoutTimer) clearTimeout(logoutTimer);

        const timerId = setTimeout(() => {
          get().actionLogout();
        }, expiresIn);

        set({ logoutTimer: timerId });
      }
    } catch (e) {
      console.error("decode token failed", e);
    }
  },

  actionLogout: () => {
    const { logoutTimer } = get();
    if (logoutTimer) clearTimeout(logoutTimer);

    set({ token: null, user: null, logoutTimer: null });
    // localStorage.removeItem("token")
  },

  reset: () => set({ token: null, user: null, logoutTimer: null }),

  checkToken: () => {
    const token = get().token;
    if (!token || isTokenExpired(token)) {
      get().actionLogout();
    }
  },
});

const userPersist = {
  name: "token",
  storage: createJSONStorage(() => localStorage),
};

const useAuthStore = create(persist(AuthStore, userPersist));

export default useAuthStore;
