import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MaxWidthWrapper from "./components/MaxWidthWrapper";
import Navbar from './components/Navbar';
import FloatingActionButtons from './components/FloatingActionButtons';
import Providers from './providers'; // <== Import the wrapper

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Provider | Verified Hostels, PGs & Flats for Students",
  description: "Provider helps students find verified hostels, PGs, and flats with ease. Explore local listings and amenities tailored for college life.",
  alternates: {
    canonical: 'https://providerapp.in/'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#ffffff] overflow-x-hidden`}>
        <Providers>
          <Navbar />
          {children}
          <FloatingActionButtons />
        </Providers>
      </body>
    </html>
  );
}
