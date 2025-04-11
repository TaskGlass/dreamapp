import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"

// Check if Supabase environment variables are set
if (
  typeof window !== "undefined" &&
  (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
) {
  console.error(
    "Supabase environment variables are missing. Please check your .env.local file or Vercel environment variables.",
  )
}

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DreamSage - Dream Interpretation & Subconscious Healing",
  description: "Record, interpret, and transform your dreams into meaningful insights for personal growth and healing.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} dream-bg`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'