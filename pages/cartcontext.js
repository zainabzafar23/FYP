import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [badgeCount, setBadgeCount] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchCart = async () => {
      if (session) {
        try {
          const { data } = await axios.get("/api/cart");
          setCartItems(data.cart);
          setBadgeCount(
            data.cart.reduce((count, item) => count + item.quantity, 0)
          );
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      }
    };

    fetchCart();
  }, [session]);

  useEffect(() => {
    if (!session) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, session]);
  
  useEffect(() => {
    if (session) {
      localStorage.removeItem("cart"); 
    }
  }, [session]);

 
  const syncCartWithDB = async (updatedCart) => {
    try {
      await axios.post("/api/cart", { cart: updatedCart });
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const addToCart = (id, title, price) => {
    const updatedCart = cartItems.map((item) =>
      item.itemId === id ? { ...item, quantity: item.quantity + 1 } : item
    );

    const newItem = updatedCart.find((item) => item.itemId === id);
    if (!newItem) {
      updatedCart.push({ itemId: id, title, price, quantity: 1 });
    }

    setCartItems(updatedCart);
    setBadgeCount((prevCount) => prevCount + 1);
    syncCartWithDB(updatedCart);
  };

  const increment = (id) => {
    const updatedCart = cartItems.map((item) =>
      item.itemId === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
    setBadgeCount((prevCount) => prevCount + 1);
    syncCartWithDB(updatedCart);
  };

  const decrement = (id) => {
    const updatedCart = cartItems.map((item) =>
      item.itemId === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedCart);
    setBadgeCount((prevCount) => prevCount - 1);
    syncCartWithDB(updatedCart);
  };

  const deleteItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.itemId !== id);
    setCartItems(updatedCart);
    setBadgeCount((prevCount) => prevCount - 1);
    syncCartWithDB(updatedCart);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        badgeCount,
        addToCart,
        increment,
        decrement,
        deleteItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
