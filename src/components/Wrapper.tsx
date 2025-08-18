"use client";

import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
type componentType = {
  children: ReactNode;
};

export default function Wrapper({ children }: componentType) {
  return (
    <Provider store={store}>
      <SessionProvider>
        {children}
        <ToastContainer rtl />
      </SessionProvider>
    </Provider>
  );
}
