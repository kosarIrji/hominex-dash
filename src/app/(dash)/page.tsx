"use client";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { TbRouteAltRight } from "react-icons/tb";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/UI/LoadingSpinner";

// main routes
const Main = dynamic(() => import("../../components/paths/Main"), {
  loading: () => <LoadingSpinner />,
});
const Tickets = dynamic(() => import("../../components/paths/Tickets"), {
  loading: () => <LoadingSpinner />,
});
const Management = dynamic(() => import("../../components/paths/Management"), {
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

export default function page() {
  const route = useSelector((state: RootState) => state.routeSwitch.route);
  return (
    <div dir="ltr" className="px-5 py-3">
      <span className="text-[12px] flex flex-row items-center gap-2">
        <TbRouteAltRight className="text-[15px]" />{" "}
        <span className="text-gray-500">Dashboard /</span>
        {route === "dashboard" ? "" : route}
      </span>
      <div
        className="bg-[var(--background)] my-1 shadow-2xl rounded-md p-5 overflow-x-hidden overflow-y-auto]"
        style={{ height: "calc(100vh - 150px)" }}>
        {route === "dashboard" && <Main />}
        {route === "ticket" && <Tickets />}
        {route === "management" && <Management />}
        {route === "liked" && <Liked />}
        {route === "account" && <Account />}
        {route === "UsersManagement" && <UsersManagement />}
        {route === "consultation" && <ConsultationRequests />}
      </div>
    </div>
  );
}
