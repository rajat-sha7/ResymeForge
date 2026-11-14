import type { Metadata } from "next";
import "./globals.css";
import Toast from './components/Toast';
import { siteFontVars } from './fonts';

export const metadata: Metadata = {
  title: "ResumeForge – Build an ATS-friendly resume",
  description: "Six templates built for different fields, and a checker that flags what applicant tracking software will trip on as you write. Free, no account needed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={siteFontVars}>
      <body className="antialiased">
        {children}
        <Toast />
      </body>
    </html>
  );
}
