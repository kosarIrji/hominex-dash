import type { Metadata } from "next";
import "./globals.css";
import Wrapper from "@/components/Wrapper";
import Nav from "@/components/dash/Nav";
import Sidebar from "@/components/dash/Sidebar";

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
    <html lang="fa" dir="rtl">
      <body className="font-['Morabba']">
        <Wrapper>
          <Nav />
          <Sidebar />
          {children}
        </Wrapper>
      </body>
    </html>
  );
}
