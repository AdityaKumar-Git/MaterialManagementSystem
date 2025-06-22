import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTenders } from "../store/tenderSlice";
import { submitBid, resetBidState } from "../store/bidSlice";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

const UserTenders = () => {
  const dispatch = useDispatch();
  const { tenders, loading: tendersLoading, error: tendersError } = useSelector((state) => state.tender);
  const { loading: bidLoading, error: bidError, success: bidSuccess } = useSelector((state) => state.bid);
  const [selectedTender, setSelectedTender] = useState(null);
  const [bids, setBids] = useState({});
  const [note, setNote] = useState("");
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    dispatch(fetchTenders());
  }, [dispatch]);

  useEffect(() => {
    if (bidSuccess) {
      toast.success("Bid submitted successfully!");
      setBids({});
      setNote("");
      setContactInfo({
        name: "",
        email: "",
        phone: "",
      });
      dispatch(resetBidState());
    }
    if (bidError) {
      toast.error(bidError);
    }
  }, [bidSuccess, bidError, dispatch]);

  const handleBidChange = (itemId, value) => {
    setBids((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    if (!selectedTender) return;

    // Validate contact information
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      toast.error("Please fill in all contact information");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInfo.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(contactInfo.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    // Format bids with item IDs
    const formattedBids = selectedTender.items.map((item) => ({
      item: item._id,
      price: bids[item._id] || 0,
    }));

    // Validate that all items have bids
    if (formattedBids.some((bid) => bid.price <= 0)) {
      toast.error("Please enter valid bid amounts for all items");
      return;
    }

    const bidData = {
      tenderId: selectedTender._id,
      bids: formattedBids,
      note,
      contactInfo,
    };

    dispatch(submitBid(bidData));
  };

  if (tendersLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (tendersError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error: {tendersError}</div>
      </div>
    );
  }

  const activeTenders = tenders.filter((tender) => tender.status === "active");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Active Tenders</h1>
      
      {activeTenders.length === 0 ? (
        <div className="text-center text-gray-500">No active tenders available</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tender List */}
          <div className="space-y-4">
            {activeTenders.map((tender) => (
              <div
                key={tender._id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedTender?._id === tender._id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => setSelectedTender(tender)}
              >
                <h3 className="text-xl font-semibold">{tender.title}</h3>
                <p className="text-gray-600 mt-2">{tender.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  Created by: {tender.createdBy?.username || "Admin"}
                </div>
              </div>
            ))}
          </div>

          {/* Bidding Form */}
          {selectedTender && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold mb-4">Place Your Bid</h2>
              <form onSubmit={handleSubmitBid} className="space-y-4">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter your full name"
                        value={contactInfo.name}
                        onChange={handleContactChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter your email"
                        value={contactInfo.email}
                        onChange={handleContactChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter your phone number"
                        value={contactInfo.phone}
                        onChange={handleContactChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Bid Amounts */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Bid Amounts</h3>
                  {selectedTender.items.map((item) => (
                    <div key={item._id} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {item.name} ({item.quantity} {item.unit})
                      </label>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">₹</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter your bid"
                          value={bids[item._id] || ""}
                          onChange={(e) => handleBidChange(item._id, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Notes
                  </label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="3"
                    placeholder="Add any additional notes or conditions for your bid"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={bidLoading}
                  className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    bidLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {bidLoading ? "Submitting..." : "Submit Bid"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserTenders; 