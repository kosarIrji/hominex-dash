"use client";
import { RootState } from "../redux/store";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function page() {
  const client = useSelector((state: RootState) => state.authSlice.client);
  return (
    <div>
      fullname: {client.fullname}
      email: {client.email}
      phone: {client.phone}
      OTP: {client.OTP}
    </div>
  );
}
