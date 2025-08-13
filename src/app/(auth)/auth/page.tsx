"use client";
import React from "react";
import Signup from "@/components/auth/Signup";
import Login from "@/components/auth/Login";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function page() {
  const toggleAuth = useSelector(
    (state: RootState) => state.authSlice.toggleAuthPanel
  );
  return (
    <div className="flex justify-center items-center py-16 h-[100vh] z-10">
      {toggleAuth ? <Login /> : <Signup />}
    </div>
  );
}
