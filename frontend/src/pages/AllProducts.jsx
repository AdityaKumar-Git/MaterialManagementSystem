import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import axios from "../axios.js";

// const allProducts = [
//     {
//         name: "Transformers",
//         price: 150000,
//         stock: 5,
//         description: "High-performance step-down transformers suitable for industrial use.",
//         image: "https://placehold.co/300x200",
//     },
//     {
//         name: "Switches",
//         price: 1500,
//         stock: 30,
//         description: "Durable electrical switches with safety lock mechanism.",
//         image: "https://placehold.co/300x200",
//     },
//     {
//         name: "Insulators",
//         price: 700,
//         stock: 100,
//         description: "Ceramic insulators for high-voltage transmission lines.",
//         image: "https://placehold.co/300x200",
//     },
//     {
//         name: "VCB/MCB",
//         price: 8500,
//         stock: 15,
//         description: "Reliable vacuum and miniature circuit breakers for protection.",
//         image: "https://placehold.co/300x200",
//     },
//     {
//         name: "Conductors",
//         price: 12000,
//         stock: 25,
//         description: "Aluminum and ACSR conductors with high current capacity.",
//         image: "https://placehold.co/300x200",
//     },
//     {
//         name: "H-Beams",
//         price: 3000,
//         stock: 40,
//         description: "Steel H-beams used for power infrastructure and support.",
//         image: "https://placehold.co/300x200",
//     },
//     {
//         name: "Poles",
//         price: 6000,
//         stock: 20,
//         description: "Galvanized steel poles for transmission and distribution.",
//         image: "https://placehold.co/300x200",
//     },
//     {
//         name: "RS. Joints",
//         price: 1100,
//         stock: 60,
//         description: "Robust RS. joints ensuring stable mechanical connections.",
//         image: "https://placehold.co/300x200",
//     },
// ];

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
