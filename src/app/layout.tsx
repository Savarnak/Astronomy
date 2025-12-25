import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Astrology App",
    description: "Generate your horoscope",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ta">
            <body>{children}</body>
        </html>
    );
}
