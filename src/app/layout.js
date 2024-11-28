import localFont from "next/font/local";
import "./globals.css";
import Header from '../components/Header';
import Footer from "@/components/Footer";
import { CartProvider } from "@/app/Context/CartProvider";
import {Poppins} from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400',], // Add desired font weights
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
  description: "Number one STEAM shop"
};

export default function RootLayout({ children }) {
  return (
    <CartProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased ${poppins.className}`}
        >
          <Header />
          {children}
          <Footer />
        </body>
      </html>
    </CartProvider>
  );
}
