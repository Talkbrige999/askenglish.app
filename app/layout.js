import "./globals.css";

export const metadata = {
  title: "AskEnglish - Free Live English Practice",
  description: "Practice English live with partners around the world.",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
