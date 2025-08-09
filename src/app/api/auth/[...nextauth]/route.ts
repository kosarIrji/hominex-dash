import NextAuth, { User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";

// Define your NextAuth configuration inline
const { auth, handlers } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await fetch(
            "https://amirpeyravan.ir/api/auth/login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                phone: credentials?.phone,
                password: credentials?.password,
                login_type: "password",
              }),
            }
          );

          const result = await response.json();

          if (!response.ok || !result.success) {
            return null;
          }

          const { access_token, user } = result.data;

          return {
            id: user.id,
            phone: user.phone,
            full_name: user.full_name,
            user_type: user.user_type,
            access_token,
          };
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
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as AdapterUser & { access_token: string };
        token.user = customUser;
        token.auth_token = customUser.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as AdapterUser & User;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export const { GET, POST } = handlers;
