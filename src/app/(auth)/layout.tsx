import type { Metadata } from "next";
import Wrapper from "@/components/Wrapper";

export const metadata: Metadata = {
  title: "هومینکس | داشبورد",
  description:
    "ورود یا ثبت‌نام در پلتفرم مدیریت درخواست‌ها برای دسترسی به خدمات و امکانات",
  keywords: ["ورود", "ثبت‌نام", "مدیریت درخواست‌ها", "پلتفرم"],
  openGraph: {
    title: "ورود به پلتفرم درخواست‌ها",
    description: "ورود یا ثبت‌نام در پلتفرم مدیریت درخواست‌ها",
    url: "https://dash.hominow.ir/auth", // Replace with your actual domain
    siteName: "داشبورد هومینکس",
    locale: "fa_IR",
    type: "website",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative h-screen w-screen bg-gray-100 bg-cover"
      style={{ backgroundImage: "url('/assets/img/_login.jpg')" }}>
      <Wrapper>{children}</Wrapper>
    </div>
  );
}
