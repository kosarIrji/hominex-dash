// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AdapterUser } from "next-auth/adapters";
import type { NextAuthConfig } from "next-auth";
import { url } from "@/config/urls";

interface AuthUser extends AdapterUser {
  phone: string;
  full_name: string;
  user_type: string;
  access_token: string;
}

const authOptions: NextAuthConfig = {
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<AuthUser | null> {
        if (!credentials?.phone || !credentials?.password) {
          console.log("Missing credentials:", credentials);
          return null;
        }

        try {
          const res = await fetch(url("/auth/login"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phone: credentials.phone,
              password: credentials.password,
              login_type: "password",
            }),
            redirect: "manual",
          });

          // console.log("Raw Response:", {
          //   status: res.status,
          //   statusText: res.statusText,
          //   headers: Object.fromEntries(res.headers.entries()),
          // });

          let result;
          try {
            result = await res.json();
          } catch (parseError) {
            console.error("Failed to parse JSON:", parseError);
            return null;
          }

          // console.log("Parsed Result:", result);

          if (!res.ok || !result.success) {
            console.error("Login failed:", { status: res.status, result });
            return null;
          }

          const { access_token, user } = result.data;
          if (!user || !access_token) {
            console.error("Missing user or access_token:", result);
            return null;
          }

          return { ...user, access_token } as AuthUser;
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      // console.log("JWT Callback - User:", user, "Token:", token);
      if (user) {
        const u = user as AuthUser;
        token.access_token = u.access_token;
        token.user = {
          id: u.id || "",
          phone: u.phone,
          full_name: u.full_name,
          user_type: u.user_type,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // console.log("Session Callback - Token:", token, "Session:", session);
      if (token?.user) {
        session.user = token.user as AuthUser;
        session.user.access_token = token.access_token as string;
      } else {
        console.warn("No user data in token:", token);
      }
      return session;
    },
    async redirect({ baseUrl }) {
      return baseUrl; // Ensures redirect to https://dash.hominow.ir
    },
  },
  secret: "bJNWiw4XmzEsjvFuUNDAM721g+yTm3oZu0Ot0jtSvsM=",
};

const { handlers } = NextAuth(authOptions);

export const GET = handlers.GET;
export const POST = handlers.POST;
