import type { Metadata } from "next";
import { Geist, Geist_Mono, Kanit } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";
import localFont from "next/font/local";
import Footer from "@/components/footer";

const fontPrimary = Kanit({
  variable: "--font-primary",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const fontDisplay = localFont({
  variable: "--font-display",
  src: "/fonts/vcr-osd.woff2",
});

export const metadata: Metadata = {
  title: "Deeptalk cards",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontDisplay.className} ${fontPrimary.variable} antialiased dark`}
      >
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
