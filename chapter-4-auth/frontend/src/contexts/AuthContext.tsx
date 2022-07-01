import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, useEffect, useState } from "react";
import { api } from "../services/api";

interface User {
  email: string;
  permissions: string[];
  roles: string[];
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  user: User;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

let authChannel: BroadcastChannel;

export function signOut(withAuthChannel: boolean = true) {
  destroyCookie(null, "nextauth.token");
  destroyCookie(null, "nextauth.refreshToken");

  withAuthChannel && authChannel.postMessage("signOut");

  Router.push("/");
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>(null);

  const isAuthenticated = !!user;

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const {
        data: { permissions, roles, token, refreshToken },
      } = await api.post("sessions", { email, password });

      setCookie(null, "nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
      setCookie(null, "nextauth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });

      setUser({
        email,
        permissions,
        roles,
      });

      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      Router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();
    if (token) {
      api
        .get("/me")
        .then(({ data }) => {
          setUser({
            email: data.email,
            permissions: data.permissions,
            roles: data.roles,
          });
        })
        .catch(() => {
          signOut();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    authChannel = new BroadcastChannel("nextauth");

    authChannel.onmessage = message => {
      switch (message.data) {
        case "signOut":
          signOut(false);
          authChannel.close();
          break;
        default:
          break;
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
