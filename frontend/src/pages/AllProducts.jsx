import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import axios from "../axios.js";

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/products/getAllProducts');
                setProducts(response.data.data);
            } catch (err) {
                setError(err?.response?.data?.message || "Server error.");
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Hero/Header */}
            <section className="bg-gradient-to-r from-[#1a365d] to-[#2c5282] text-white py-16 mb-0">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">All Products</h1>
                    <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto">
                        Explore our complete catalog of materials and products available for procurement.
                    </p>
                </div>
            </section>

            {/* Products Grid */}
            <main className="flex-1 container mx-auto px-6 py-12">
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-md text-center mb-8">
                        <p>{error}</p>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.length > 0 ? (
                        products.map((product, idx) => (
                            <ProductCard key={idx} {...product} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-blue-900">
                            No products available at the moment.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AllProducts;
