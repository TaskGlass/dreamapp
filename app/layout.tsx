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

// Optimize font loading
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Ensures text remains visible during font loading
  preload: true,
  fallback: ["system-ui", "sans-serif"],
})

export const metadata = {
  title: "DreamSage - Dream Interpretation & Subconscious Healing",
  description: "Record, interpret, and transform your dreams into meaningful insights for personal growth and healing.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#131320",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />

        {/* Add preload for critical assets */}
        <link rel="preload" as="font" href="/fonts/inter.woff2" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} dream-bg`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
