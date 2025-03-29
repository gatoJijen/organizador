// app/dashboard/layout.tsx
import { redirect } from "next/navigation";
import { getUserWithRole } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserWithRole();

  if (!user) redirect("/");

  return <div>{children}</div>;
}
