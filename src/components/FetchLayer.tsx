"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchClientProfile } from "@/redux/Slices/authSlice";
import { fetchNotifications } from "@/redux/Slices/notificationSlice";
import { signOut, useSession } from "next-auth/react";
import FullPageLoader from "@/components/UI/LoadingScreen";
import { url } from "@/config/urls";
import { errorToast } from "@/config/Toasts";

type Props = {
  children: React.ReactNode;
};

export default function FetchLayer({ children }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const session = useSession();

  // Get loading states from both slices
  const authLoading = useSelector(
    (state: RootState) => state.authSlice.loading
  );
  const notificationsLoading = useSelector(
    (state: RootState) => state.Notification.loading
  );

  useEffect(() => {
    // Wait until session is fully loaded
    if (session.status === "authenticated") {
      const token = session?.data?.user?.access_token as string;

      dispatch(fetchNotifications(token));
      dispatch(fetchClientProfile(token));

      const tokenCheck = async () => {
        try {
          const res = await fetch(url("/auth/me"), {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            errorToast("نشست شما به پایان رسید.");
            setTimeout(() => signOut(), 2000);
            return;
          }

          const data = await res.json();
          console.log("User data:", data);
        } catch (e) {
          console.error("Error in tokenCheck:", e);
        }
      };

      tokenCheck();
    }
  }, [session, dispatch]);

  // Show loader while session is loading or slices are loading
  if (session.status === "loading" || authLoading || notificationsLoading) {
    return <FullPageLoader />;
  }

  // If session is unauthenticated, redirect to login or show loader
  if (session.status === "unauthenticated") {
    return <FullPageLoader />;
  }

  return <>{children}</>;
}
