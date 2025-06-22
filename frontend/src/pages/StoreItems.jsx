import { useEffect, useState } from "react";
import axios from "../axios.js";

const StoreItems = () => {
  const [stores, setStores] = useState([]);
  const [selectedStoreIndex, setSelectedStoreIndex] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get("/store/storeItems");
        setStores(response.data.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch stores.");
      }
    };

    fetchStores();
  }, []);

  const handleStoreChange = (e) => {
    setSelectedStoreIndex(Number(e.target.value));
  };

  const selectedStore = stores[selectedStoreIndex];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 mb-0">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Store Items</h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto">
            Select a store to view its available items and quantities.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-12">
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6 text-center">
            {error}
          </div>
        )}

        {/* Store Dropdown */}
        {stores.length > 0 && (
          <div className="mb-10 text-center">
            <label className="mr-4 text-lg font-medium text-gray-700">
              Select Store:
            </label>
            <select
              value={selectedStoreIndex}
              onChange={handleStoreChange}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {stores.map((store, index) => (
                <option key={store._id} value={index}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Items Display */}
        {selectedStore ? (
          selectedStore.items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {selectedStore.items.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 shadow-md rounded-xl p-5 flex flex-col justify-between hover:shadow-lg transition-shadow"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h2>
                    <p className="text-gray-600">
                      Quantity Available: <span className="font-medium">{item.quantity}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-blue-800 mt-10">
              No items available in <strong>{selectedStore.name}</strong>.
            </div>
          )
        ) : (
          <div className="text-center text-gray-600">No store selected.</div>
        )}
      </main>
    </div>
  );
};

export default StoreItems;
