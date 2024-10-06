import DashNav from "@/components/DashNav";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [activeOption, setActiveOption] = useState("all");
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      axios
        .get("/api/user-info", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        })
        .then((res) => {
          console.log("user info fetched successfully", res.data);
          setUser(res.data.user);
          setLoading(false);
        })

        .catch((error) => {
          console.log("failed fetch", error);
          router.push("/login");
        });
    }
  }, [router]);


  useEffect(() => {
    if (!user) return;

    const fetchRestaurants = async () => {
      try {
        const res = await axios.get(`/api/restaurants`, {
          params: {
            type: activeOption,
            search: search,
          },
        });
        setRestaurants(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      }
    };

    fetchRestaurants();
  }, [activeOption, user, search]);

  if (loading) {
    return <div>Loading......</div>;
  }

  if (!user) {
    return <div>error: user not found</div>;
  }

  return (
    <>
      <DashNav search={search} setSearch={setSearch} />

      <div className="p-20 ">
        <div className="p-4 flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveOption("all")}
            className={`px-6 py-3 font-medium md:px-4 md:py-2 text-white rounded-lg ${
              activeOption === "all"
                ? "bg-purple-800"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setActiveOption("pickup")}
            className={`px-6 py-3 md:px-4 md:py-2 font-medium text-white rounded-lg ${
              activeOption === "pickup"
                ? "bg-purple-800"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Pickup
          </button>

          <button
            onClick={() => setActiveOption("delivery")}
            className={`px-6 py-3 md:px-4 md:py-2 font-medium text-white rounded-lg ${
              activeOption === "delivery"
                ? "bg-purple-800"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Delivery
          </button>
        </div>

        {/* Display restaurant listings in a grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <Link href={`/restaurant/${restaurant._id}`} key={restaurant._id}>
                <div className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow">
                  <div className="relative w-full h-40 flex justify-center items-center">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="object-contain w-50 h-40 "
                    />
                  </div>
                  <div className="p-4 bg-purple-200">
                    <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                    <p className="text-gray-500 text-sm">
                      {restaurant.location}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>No restaurants available for {activeOption}.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
