/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars*/




import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ingeniat",
  description: "Sistema de gestión educativa para colegios",
  keywords: ["Educativa S.A.S", "Sistema de gestión educativa", "Colegios", "Educación","Norma", "Gestión educativa", "Norma Clone"],
  icons: {
    icon: "https://norma.ingeniat.com/assets/icon/favicon.png",
  },
};

export default function ClicUpLayout({ children }: { children: React.ReactNode }) {
  

  return <div>{children}</div>;
}
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars*/
