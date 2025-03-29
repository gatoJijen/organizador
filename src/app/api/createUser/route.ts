import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const POST = async (req: Request) => {
  try {
    console.log("📌 Recibiendo solicitud para crear usuario...");

    const { username, password, role } = await req.json();
    console.log("📌 Datos recibidos:", { username, password, role });

    const authHeader = req.headers.get("authorization");
    console.log("📌 Header de autorización:", authHeader);

    if (authHeader !== `Bearer ${process.env.NEXT_PUBLIC_JWT_SECRET}`) {
      console.error("❌ Error: No autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Hashear la contraseña
    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log("📌 Contraseña hasheada correctamente");

    // Insertar usuario en Supabase
    const { data, error } = await supabase
      .from("users")
      .insert([{ username, password: hashedPassword, role }]);

    if (error) {
      console.error("❌ Error al insertar en Supabase:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("✅ Usuario creado correctamente:", data);
    return NextResponse.json({ message: "Usuario creado", user: data }, { status: 201 });
  } catch (err: any) {
    console.error("❌ Error en createUser:", err.message, err.stack);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
