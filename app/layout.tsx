import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Teleprompter · subarna.me",
  description:
    "Local-first web teleprompter for news and presentations. Smooth auto-scroll, reading guide, Bangla presets, and same-browser remote control — all in your browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
