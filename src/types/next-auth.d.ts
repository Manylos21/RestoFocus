import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "CUSTOMER" | "RESTAURANT_ADMIN" | "SUPER_ADMIN";
      restaurantId: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: "CUSTOMER" | "RESTAURANT_ADMIN" | "SUPER_ADMIN";
    restaurantId: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    role?: "CUSTOMER" | "RESTAURANT_ADMIN" | "SUPER_ADMIN";
    restaurantId?: string | null;
  }
}
