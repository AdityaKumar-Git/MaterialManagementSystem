import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "../axios.js";
import { useSelector } from 'react-redux';
import { selectUser } from '../store/authSlice.js';

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [processingOrder, setProcessingOrder] = useState(false);
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
    phoneNumber: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
  });

  // Shipping cost calculation
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingMethod, setShippingMethod] = useState("standard");

  // Tax calculation (simplified for now)
  const taxRate = 0.08; // 8%
  const [taxAmount, setTaxAmount] = useState(0);

  useEffect(() => {
    fetchCart();
  }, [user?.cart]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      if (!user?.cart) {
        console.log("No cart ID available");
        setLoading(false);
        setError("No cart found. Please add items to your cart first.");
        return;
      }
      
      const response = await axios.get(`/cart/getCart/${user?.cart}`);
      const cartData = response.data.data;
      
      if (cartData && Array.isArray(cartData.products)) {
        setCart(cartData);
      } else {
        setError("Invalid cart data received");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching cart:", err);
      toast.error("Failed to load cart information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cart && cart.products && Array.isArray(cart.products)) {
      calculateTotals();
    }
  }, [cart, shippingMethod]);

  const calculateTotals = () => {
    // Calculate subtotal
    let subtotal = 0;
    cart.products.forEach((item) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.product?.price) || 0;
      subtotal += price * quantity;
    });

    // Calculate shipping cost based on method
    let shipping = 0;
    switch (shippingMethod) {
      case "express":
        shipping = 14.99;
        break;
      case "priority":
        shipping = 9.99;
        break;
      case "standard":
      default:
        shipping = subtotal > 100 ? 0 : 5.99; // Free shipping over $100
        break;
    }
    setShippingCost(shipping);

    // Calculate tax
    const tax = subtotal * taxRate;
    setTaxAmount(tax);

    // Final total
    setTotalAmount(subtotal + shipping + tax);
  };

  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentInfoChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShippingMethodChange = (e) => {
    setShippingMethod(e.target.value);
  };

  const validateForm = () => {
    // Validate shipping info
    for (const [key, value] of Object.entries(shippingInfo)) {
      if (!value.trim()) {
        toast.error(`Please provide your ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} for shipping`);
        return false;
      }
    }

    // Validate payment info (basic validation)
    if (!paymentInfo.cardNumber.trim() || paymentInfo.cardNumber.replace(/\s/g, '').length < 15) {
      toast.error("Please enter a valid card number");
      return false;
    }
    if (!paymentInfo.cardholderName.trim()) {
      toast.error("Please enter the cardholder name");
      return false;
    }
    if (!paymentInfo.expiryDate.trim() || !/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
      toast.error("Please enter a valid expiry date (MM/YY)");
      return false;
    }
    if (!paymentInfo.cvv.trim() || !/^\d{3,4}$/.test(paymentInfo.cvv)) {
      toast.error("Please enter a valid CVV code");
      return false;
    }

    return true;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setProcessingOrder(true);
      
      // Prepare order data
      const orderData = {
        cartId: user.cart,
        shipping: {
          ...shippingInfo,
          method: shippingMethod,
          cost: shippingCost
        },
        payment: {
          // Don't send complete card details in a real app
          // This is just for demonstration
          last4: paymentInfo.cardNumber.slice(-4),
          cardholderName: paymentInfo.cardholderName
        },
        subtotal: totalAmount - shippingCost - taxAmount,
        tax: taxAmount,
        total: totalAmount
      };

      // Submit order to API
      const response = await axios.post('/orders/create', orderData);
      
      if (response.data.success) {
        toast.success("Order placed successfully!");
        // Clear cart and navigate to order confirmation
        navigate(`/order-confirmation/${response.data.data._id}`, { state: { orderData: response.data.data } });
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while processing your order");
      console.error("Error placing order:", err);
    } finally {
      setProcessingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-red-100 rounded-lg">
          <h2 className="text-2xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <Link to="/cart" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md">
            Return to Cart
          </Link>
        </div>
      </div>
    );
  }

  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">You need to add items to your cart before checkout.</p>
            <Link to="/products" className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold inline-block hover:bg-blue-700">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
          <Link to="/cart" className="flex items-center text-blue-600 hover:text-blue-800">
            <FaArrowLeft className="mr-2" />
            Back to Cart
          </Link>
        </div>

        <div className="lg:flex lg:space-x-6">
          {/* Left Side - Form */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmitOrder}>
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="fullName">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleShippingInfoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="address">
                        Street Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingInfoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="city">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingInfoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="state">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingInfoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="zipCode">
                        ZIP / Postal Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleShippingInfoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      {/* <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="country">
                        Country
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleShippingInfoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="USA">United States</option>
                        <option value="CAN">Canada</option>
                        <option value="MEX">Mexico</option>
                      </select> */}
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phoneNumber">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={shippingInfo.phoneNumber}
                        onChange={handleShippingInfoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Shipping Method */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="standard"
                        name="shippingMethod"
                        value="standard"
                        checked={shippingMethod === "standard"}
                        onChange={handleShippingMethodChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="standard" className="ml-3 flex flex-grow justify-between">
                        <div>
                          <span className="block text-sm font-medium text-gray-900">Standard Shipping</span>
                          <span className="block text-sm text-gray-500">Delivery in 5-7 business days</span>
                        </div>
                        <span className="font-medium">{totalAmount > 100 ? "FREE" : "$5.99"}</span>
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="priority"
                        name="shippingMethod"
                        value="priority"
                        checked={shippingMethod === "priority"}
                        onChange={handleShippingMethodChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="priority" className="ml-3 flex flex-grow justify-between">
                        <div>
                          <span className="block text-sm font-medium text-gray-900">Priority Shipping</span>
                          <span className="block text-sm text-gray-500">Delivery in 2-3 business days</span>
                        </div>
                        <span className="font-medium">$9.99</span>
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="express"
                        name="shippingMethod"
                        value="express"
                        checked={shippingMethod === "express"}
                        onChange={handleShippingMethodChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="express" className="ml-3 flex flex-grow justify-between">
                        <div>
                          <span className="block text-sm font-medium text-gray-900">Express Shipping</span>
                          <span className="block text-sm text-gray-500">Delivery in 1-2 business days</span>
                        </div>
                        <span className="font-medium">$14.99</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Information */}
              {/* <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="cardNumber">
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentInfoChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="cardholderName">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        id="cardholderName"
                        name="cardholderName"
                        value={paymentInfo.cardholderName}
                        onChange={handlePaymentInfoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="expiryDate">
                        Expiry Date (MM/YY)
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={paymentInfo.expiryDate}
                        onChange={handlePaymentInfoChange}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="cvv">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={paymentInfo.cvv}
                        onChange={handlePaymentInfoChange}
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div> */}
            </form>
          </div>
          
          {/* Right Side - Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-6">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                {/* Items in cart summary */}
                <div className="space-y-4 mb-6">
                  {cart.products.map((item, index) => (
                    <div key={item.product?._id || `checkout-item-${index}`} className="flex justify-between items-center py-2 border-b border-gray-200">
                      <div className="flex items-center">
                        <div className="w-12 h-12 mr-4">
                          <img 
                            src={(item.product.image && item.product.image.length > 0) 
                              ? item.product.image[0] 
                              : "https://placehold.co/100x100"} 
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-medium">${((Number(item.product?.price) || 0) * (Number(item.quantity) || 0)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                {/* Cost Breakdown */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${(totalAmount - shippingCost - taxAmount).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span className="font-medium">${taxAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-blue-600">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Checkout Button */}
                <button 
                  onClick={handleSubmitOrder}
                  disabled={processingOrder}
                  className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 flex items-center justify-center"
                >
                  {processingOrder ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaLock className="mr-2" />
                      Complete Order
                    </>
                  )}
                </button>
                
                <div className="mt-6 text-center text-gray-600 text-sm">
                  <p>By placing your order, you agree to our <span className="text-blue-600">Terms and Conditions</span> and <span className="text-blue-600">Privacy Policy</span>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;