"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn } from "@/core/auth/auth";
import { prisma } from "@/shared/lib/prisma";

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function loginAction(formData: FormData) {
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const callbackUrl = getString(formData, "callbackUrl") || "/";

  if (!email || !password) {
    redirect("/login?error=missing_login_fields");
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl.startsWith("/") ? callbackUrl : "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=invalid_credentials");
    }

    throw error;
  }
}

export async function registerCustomerAction(formData: FormData) {
  const prenom = getString(formData, "prenom");
  const nom = getString(formData, "nom");
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const confirmPassword = getString(formData, "confirmPassword");

  if (!prenom || !nom || !email || !password || !confirmPassword) {
    redirect("/login?signupError=missing_fields");
  }

  if (!isValidEmail(email)) {
    redirect("/login?signupError=invalid_email");
  }

  if (password.length < 8) {
    redirect("/login?signupError=password_too_short");
  }

  if (password !== confirmPassword) {
    redirect("/login?signupError=password_mismatch");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    redirect("/login?signupError=email_exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      prenom,
      nom,
      email,
      passwordHash,
      role: "CUSTOMER",
    },
  });

  redirect("/login?registered=1");
}