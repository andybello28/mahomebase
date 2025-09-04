// Version 1.0.0
import "./globals.css";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Providers } from "./context/Context";

export const metadata = {
  title: "Mahomebase",
  description: "AI Fantasy Football Trade Advice",
  openGraph: {
    title: "Mahomebase Fantasy",
    description: "Smarter trades. Better wins.",
    url: "https://mahomebase.com",
    siteName: "Mahomebase",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
      </body>
    </html>
  );
}
