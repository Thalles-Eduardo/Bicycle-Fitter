import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ride Your Bike",
  description: "High-performance bike assembly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden bg-black">
        <div
          id="swup"
          className="relative w-full min-h-screen"
        >
          {children}
        </div>
      </body>
    </html>
  );
}