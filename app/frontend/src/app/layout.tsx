import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MooFoo - Your Personal Food Assistant",
  description: "Get personalized food recommendations, recipes, and restaurant suggestions based on your mood and preferences.",
  keywords: ["food", "recipes", "restaurants", "chatbot", "AI", "cooking"],
  authors: [{ name: "MooFoo Team" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} antialiased`}
      >
        <div className="container mx-auto px-4">{children}</div>
      </body>
    </html>
  );
}
