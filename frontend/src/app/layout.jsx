import "./globals.css";

export const metadata = {
  title: "Mahomebase",
  description: "AI Fantasy Football Trade Advice",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
