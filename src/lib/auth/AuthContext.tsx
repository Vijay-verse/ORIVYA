"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile, UserRole } from "@/types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSupabaseLive: boolean;
  login: (email: string, password?: string, demoRole?: UserRole) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, fullName: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const DEFAULT_DEMO_USER: UserProfile = {
  id: "a0000000-0000-0000-0000-000000000001",
  name: "Vijay Sharma",
  email: "vijay.traveler@example.com",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  role: "traveller",
  walletBalance: 1500,
};

const DEMO_ADMIN_USER: UserProfile = {
  id: "a0000000-0000-0000-0000-000000000099",
  name: "ORIVYA Operations Admin",
  email: "admin@orivya.com",
  phone: "+91 99999 88888",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  role: "admin",
  walletBalance: 50000,
};

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY_AUTH = "orivya_auth_user_v1";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_DEMO_USER);
  const [isLoading, setIsLoading] = useState(false);
  const isSupabaseLive = isSupabaseConfigured();

  useEffect(() => {
    // Check saved session
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) {
        setUser(JSON.parse(saved));
      } else {
        setUser(DEFAULT_DEMO_USER);
      }
    } catch {
      setUser(DEFAULT_DEMO_USER);
    }
  }, []);

  const saveUserSession = (newUser: UserProfile | null) => {
    setUser(newUser);
    try {
      if (newUser) {
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_AUTH);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const login = async (
    email: string,
    password?: string,
    demoRole: UserRole = "traveller"
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseLive) {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password || "password123",
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          // Fetch profile from supabase profiles table
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

          const activeProfile: UserProfile = {
            id: data.user.id,
            name: profile?.full_name || data.user.user_metadata?.full_name || email.split("@")[0],
            email: data.user.email || email,
            phone: profile?.phone || "+91 98765 43210",
            avatar: profile?.avatar_url || DEFAULT_DEMO_USER.avatar,
            role: (profile?.role as UserRole) || "traveller",
            walletBalance: Number(profile?.wallet_balance) || 1500,
          };
          saveUserSession(activeProfile);
          setIsLoading(false);
          return { success: true };
        }
      }

      // Safe Demo / Local Login Simulation
      await new Promise((r) => setTimeout(r, 600));
      const targetUser =
        demoRole === "admin" || email.toLowerCase().includes("admin")
          ? DEMO_ADMIN_USER
          : {
              ...DEFAULT_DEMO_USER,
              email,
              name: email.split("@")[0].replace(".", " "),
              role: demoRole,
            };

      saveUserSession(targetUser);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || "Login failed" };
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    phone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseLive) {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, phone },
          },
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const newProfile: UserProfile = {
            id: data.user.id,
            name: fullName,
            email,
            phone: phone || "+91 98765 43210",
            avatar: DEFAULT_DEMO_USER.avatar,
            role: "traveller",
            walletBalance: 1000,
          };
          saveUserSession(newProfile);
          setIsLoading(false);
          return { success: true };
        }
      }

      // Demo Registration
      await new Promise((r) => setTimeout(r, 600));
      const newProfile: UserProfile = {
        id: `user-${Date.now()}`,
        name: fullName,
        email,
        phone: phone || "+91 98765 43210",
        avatar: DEFAULT_DEMO_USER.avatar,
        role: "traveller",
        walletBalance: 1000,
      };
      saveUserSession(newProfile);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || "Registration failed" };
    }
  };

  const logout = async () => {
    if (isSupabaseLive) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    saveUserSession(null);
  };

  const switchDemoRole = (newRole: UserRole) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      role: newRole,
      name: newRole === "admin" ? "ORIVYA Operations Admin" : "Vijay Sharma",
    };
    saveUserSession(updated);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    saveUserSession(updated);

    if (isSupabaseLive) {
      const supabase = createClient();
      await supabase
        .from("profiles")
        .update({
          full_name: updates.name,
          phone: updates.phone,
          avatar_url: updates.avatar,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "traveller",
        isAuthenticated: Boolean(user),
        isLoading,
        isSupabaseLive,
        login,
        register,
        logout,
        switchDemoRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
