"use client";
import { redirect } from "next/navigation";

export const HomeView = () => {
  redirect("/meetings");
  return null;
}