
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */



import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Educativa S.A.S",
  description: "Sistema de gestión educativa para colegios",
  keywords: ["Educativa S.A.S", "Sistema de gestión educativa", "Colegios", "Educación","Norma", "Gestión educativa", "Norma Clone"],
  icons: {
    icon: "https://cdn-rstr.stn-neds.com/Logo EDU H_32px.png",
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  

  return <div>{children}</div>;
}
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
