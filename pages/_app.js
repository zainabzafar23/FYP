import Footer from "@/components/Footer";
import { CartProvider } from "./cartcontext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
      <CartProvider>
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
    </CartProvider>
  
  );
}
