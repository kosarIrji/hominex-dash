import type { Metadata } from "next";
import "./globals.css";

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
      <body className="font-['Morabba']">{children}</body>
    </html>
  );
}
