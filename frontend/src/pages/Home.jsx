import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    
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
                <h2 className="text-3xl font-semibold text-center mb-8">Featured Materials</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ProductCard 
                        name="Transformers"
                        price={150000}
                        stock={5}
                        description="High-performance step-down transformers suitable for industrial use."
                        image="https://placehold.co/300x200"
                    />
                    <ProductCard 
                        name="Switches"
                        price={1500}
                        stock={30}
                        description="Durable electrical switches with safety lock mechanism."
                        image="https://placehold.co/300x200"
                    />
                    <ProductCard 
                        name="Insulators"
                        price={700}
                        stock={100}
                        description="Ceramic insulators for high-voltage transmission lines."
                        image="https://placehold.co/300x200"
                    />
                </div>
            </section>
        </div>
    );
};

export default Home;
