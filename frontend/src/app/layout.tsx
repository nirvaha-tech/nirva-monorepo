/**
 * Root layout component
 * 
 * Copyright (c) 2024 Nirvahatech. All rights reserved.
 * This software is proprietary and confidential.
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Nirvahatech | Expert DevOps & Cloud Infrastructure Solutions",
  description:
    "Stop firefighting. Start innovating. Expert-led DevOps for tech leaders who need scalable, self-healing infrastructure. Transform chaos into reliability.",
  keywords: [
    "DevOps",
    "Kubernetes",
    "Cloud Infrastructure",
    "AWS",
    "CI/CD",
    "GitOps",
    "DevSecOps",
    "FinOps",
    "Infrastructure Automation",
  ],
  authors: [{ name: "Nirvahatech" }],
  openGraph: {
    title: "Nirvahatech | Expert DevOps & Cloud Infrastructure Solutions",
    description:
      "Transform your infrastructure from chaos to reliability. Expert-led DevOps automation for scaling tech companies.",
    type: "website",
    locale: "en_US",
    siteName: "Nirvahatech",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nirvahatech | Expert DevOps & Cloud Infrastructure Solutions",
    description:
      "Transform your infrastructure from chaos to reliability. Expert-led DevOps automation for scaling tech companies.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}

