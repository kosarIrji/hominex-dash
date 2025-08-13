import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    auth_token?: string;
    access_token?: string; // so you can directly store it here
    user: {
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
    auth_token?: string;
    access_token?: string;
    user?: {
      id: string;
      phone: string;
      full_name: string;
      user_type: string;
      access_token: string;
    };
  }
}
