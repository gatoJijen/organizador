import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export const POST = async (req: Request) => {
  try {
    const { username, password } = await req.json();
    console.log("🔹 Recibido en backend:", { username, password });

    // Buscar usuario en la base de datos
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username) // Asegúrate de que coincida con la BD
      .limit(10);

    console.log("🔹 Resultado de Supabase:", { users, error });

    if (error || !users || users.length === 0) {
      console.log("❌ Usuario no encontrado.");
      return NextResponse.json({ error: "Nombre de usuario no válido" }, { status: 401 });
    }

    const user = users[0];

    // Comparar contraseñas
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("🔹 Contraseña correcta:", passwordMatch);

    if (!passwordMatch) {
      console.log("❌ Contraseña incorrecta.");
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 402 });
    }

    // Generar token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "168h" });

    console.log("✅ Login exitoso, token generado.");
    return NextResponse.json({ token }, { status: 200 });

  } catch (err) {
    console.error("❌ Error en el servidor:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
};
