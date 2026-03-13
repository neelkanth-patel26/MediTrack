import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import { ThemeProvider } from '@/lib/theme-context'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'MediTrack+',
  description: 'Smart Patient Management & Diagnosis Support System',
  generator: 'v0.app',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MediTrack+',
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="MediTrack+" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MediTrack+" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" id="theme-color-meta" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              function updateThemeColor() {
                const isDark = document.documentElement.classList.contains('dark');
                const meta = document.getElementById('theme-color-meta');
                if (meta) {
                  meta.setAttribute('content', isDark ? '#0f172a' : '#ffffff');
                }
              }

              try {
                const savedDarkMode = localStorage.getItem('meditrack_dark_mode');
                if (savedDarkMode !== null) {
                  if (savedDarkMode === 'true') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } else {
                  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('meditrack_dark_mode', 'true');
                  } else {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('meditrack_dark_mode', 'false');
                  }
                }
                updateThemeColor();
                
                // Observe class changes on html element
                const observer = new MutationObserver((mutations) => {
                  mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                      updateThemeColor();
                    }
                  });
                });
                observer.observe(document.documentElement, { attributes: true });
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
