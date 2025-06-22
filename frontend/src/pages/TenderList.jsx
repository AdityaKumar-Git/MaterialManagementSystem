import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTenders, closeTender, awardTender } from "../store/tenderSlice";
import { toast } from "react-toastify";
import axios from "../axios";

const TenderList = () => {
  const dispatch = useDispatch();
  const { tenders = [], loading, error } = useSelector((state) => state.tender);
  const [selectedTender, setSelectedTender] = useState(null);
  const [bids, setBids] = useState([]);
  const [loadingBids, setLoadingBids] = useState(false);

  useEffect(() => {
    dispatch(fetchTenders());
  }, [dispatch]);

  const handleCloseTender = async (tenderId) => {
    if (window.confirm("Are you sure you want to close this tender")) {
      const result = await dispatch(closeTender(tenderId));
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Tender closed successfully");
      }
      dispatch(fetchTenders());
    }
  };

  const handleAwardTender = async (tenderData) => {
    const result = await dispatch(awardTender(tenderData));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Tender closed successfully");
    }
    dispatch(fetchTenders());
  };

  const handleViewBids = async (tender) => {
    setSelectedTender(tender);
    setLoadingBids(true);
    try {
      const response = await axios.get(`/tenders/tender/${tender._id}/bids`);
      setBids(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch bids");
    } finally {
      setLoadingBids(false);
    }
  };

  const handleRejectAllBids = async (tender, bidId) => {
    setSelectedTender(tender);
    setLoadingBids(true);
    try {
      const response = await axios.patch(`/tenders/bid/deleteAllBids`, {bidId, tenderId: tender._id});
    } catch (error) {
      toast.error("Failed to fetch bids");
    } finally {
      setSelectedTender(null);
      setLoadingBids(false);
    }
  };

  const handleDownloadBill = async (bidId) => {
    try {
      const response = await axios.get(`/tenders/bid/${bidId}/bill`, {
        responseType: 'blob'
      });
      
      // Create a blob from the PDF data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `bid-${bidId}.pdf`;
      
      // Append link to body, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to download bill");
    }
  };

  const handleUpdateBidStatus = async (bidId, status) => {
    if (window.confirm(`"Are you sure you want this tender to be ${status}?"`)) {
      try {
        await axios.patch(`/tenders/bid/${bidId}/status`, { status });
        toast.success(`Bid ${status} successfully`);
        // Refresh bids
        if (selectedTender) {
          handleViewBids(selectedTender);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update bid status");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        Error loading tenders: {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tenders</h1>
        <a
          href="/tenders/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create New Tender
        </a>
      </div>

      {tenders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">No tenders found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Get started by creating a new tender.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {tenders.map((tender) => (
              <li key={tender._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {tender.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {tender.description}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center gap-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tender.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
                      </span>
                      {tender.status === "active" && (
                        <button
                          onClick={() => {{
                              handleCloseTender(tender._id)
                              handleRejectAllBids(tender, null)
                            }}
                          }
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Close Tender
                        </button>
                      )}
                      <button
                        onClick={() => handleViewBids(tender)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        View Bids
                      </button>

                      <span
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-zinc-600"
                      >
                        {tender.store}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="flex items-center text-sm text-gray-500">
                      Created by: {tender.createdBy?.username || "Unknown"}
                    </p>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Items:</h4>
                    <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {tender.items.map((item, index) => (
                        <li
                          key={index}
                          className="bg-gray-50 px-3 py-2 rounded-md text-sm"
                        >
                          {item.name} - {item.quantity} {item.unit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bids Modal */}
      {selectedTender && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Bids for {selectedTender.title}</h2>
                <button
                  onClick={() => setSelectedTender(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {loadingBids ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : bids.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No bids received yet</p>
              ) : (
                <div className="space-y-4">
                  {bids.map((bid) => (
                    <div key={bid._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Contact Information</h3>
                          <p className="text-sm text-gray-600">Name: {bid.contactInfo.name}</p>
                          <p className="text-sm text-gray-600">Email: {bid.contactInfo.email}</p>
                          <p className="text-sm text-gray-600">Phone: {bid.contactInfo.phone}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              bid.status === "accepted"
                                ? "bg-green-100 text-green-800"
                                : bid.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {bid.status || "Pending"}
                          </span>
                          <button
                            onClick={() => handleDownloadBill(bid._id)}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                          >
                            Download Bill
                          </button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-medium">Bid Items</h4>
                        <div className="mt-2 space-y-2">
                          {bid.bids.map((itemBid, index) => {
                            const item = selectedTender.items.find(i => i._id === itemBid.item);
                            return (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item ? item.name : 'Unknown Item'}</span>
                                <span>₹{itemBid.price}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {bid.note && (
                        <div className="mt-4">
                          <h4 className="font-medium">Additional Notes</h4>
                          <p className="text-sm text-gray-600 mt-1">{bid.note}</p>
                        </div>
                      )}

                      <div className="mt-4 flex justify-end gap-2">
                        {bid.status === "pending" ? (
                          <>
                            <button
                              onClick={() => {
                                // {
                                handleRejectAllBids(selectedTender, bid._id)
                                handleUpdateBidStatus(bid._id, "accepted")
                                handleAwardTender({tenderId:selectedTender._id, items:selectedTender.items, storeName: selectedTender.store})
                              // }
                              }}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateBidStatus(bid._id, "rejected")}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </>
                        ) : (<></>)
                        }
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenderList; 