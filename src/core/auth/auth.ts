import { PrismaAdapter } from "@auth/prisma-adapter";
import type { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { prisma } from "@/shared/lib/prisma";

type AuthorizedUser = {
  id: string;
  email: string;
  role: UserRole;
  restaurantId: string | null;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "EmailPassword",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string" ? credentials.email : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";

        if (email.length === 0 || password.length === 0) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            ownedRestaurants: {
              select: { id: true },
              take: 1,
            },
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
          return null;
        }

        const authorizedUser: AuthorizedUser = {
          id: user.id,
          email: user.email,
          role: user.role,
          restaurantId: user.ownedRestaurants[0]?.id ?? null,
        };

        return authorizedUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authorizedUser = user as AuthorizedUser;
        token["id"] = authorizedUser.id;
        token["email"] = authorizedUser.email;
        token["role"] = authorizedUser.role;
        token["restaurantId"] = authorizedUser.restaurantId;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const role = token["role"];
        session.user.id = typeof token["id"] === "string" ? token["id"] : "";
        session.user.email =
          typeof token["email"] === "string" ? token["email"] : session.user.email;
        session.user.role =
          role === "CUSTOMER" || role === "RESTAURANT_ADMIN" || role === "SUPER_ADMIN"
            ? role
            : "CUSTOMER";
        session.user.restaurantId =
          typeof token["restaurantId"] === "string" ? token["restaurantId"] : null;
      }

      return session;
    },
  },
});
