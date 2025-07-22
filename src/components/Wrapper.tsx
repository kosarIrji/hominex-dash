"use client";

import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

type componentType = {
  children: ReactNode;
};

export default function Wrapper({ children }: componentType) {
  return <Provider store={store}>{children}</Provider>;
}
