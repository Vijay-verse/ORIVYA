"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Bell, 
  CheckCircle2, 
  Ticket, 
  Car, 
  Briefcase, 
  Clock, 
  X,
  Sparkles
} from "lucide-react";
import { INITIAL_NOTIFICATIONS, InAppNotification, NotificationService } from "@/services/notificationService";

export const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<InAppNotification[]>(INITIAL_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getIcon = (type: InAppNotification["type"]) => {
    switch (type) {
      case "booking_confirmed":
      case "payment_success":
        return <Ticket className="h-4 w-4 text-emerald-600" />;
      case "cab_update":
        return <Car className="h-4 w-4 text-amber-600" />;
      case "trip_reminder":
        return <Briefcase className="h-4 w-4 text-indigo-600" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="relative">
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in zoom-in-95 duration-150">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                  {unreadCount} New
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[11px] font-bold text-indigo-600 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No notifications right now.
              </div>
            ) : (
              notifications.map((notif) => (
                <Link
                  key={notif.id}
                  href={notif.link || "/bookings"}
                  onClick={() => setIsOpen(false)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors block text-xs ${
                    !notif.isRead ? "bg-indigo-50/20" : ""
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="font-bold text-slate-900 leading-tight">
                      {notif.title}
                    </p>
                    <p className="text-slate-500 leading-snug text-[11px]">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium block pt-1">
                      {NotificationService.formatRelativeTime(notif.createdAt)}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
            <Link
              href="/bookings"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-bold text-indigo-600 hover:underline"
            >
              View All Travel Activity
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
