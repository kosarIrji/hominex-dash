import type { Metadata } from "next";
import "../globals.css";
import Wrapper from "@/components/Wrapper";
import Nav from "@/components/dash/Nav";
import Sidebar from "@/components/dash/Sidebar";
import Socials from "@/components/UI/Socials";
import Session from "@/components/Session";

export const metadata: Metadata = {
  title: "هومینکس | داشبورد",
  description: "صفحه داشبورد شرکت هومینکس",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Wrapper>
        <Session>
          <Nav />
          <Sidebar />
          {children}
        </Session>
      </Wrapper>
      <Socials />
    </>
  );
}
