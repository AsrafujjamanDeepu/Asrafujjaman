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

// Runs before paint so a returning visitor's saved theme applies
// immediately, with no light -> dark flash on load.
const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
