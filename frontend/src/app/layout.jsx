import "./globals.css";

export const metadata = {
  title: "Mahomebase Fantasy",
  description: "AI Fantasy Football Trade Advice",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
