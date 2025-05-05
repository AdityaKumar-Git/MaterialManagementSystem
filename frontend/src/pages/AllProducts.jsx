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

    useEffect(()=>{
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/products/getAllProducts');
                setProducts(response.data.data);
            }
            catch (err) {
                console.log("Fetch Products Error:", err);
                setError(err?.response?.data?.message || "Server error.");
            }
        };
        fetchProducts();
    },[])

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-4xl font-bold text-blue-700 mb-8 text-center">All Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {error && 
                    <div>
                        <p className="text-red-600 text-center">{error}</p>
                    </div>
                }
                {products.map((product, idx) => (
                    <ProductCard key={idx} {...product} />
                ))}
            </div>
        </div>
    );
};

export default AllProducts;
