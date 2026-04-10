import type { Metadata } from "next";
import "./globals.css";
import { MockStoreProvider } from "@/lib/mock-store";
import { TourProvider } from "@/components/tour/TourProvider";
import TourOverlay from "@/components/tour/TourOverlay";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "SmartKOLs",
  description: "AI 驱动的 Twitter KOL 批量管理工具",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F7F7F7] text-[#111111]">
        <MockStoreProvider>
          <TourProvider>
            <Sidebar />
            <main className="md:ml-56 min-h-screen pt-14 md:pt-0">
              {children}
            </main>
            <TourOverlay />
          </TourProvider>
        </MockStoreProvider>
      </body>
    </html>
  );
}
