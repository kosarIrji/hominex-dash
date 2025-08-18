// types/next-auth.d.ts

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id: string;
      phone: string;
      full_name: string;
      user_type: string;
      access_token: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    phone: string;
    full_name: string;
    user_type: string;
    access_token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    phone: string;
    full_name: string;
    user_type: string;
    access_token: string;
  }
}
