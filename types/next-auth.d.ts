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
    error?: string; // optional error from token refresh
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
    accessTokenExpires?: number; // expiration timestamp in ms
    error?: string; // optional error from refresh
  }
}
