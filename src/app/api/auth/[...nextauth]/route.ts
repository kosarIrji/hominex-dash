import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { AdapterUser } from "next-auth/adapters";

interface AuthUser extends AdapterUser {
  phone: string;
  full_name: string;
  user_type: string;
  access_token: string;
}

const { auth, handlers } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<AuthUser | null> {
        try {
          const res = await fetch("https://amirpeyravan.ir/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phone: credentials?.phone,
              password: credentials?.password,
              login_type: "password",
            }),
          });

          const result = await res.json();

          if (!res.ok || !result.success) return null;

          const { access_token, user } = result.data;
          return { ...user, access_token };
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
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.access_token = (user as AuthUser).access_token;
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as AuthUser;
      session.access_token = token.access_token as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export const { GET, POST } = handlers;
