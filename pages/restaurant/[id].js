import { useRouter } from "next/router";
import { useState, useEffect, useContext} from "react";
import axios from "axios";
import { FaRegMinusSquare } from "react-icons/fa";
import { FaRegPlusSquare } from "react-icons/fa";
import DashNav from "@/components/DashNav";
import { CartContext } from "../cartcontext";

const RestaurantMenu = () => {
  const [restaurant, setRestaurant] = useState(null);
  const {addToCart, increment, decrement, cartItems}= useContext(CartContext);
  const [addedToCart, setAddedToCart] = useState({}); 
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/restaurants/${id}`)
        .then((response) => setRestaurant(response.data))
        .catch((error) => console.error(error));
    }
  }, [id]);

  useEffect(() => {
    const savedAddedToCart = JSON.parse(localStorage.getItem("addedToCart")) || {};
    setAddedToCart(savedAddedToCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("addedToCart", JSON.stringify(addedToCart));
  }, [addedToCart]);

  const handleAddToCart = (itemId, title, price) => {
    addToCart(itemId, title, price);
    setAddedToCart((prev) => ({ ...prev, [itemId]: true }));
  };
  
  if (!restaurant) return <p>Loading...</p>;


  return (
    <>
      <DashNav/>
      <div className="p-14 justify-center">
        <div className="flex mb-8 mt-12">
          <img
            src={restaurant.image}
            className="w-1/4 h-25 object-cover rounded-lg mr-6 "
            alt={restaurant.name}
          />

          <div className="w-2/3">
            <h1 className="text-3xl font-bold text-purple-800 mb-2">
              {restaurant.name}
            </h1>
            <p className="text-lg mb-2">{restaurant.location}</p>
            <p className="text-gray-600">{restaurant.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {restaurant.menu.map((item) => (
            <div
              key={item._id}
              className="flex border rounded-lg overflow-hidden shadow-lg hover:shadow-md transition duration-300"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-1/4 object-cover "
              />
              <div className="p-4 w-3/4">
                <h2 className="text-xl font-bold text-purple-800 mb-2">
                  {item.title}
                </h2>
                <p className="text-gray-600 mb-2">{item.description}</p>
                <p className="text-purple-800 font-bold">${item.price}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <button 
                    onClick={() => decrement(item._id)}
                    >
                      <FaRegMinusSquare />
                    </button>

                    <span className="px-4">
                    {cartItems[item._id]?.quantity || 0}
                    </span>

                    <button 
                    onClick={() => increment(item._id)}
                    >
                      <FaRegPlusSquare />
                    </button>
                  </div>

                  <button
                    className="bg-purple-800 text-white rounded px-4 py-2"
                    onClick={() => handleAddToCart(item._id, item.title, item.price)}
                  >
                    {addedToCart[item._id] ? "Added to Cart" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RestaurantMenu;
