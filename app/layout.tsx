import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HomeHelp Amsterdam",
  description: "A trusted hourly marketplace for home services in Amsterdam."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}