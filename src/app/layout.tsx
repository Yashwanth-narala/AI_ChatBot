import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {Navbar} from '../components/layout/Navbar'
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
})

export const metadata: Metadata = {
  title: "Prepdha Schools - Interactive Learning Platform",
  description:
    "An interactive educational platform for schools with AI-powered learning tools, flashcards, notes, and chapter-based reading experiences.",
}

export const viewport: Viewport = {
  themeColor: "#7c3aed",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${sourceSans.variable} font-sans antialiased`}
      >
        {/* <TopicHeader/> */}
        <Navbar/>
        {children}
      </body>
    </html>
  )
}

