import type { Metadata } from "next";
import "./globals.css";
import Wrapper from "@/components/Wrapper";
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
        <Wrapper>{children}</Wrapper>
      </body>
    </html>
  );
}
