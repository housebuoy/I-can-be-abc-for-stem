import localFont from "next/font/local";
import "./globals.css";
import LayoutWrapper from "@/app/ClientLayout";
import { CartProvider } from "@/app/Context/CartProvider";
import { Poppins } from "next/font/google";
import { SearchProvider } from "@/app/Context/SearchContext";

const poppins = Poppins({
  subsets: ["latin"],
  display: 'swap',
  weight: ["400"], // Add desired font weights
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "I Can Be ABC For STEM",
  description: "Number one STEAM shop",
};

export default function RootLayout({ children }) {
  return (
    <CartProvider>
      <SearchProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased ${poppins.className}`}
          >
            <LayoutWrapper>{children}</LayoutWrapper>
          </body>
        </html>
      </SearchProvider>
    </CartProvider>
  );
}
