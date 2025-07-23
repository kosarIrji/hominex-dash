"use client";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { TbRouteAltRight } from "react-icons/tb";
import dynamic from "next/dynamic";

// main routes
const Main = dynamic(() => import("../components/paths/Main"), {
  loading: () => "loading ...",
});
const Tickets = dynamic(() => import("../components/paths/Tickets"), {
  loading: () => "loading ...",
});
const Management = dynamic(() => import("../components/paths/Management"), {
  loading: () => "loading ...",
});
const Liked = dynamic(() => import("../components/paths/Liked"), {
  loading: () => "loading ...",
});
const Account = dynamic(() => import("../components/paths/Account"), {
  loading: () => "loading ...",
});

export default function page() {
  const route = useSelector((state: RootState) => state.routeSwitch.route);
  return (
    <div dir="ltr" className="p-5">
      <span className="text-[12px] flex flex-row items-center gap-2">
        <TbRouteAltRight className="text-[15px]" />{" "}
        <span className="text-gray-500">Dashboard /</span>
        {route === "dashboard" ? "" : route}
      </span>
      <div className="bg-[var(--background)] my-5 shadow-2xl rounded-md p-5">
        {route === "dashboard" && <Main />}
        {route === "ticket" && <Tickets />}
        {route === "management" && <Management />}
        {route === "liked" && <Liked />}
        {route === "account" && <Account />}
      </div>
    </div>
  );
}
