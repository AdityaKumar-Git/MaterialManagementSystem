import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "../axios";

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios(`/products/${productId}`);
        
        if (!response.data.data) {
          throw new Error("Product not found");
        }
        setProduct(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      const response = await axios.post(`cart/addProduct/${productId}`, {
        quantity: quantity,
        productId: productId
      });
      
      toast.success("Added to cart successfully");
    } catch (err) {
      toast.error(err.message || "Failed to add to cart");
    }
  };

  // Function to render star ratings
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500" />);
      }
    }

    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-2 text-gray-600">({product.reviews.length} reviews)</span>
      </div>
    );
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
          <Link to="/products" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-yellow-100 rounded-lg">
          <h2 className="text-2xl font-bold text-yellow-700 mb-2">Product Not Found</h2>
          <Link to="/products" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Breadcrumbs */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center text-sm">
              <Link to="/" className="text-blue-600 hover:text-blue-800">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link to="/products" className="text-blue-600 hover:text-blue-800">
                Products
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-600">{product.name}</span>
            </div>
          </div>

          {/* Product Details */}
          <div className="md:flex">
            {/* Product Images */}
            <div className="md:w-1/2 p-6">
              <div className="mb-4">
                <img
                  src={product.image[activeImage] || "https://placehold.co/600x400"}
                  alt={product.name}
                  className="w-full h-96 object-contain rounded-md"
                />
              </div>
              {product.image.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.image.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`border-2 rounded-md w-20 h-20 flex-shrink-0 ${
                        activeImage === index ? "border-blue-500" : "border-gray-200"
                      }`}
                    >
                      <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              
              {product.rating && (
                <div className="mb-4">
                  {renderRatingStars(product.rating)}
                </div>
              )}
              
              <div className="text-2xl font-bold text-blue-600 mb-4">
                ${product.price.toLocaleString()}
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Availability</h3>
                <p className={`${parseInt(product.stock) > 0 ? "text-green-600" : "text-red-600"}`}>
                  {parseInt(product.stock) > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
                </p>
              </div>
              
              {parseInt(product.stock) > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Quantity</h3>
                  <div className="flex items-center">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.min(parseInt(product.stock), Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-16 text-center border-t border-b border-gray-300 py-1"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(parseInt(product.stock), quantity + 1))}
                      className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleAddToCart}
                  disabled={parseInt(product.stock) <= 0}
                  className={`px-6 py-3 rounded-md font-semibold ${
                    parseInt(product.stock) > 0
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-400 text-gray-100 cursor-not-allowed"
                  }`}
                >
                  Add to Cart
                </button>
                <Link
                  to="/cart"
                  className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md font-semibold text-center hover:bg-blue-50"
                >
                  View Cart
                </Link>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-6">
                {product.reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {i < review.rating ? (
                              <FaStar className="text-yellow-500" />
                            ) : (
                              <FaRegStar className="text-yellow-500" />
                            )}
                          </span>
                        ))}
                      </div>
                      <span className="ml-2 text-gray-600 font-semibold">
                        {review.user.username || "Anonymous"}
                      </span>
                    </div>
                    {review.comment && <p className="text-gray-700">{review.comment}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            )}
            
            <div className="mt-8">
              <Link
                to={`/products/${productId}/review`}
                className="px-6 py-3 bg-green-600 text-white rounded-md font-semibold inline-block hover:bg-green-700"
              >
                Write a Review
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;