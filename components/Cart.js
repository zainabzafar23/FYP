import React, { useContext } from "react";
import { CartContext } from "@/pages/cartcontext";
import { FaRegMinusSquare, FaRegPlusSquare } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";

const Cart = () => {
  const { cartItems, increment, decrement, deleteItem } = useContext(CartContext);

  const itemsArray = Object.keys(cartItems).map((itemId) => ({
    id: itemId,
    title: cartItems[itemId].title,
    price: cartItems[itemId].price,
    quantity: cartItems[itemId].quantity,
  }));

  return (
    <div className="fixed top-0 right-0 w-86 h-full bg-white shadow-lg z-50 p-6 rounded-lg border">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {itemsArray.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {itemsArray.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b py-2">
              <div className="flex items-center space-x-4">
                <span className="font-semibold">{item.title}</span>
                <button
                  className="text-gray-600 hover:text-gray-800"
                  onClick={() => decrement(item.id)}
                >
                  <FaRegMinusSquare />
                </button>
                <span className="px-1">{item.quantity}</span>
                <button
                  className="text-gray-600 hover:text-gray-800"
                  onClick={() => increment(item.id)}
                >
                  <FaRegPlusSquare />
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-purple-800 font-bold ml-1">Rs.{(item.price * item.quantity).toFixed(2)}</span>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => deleteItem(item.id)}
                >
                  <RiDeleteBin2Line />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="font-bold mt-6 border-t pt-4 text-lg">
        Total: Rs.
        {itemsArray.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
      </div>

      {/* Checkout Button */}
      <div className="mt-6">
        <button className="w-full py-2 bg-purple-800 text-white font-semibold rounded-lg hover:bg-purple-900">
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
