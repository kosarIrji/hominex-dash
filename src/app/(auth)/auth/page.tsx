import React from "react";
import Signup from "@/components/auth/Signup";
import Login from "@/components/auth/Login";
export default function page() {
  return (
    <div className="relative py-16 h-[100vh] z-10">
      <Login />
      {/* <Signup /> */}
    </div>
  );
}
