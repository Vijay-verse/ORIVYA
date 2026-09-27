"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Compass, 
  Bus, 
  Train, 
  Hotel, 
  Car, 
  Briefcase, 
  Ticket, 
  Wallet, 
  Menu, 
  X, 
  ShieldCheck,
  ChevronDown,
  ShieldAlert,
  LogIn
} from "lucide-react";
import { useTravelStore } from "@/lib/store";
import { useAuth } from "@/lib/auth/AuthContext";
import { formatCurrency } from "@/lib/utils";

export const Navbar = () => {
  const pathname = usePathname();
  const { trips, bookings } = useTravelStore();
  const { user, role, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Buses", href: "/bus", icon: Bus },
    { label: "Trains", href: "/train", icon: Train },
    { label: "Hotels", href: "/hotels", icon: Hotel },
    { label: "Cabs", href: "/cabs", icon: Car },
    { 
      label: "My Trips", 
      href: "/trips", 
      icon: Briefcase,
      badge: trips.length > 0 ? trips.length : undefined 
    },
    { 
      label: "Bookings", 
      href: "/bookings", 
      icon: Ticket,
      badge: bookings.length > 0 ? bookings.length : undefined
    },
  ];

  // If role is admin, include Admin Operations in desktop links
  if (role === "admin") {
    navLinks.push({
      label: "Admin Hub",
      href: "/admin",
      icon: ShieldAlert,
      badge: undefined,
    });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-2.5 transition-transform active:scale-95">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-white shadow-md shadow-indigo-500/25">
              <Compass className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                ORIVYA
              </span>
              <span className="text-[10px] font-medium tracking-wider uppercase text-indigo-600 -mt-1">
                Plan. Book. Travel.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 text-[10px] font-bold rounded-full bg-indigo-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User / Action Profile */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {/* Wallet pill */}
              <Link
                href="/profile"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                title="View Wallet Balance"
              >
                <Wallet className="h-3.5 w-3.5 text-indigo-600" />
                <span>Wallet:</span>
                <span className="text-indigo-600 font-bold">{formatCurrency(user.walletBalance)}</span>
              </Link>

              {/* User profile button */}
              <Link
                href="/profile"
                className="flex items-center gap-2.5 pl-2 py-1 pr-3 rounded-full border border-slate-200 bg-white hover:border-indigo-400 transition-colors shadow-xs"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-7 w-7 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-800 leading-tight">
                    {user.name.split(" ")[0]}
                  </span>
                  <span className="text-[10px] text-indigo-600 font-bold leading-tight uppercase">
                    {role}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {isAuthenticated && user ? (
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs text-indigo-600 font-bold uppercase">{role}</p>
                </div>
              </div>
              <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                {formatCurrency(user.walletBalance)}
              </div>
            </Link>
          ) : (
            <div className="pb-3 mb-2 border-b border-slate-100">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In to ORIVYA</span>
              </Link>
            </div>
          )}

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="h-4 px-1.5 text-[10px] font-bold rounded-full bg-indigo-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
