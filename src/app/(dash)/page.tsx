"use client";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { TbRouteAltRight } from "react-icons/tb";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import AllProperties from "@/components/paths/AllProperties";
import Promotions from "@/components/paths/Promotions";
import { RiHome3Line } from "react-icons/ri";
import Link from "next/link";
// main routes
const Main = dynamic(() => import("../../components/paths/Main"), {
  loading: () => <LoadingSpinner />,
});
const Tickets = dynamic(() => import("../../components/paths/Tickets"), {
  loading: () => <LoadingSpinner />,
});
const Properties = dynamic(() => import("../../components/paths/Properties"), {
  loading: () => <LoadingSpinner />,
});
const Liked = dynamic(() => import("../../components/paths/Liked"), {
  loading: () => <LoadingSpinner />,
});
const Account = dynamic(() => import("../../components/paths/Account"), {
  loading: () => <LoadingSpinner />,
});
const ConsultationRequests = dynamic(
  () => import("../../components/paths/ConsultationRequests"),
  {
    loading: () => <LoadingSpinner />,
  }
);
const UsersManagement = dynamic(
  () => import("../../components/paths/UsersManagement"),
  {
    loading: () => <LoadingSpinner />,
  }
);
const Clients = dynamic(() => import("../../components/paths/Clients"), {
  loading: () => <LoadingSpinner />,
});

export default function Page() {
  const route = useSelector((state: RootState) => state.routeSwitch.route);

  return (
    <div dir="ltr" className="md:px-5 px-0 py-3 ">
      <span className="text-[12px] md:pl-0 pl-5 flex flex-row items-center gap-2">
        <TbRouteAltRight className="text-[15px]" />{" "}
        <span className="text-gray-500">Dashboard /</span>
        {route === "dashboard" ? "" : route}
      </span>
      <div
        className="bg-[var(--background)]/70 backdrop-blur-md my-1 shadow-2xl md:rounded-md p-5 overflow-x-hidden overflow-y-auto"
        style={{ height: "calc(100vh - 150px)" }}>
        {route === "dashboard" && <Main />}
        {route === "ticket" && <Tickets />}
        {route === "properties" && <Properties />}
        {route === "liked" && <Liked />}
        {route === "account" && <Account />}
        {route === "UsersManagement" && <UsersManagement />}
        {route === "consultation" && <ConsultationRequests />}
        {route === "allProperties" && <AllProperties />}
        {route === "promotions" && <Promotions />}
        {route === "clients" && <Clients />}
      </div>
      <Link href={"https://hominex.ir"}>
        <RiHome3Line className="fixed bottom-10 left-10 cursor-pointer transition-colors hover:bg-blue-600 text-white backdrop-blur-2xl  bg-blue-400 shadow-2xl shadow-gray-400 rounded-md  min-w-6 box-content h-auto p-3" />
      </Link>
    </div>
  );
}
