// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";

export const runtime = "nodejs";


export const metadata = {
  title: "Streamforge",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
