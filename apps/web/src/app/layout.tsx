import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "On Lok Patient Photo Intake | Demo",
  description: "A demo patient and caregiver photo intake portal with a mock clinical review queue.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
