import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import axios from "../axios.js"; 
import { FaArrowRight, FaSpinner, FaBuilding, FaClipboardList, FaUsers, FaChartLine } from "react-icons/fa";

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
                setFeaturedProducts(response.data.data.slice(0, 3));
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
                    setError(null);
                }
            } catch (fallbackErr) {
                console.error("Fallback fetch failed:", fallbackErr);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-[#1a365d] to-[#2c5282] text-white py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Material Management System</h1>
                        <p className="text-lg md:text-xl mb-8 text-gray-100">
                            A comprehensive platform for efficient procurement, inventory management, and tender processing
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link 
                                to="/products" 
                                className="px-8 py-3 bg-white text-[#1a365d] rounded-md text-lg font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center"
                            >
                                <FaBuilding className="mr-2" />
                                Browse Products
                            </Link>
                            <Link 
                                to="/tenders/user" 
                                className="px-8 py-3 bg-[#2c5282] text-white rounded-md text-lg font-semibold hover:bg-[#1a365d] transition duration-300 flex items-center justify-center"
                            >
                                <FaClipboardList className="mr-2" />
                                Browse Tenders
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-[#1a365d] mb-12">Our Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                            <div className="text-[#1a365d] text-4xl mb-4">
                                <FaBuilding />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-[#1a365d]">Material Procurement</h3>
                            <p className="text-gray-600">Efficient procurement of materials through our streamlined platform.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                            <div className="text-[#1a365d] text-4xl mb-4">
                                <FaClipboardList />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-[#1a365d]">Tender Management</h3>
                            <p className="text-gray-600">Transparent and efficient tender processing system.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                            <div className="text-[#1a365d] text-4xl mb-4">
                                <FaChartLine />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-[#1a365d]">Inventory Control</h3>
                            <p className="text-gray-600">Real-time tracking and management of inventory levels.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="container mx-auto px-6 py-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-[#1a365d]">Featured Materials</h2>
                    <Link 
                        to="/products" 
                        className="flex items-center text-[#1a365d] hover:text-[#2c5282] transition duration-300"
                    >
                        View All <FaArrowRight className="ml-2" />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <FaSpinner className="animate-spin text-[#1a365d] text-4xl" />
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-700 p-4 rounded-md text-center">
                        <p>{error}</p>
                        <button 
                            onClick={fetchFeaturedProducts}
                            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                            <div className="col-span-3 text-center py-12 bg-gray-50 rounded-lg">
                                <p className="text-lg text-gray-600">No featured products available at the moment.</p>
                                <Link 
                                    to="/products" 
                                    className="mt-4 inline-block px-6 py-2 bg-[#1a365d] text-white rounded-md hover:bg-[#2c5282] transition duration-300"
                                >
                                    Browse All Products
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="bg-[#1a365d] text-white py-8">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                            <p className="text-gray-300">Email: info@mms.gov.in</p>
                            <p className="text-gray-300">Phone: 1800-XXX-XXXX</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><Link to="/products" className="text-gray-300 hover:text-white">Products</Link></li>
                                <li><Link to="/tenders/user" className="text-gray-300 hover:text-white">Tenders</Link></li>
                                <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">About</h3>
                            <p className="text-gray-300">
                                A government initiative for efficient material management and procurement.
                            </p>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
                        <p>&copy; {new Date().getFullYear()} Material Management System. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;