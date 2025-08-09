import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    auth_token?: string;
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
