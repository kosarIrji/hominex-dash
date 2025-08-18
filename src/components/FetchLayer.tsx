"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchClientProfile } from "@/redux/Slices/authSlice";
import { fetchNotifications } from "@/redux/Slices/notificationSlice";
import { useSession } from "next-auth/react";
import FullPageLoader from "@/components/UI/LoadingScreen";

type Props = {
  children: React.ReactNode;
};

export default function FetchLayer({ children }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const session = useSession();
  const token = session.data?.user?.access_token;
  // console.log(token);
  // Get loading states from both slices
  const authLoading = useSelector(
    (state: RootState) => state.authSlice.loading
  );
  const notificationsLoading = useSelector(
    (state: RootState) => state.Notification.loading
  );

  useEffect(() => {
    if (token) {
      dispatch(fetchNotifications(token));
      dispatch(fetchClientProfile(token));
    }
  }, [token, dispatch]);

  // Show loader while either auth or notifications data is loading
  if (!token || authLoading || notificationsLoading) {
    return <FullPageLoader />;
  }

  return <>{children}</>;
}
