// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Extend the default Session interface
   */
  interface Session extends DefaultSession {
    user?: {
      id: string;
      phone: string;
      full_name: string;
      user_type: string;
      access_token: string;
    } & DefaultSession["user"];
  }

  /**
   * Extend the default User interface
   */
  interface User extends DefaultUser {
    id: string;
    phone: string;
    full_name: string;
    user_type: string;
    access_token: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extend the JWT interface
   */
  interface JWT {
    access_token: string;
    user: {
      id: string;
      phone: string;
      full_name: string;
      user_type: string;
    };
  }
}
