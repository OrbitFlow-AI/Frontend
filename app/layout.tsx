// Root layout: applies global styles and metadata to every route in the app.
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OrbitFlow — AI Agent Treasury & Micropayment Router",
  description:
    "Provision agent treasuries, define spend policies, and monitor micropayments between AI agents on Stellar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
