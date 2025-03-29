"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function getUserWithRole() {
  const cookieStore = cookies();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Obtener el rol del usuario desde la base de datos
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) return null;

  return { ...user, role: data.role };
}