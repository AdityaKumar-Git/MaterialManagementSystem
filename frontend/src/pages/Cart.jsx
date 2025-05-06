import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "../axios.js"; 
import { useSelector } from 'react-redux';
import { selectUser } from '../store/authSlice.js';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  useEffect(() => {
    fetchCart();
  }, [user?.cart]); // Re-fetch when user cart ID changes

  const fetchCart = async () => {
    try {
      setLoading(true);
      if (!user?.cart) {
        console.log("No cart ID available");
        setLoading(false);
        return;
      }
      
      // console.log("Fetching cart with ID:", user?.cart);
      const response = await axios.get(`/cart/getCart/${user?.cart}`);
      // console.log("Cart data received:", response.data.data);
      
      // Validate the data structure before updating state
      const cartData = response.data.data;
      if (cartData && Array.isArray(cartData.products)) {
        setCart(cartData);
      } else {
        // console.error("Invalid cart data structure:", cartData);
        setError("Invalid cart data received");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching cart:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cart && cart.products && Array.isArray(cart.products)) {
      calculateTotals();
      // Debug log to help troubleshoot data issues
      // console.log("Cart Products:", cart.products);
    }
  }, [cart]);

  const calculateTotals = () => {
    let items = 0;
    let amount = 0;
    
    cart.products.forEach((item) => {
      // Handle NaN and undefined values
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.product?.price) || 0;
      
      items += quantity;
      amount += price * quantity;
    });

    setTotalItems(items);
    setTotalAmount(amount);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      if (newQuantity < 1) {
        return handleRemoveProduct(productId);
      }

      // Store the current cart state before making the API call
      const previousCart = {...cart};

      const response = await axios.put(`/cart/changeQuantity/${user?.cart}`, {
        productId: productId, 
        quantity: newQuantity
      });
      
      // Check if the response data has complete product information
      const updatedCart = response.data.data;
      
      // If the response doesn't contain full product details, manually update quantity
      if (updatedCart && updatedCart.products) {
        // Check if products still have complete data
        const hasCompleteData = updatedCart.products.every(item => 
          item.product && item.product.name && item.product.price !== undefined
        );
        
        if (!hasCompleteData) {
          console.log("Incomplete data in API response, updating locally");
          // Use previous cart data but update the quantity
          const updatedProducts = previousCart.products.map(item => {
            if (item.product._id === productId) {
              return { ...item, quantity: newQuantity };
            }
            return item;
          });
          
          setCart({
            ...previousCart,
            products: updatedProducts
          });
        } else {
          // Response has complete data, use it directly
          setCart(updatedCart);
        }
      } else {
        // Fallback: manually update the quantity in the current state
        const updatedProducts = cart.products.map(item => {
          if (item.product._id === productId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        
        setCart({
          ...cart,
          products: updatedProducts
        });
      }
      
      toast.success("Quantity updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update quantity");
      console.error("Error updating quantity:", err);
    }
  };

  const handleRemoveProduct = async (productId) => {
    const previousCart = {...cart};
    try {
      // Store the current cart state before making the API call
      
      // Remove the product locally first for immediate UI update
      const updatedProducts = cart.products.filter(item => item.product._id !== productId);
      setCart({...cart, products: updatedProducts});
      
      // Then make the API call
      const response = await axios.delete(`/cart/removeProduct/${productId}`);
      
      // If the API returns complete data, use it, otherwise keep our local update
      if (response.data.data && response.data.data.products && 
          response.data.data.products.every(item => item.product && item.product.name)) {
        setCart(response.data.data);
      }
      
      toast.success("Product removed from cart");
    } catch (err) {
      // If there's an error, revert to the previous state
      setCart(previousCart);
      toast.error(err.message || "Failed to remove product");
      console.error("Error removing product:", err);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
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
          <Link to="/" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md">
            Return to Home
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
            <div className="flex justify-center mb-6">
              <FaShoppingCart className="text-6xl text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Link to="/products" className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold inline-block hover:bg-blue-700">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          <Link to="/products" className="flex items-center text-blue-600 hover:text-blue-800">
            <FaArrowLeft className="mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="lg:flex lg:space-x-6">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Cart Items ({totalItems})</h2>
                
                <div className="divide-y divide-gray-200">
                  {cart.products.map((item, index) => (
                    <div key={item.product?._id || `cart-item-${index}`} className="py-6 flex flex-col sm:flex-row">
                      {/* Product Image */}
                      <div className="sm:w-24 mb-4 sm:mb-0">
                        <Link to={`/products/${item.product._id}`}>
                          <img 
                            src={(item.product.image && item.product.image.length > 0) 
                              ? item.product.image[0] 
                              : "https://placehold.co/100x100"} 
                            alt={item.product.name}
                            className="w-24 h-24 object-cover rounded-md"
                          />
                        </Link>
                      </div>
                      
                      {/* Product Details */}
                      <div className="sm:ml-6 flex-grow">
                        <div className="flex justify-between mb-2">
                          <Link to={`/products/${item.product?._id}`} className="text-lg font-medium text-gray-800 hover:text-blue-600">
                            {item.product?.name || "Unknown Product"}
                          </Link>
                          <button 
                            onClick={() => handleRemoveProduct(item.product?._id)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Remove item"
                          >
                            <FaTrash />
                          </button>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4">
                          {item.product.description && item.product.description.length > 100 
                            ? `${item.product.description.substring(0, 100)}...` 
                            : item.product.description || "No description available"}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button 
                              onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                              className="px-3 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-l-md"
                              aria-label="Decrease quantity"
                            >
                              <FaMinus size={12} />
                            </button>
                            <span className="px-4 py-1">{item.quantity}</span>
                            <button 
                              onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                              className="px-3 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-r-md"
                              aria-label="Increase quantity"
                              disabled={item.quantity >= parseInt(item.product.stock || 0)}
                            >
                              <FaPlus size={12} />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-gray-600 text-sm">Price per unit</p>
                            <p className="text-lg font-medium text-gray-800">${(Number(item.product?.price) || 0).toFixed(2)}</p>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-gray-600 text-sm">Subtotal</p>
                            <p className="text-lg font-medium text-gray-800">${((Number(item.product?.price) || 0) * (Number(item.quantity) || 0)).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${isNaN(totalAmount) ? '0.00' : totalAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-blue-600">${isNaN(totalAmount) ? '0.00' : totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
                >
                  Proceed to Checkout
                </button>
                
                <div className="mt-6 text-center text-gray-600 text-sm">
                  <p>Need help? Contact our support team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;