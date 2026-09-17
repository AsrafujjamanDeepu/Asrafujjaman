import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata = {
  title: "Asrafujjaman | Software Developer",
  description:
    "Portfolio of Asrafujjaman, a .NET and full-stack software developer.",
  metadataBase: new URL("https://asrafujjaman.vercel.app"),
  openGraph: {
    title: "Asrafujjaman | Software Developer",
    description:
      "Building dependable full-stack experiences with .NET, React and modern web technology.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
