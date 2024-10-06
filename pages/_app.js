import Footer from "@/components/Footer";
import { CartProvider } from "./cartcontext";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps:{session, ...pageProps} }) {
  return (
    <SessionProvider session={session}>
      <CartProvider>
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
    </CartProvider>
    </SessionProvider>
  
  );
}
