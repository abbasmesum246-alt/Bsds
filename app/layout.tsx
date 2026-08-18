import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { ServiceWorker } from "@/components/service-worker";

export const metadata: Metadata = {
  title: { default: "BSDS — Dropshipping Automation", template: "%s · BSDS" },
  description: "Import products, auto-fulfill orders, and monitor price & stock across all your stores. A lightweight dropshipping automation platform.",
  manifest: "/manifest.webmanifest",
  applicationName: "BSDS",
  appleWebApp: { capable: true, title: "BSDS", statusBarStyle: "black-translucent" },
  icons: {
    icon: [{ url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};
export const viewport: Viewport = {
  themeColor: "#1d40f5", width: "device-width", initialScale: 1, maximumScale: 5, colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
          <ServiceWorker />
        </ToastProvider>
      </body>
    </html>
  );
}
