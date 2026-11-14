import type { Metadata } from "next";
import Header from "../homepage/Header";
import Footer from "../homepage/Footer";
import { CTABand } from "../homepage/ui";
import InsightsBrowser from "./InsightsBrowser";

export const metadata: Metadata = {
  title: "Insights – ResumeForge",
  description: "Guides on resume writing, applicant tracking systems, and the job search.",
};

export default function InsightsPage() {
  return (
    <main className="home-sans min-h-screen bg-[#f5f4ed] text-[#151b26] overflow-x-clip">
      <Header />
      <InsightsBrowser />
      <CTABand
        title="Put it into practice"
        body="Open the builder, pick a template, and watch the ATS score change as you apply what you've read."
      />
      <Footer />
    </main>
  );
}
