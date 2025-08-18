// app/api/auth/[...nextauth]/route.ts
"use server";

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { url } from "@/config/urls";

interface AuthUser extends AdapterUser {
  phone: string;
  full_name: string;
  user_type: string;
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

// Helper to refresh access token
async function refreshAccessToken(token: any) {
  try {
    const res = await fetch(url("/auth/refresh"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token.access_token }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) throw data;

    return {
      ...token,
      access_token: data.data.access_token,
      accessTokenExpires: Date.now() + data.data.expires_in * 1000,
      error: undefined,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
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
        if (!credentials?.phone || !credentials?.password) return null;

        try {
          const res = await fetch(url("/auth/login"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phone: credentials.phone,
              password: credentials.password,
              login_type: "password",
            }),
          });

          const result = await res.json();

          if (!res.ok || !result.success) return null;

          const { access_token, user, expires_in } = result.data;
          if (!user || !access_token) return null;

          return {
            ...user,
            access_token,
            expires_in,
          } as AuthUser;
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
      // Initial login
      if (user) {
        const u = user as AuthUser;
        return {
          ...token,
          access_token: u.access_token,
          accessTokenExpires: Date.now() + (u.expires_in || 3600) * 1000,
          user: {
            id: u.id || "",
            phone: u.phone,
            full_name: u.full_name,
            user_type: u.user_type,
          },
        };
      }

      // If token is not expired, return it
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Token expired, refresh it
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user as AuthUser;
        session.user.access_token = token.access_token as string;
      }
      if (token?.error) {
        session.error = token.error as string | undefined;
      }

      return session;
    },

    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const { handlers } = NextAuth(authOptions);
export const GET = handlers.GET;
export const POST = handlers.POST;
