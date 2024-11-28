// "use client"
import HeroSection from "@/Home/HeroSection";
import CategoryCards from "@/Home/CategoryCards";
import ContactSupport from "@/Home/ContactSupport";
import {Poppins} from 'next/font/google'

  const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'], 
  });

export default function Home() {
  return (
    <main className={`${poppins.className} bg-white pb-24`}>
      <HeroSection />
      <CategoryCards />
      <ContactSupport />
    </main>
  );
}
