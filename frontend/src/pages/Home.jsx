import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import axios from "../axios.js"; 
import { FaArrowRight, FaSpinner } from "react-icons/fa";

const Home = () => {
    const navigate = useNavigate();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/products/getAllProducts");
            
            if (response.data.success) {
                setFeaturedProducts(response.data.data.slice(0, 3)); // Limit to 3 featured products
            } else {
                setError("Failed to fetch featured products");
            }
        } catch (err) {
            console.error("Error fetching featured products:", err);
            setError(err.message || "An error occurred while fetching products");
            
            try {
                const fallbackResponse = await axios.get("/products?limit=3");
                if (fallbackResponse.data.success) {
                    setFeaturedProducts(fallbackResponse.data.data.slice(0, 3));
                    setError(null); // Clear error if fallback succeeds
                }
            } catch (fallbackErr) {
                console.error("Fallback fetch failed:", fallbackErr);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Hero Section */}
            <section className="bg-blue-600 text-white py-20 text-center">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Efficient Material Management</h1>
                    <p className="text-lg md:text-xl mb-6">Streamline your inventory and procurement process with our platform.</p>
                    <Link to="/products" className="px-6 py-3 bg-white text-blue-600 rounded-md text-lg font-semibold hover:bg-gray-200">
                        Browse Products
                    </Link>
                </div>
            </section>

            {/* Featured Products */}
            <section className="container mx-auto px-6 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-semibold">Featured Materials</h2>
                    <Link to="/products" className="flex items-center text-blue-600 hover:text-blue-800">
                        View All <FaArrowRight className="ml-2" />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
                    </div>
                ) : error ? (
                    <div className="bg-red-100 text-red-700 p-4 rounded-md text-center">
                        <p>{error}</p>
                        <button 
                            onClick={fetchFeaturedProducts}
                            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {featuredProducts.length > 0 ? (
                            featuredProducts.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    _id={product._id}
                                    name={product.name}
                                    price={product.price}
                                    stock={product.stock}
                                    description={product.description}
                                    image={product.image && product.image.length > 0 
                                        ? product.image[0] 
                                        : "https://placehold.co/300x200"}
                                />
                            ))
                        ) : (
                            // Show empty state if no products found
                            <div className="col-span-3 text-center py-12">
                                <p className="text-lg text-gray-600">No featured products available at the moment.</p>
                                <Link to="/products" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md">
                                    Browse All Products
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;