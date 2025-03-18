import { Link } from "react-router-dom";

const Home = () => {
    
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
                    {/* Sample Product Cards */}
                    <div className="bg-white shadow-md rounded-lg p-4">
                        <img src="https://placehold.co/300x200" alt="Material" className="w-full h-48 object-cover rounded-md" />
                        <h3 className="text-xl font-semibold mt-4">Steel Rods</h3>
                        <p className="text-gray-600">High-quality steel rods for construction.</p>
                        <Link to="/products/1" className="mt-3 inline-block text-blue-600 font-semibold hover:underline">
                            View Details
                        </Link>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-4">
                        <img src="https://placehold.co/300x200" alt="Material" className="w-full h-48 object-cover rounded-md" />
                        <h3 className="text-xl font-semibold mt-4">Cement Bags</h3>
                        <p className="text-gray-600">Premium cement for strong foundations.</p>
                        <Link to="/products/2" className="mt-3 inline-block text-blue-600 font-semibold hover:underline">
                            View Details
                        </Link>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-4">
                        <img src="https://placehold.co/300x200" alt="Material" className="w-full h-48 object-cover rounded-md" />
                        <h3 className="text-xl font-semibold mt-4">Electrical Wires</h3>
                        <p className="text-gray-600">Durable and safe electrical wiring solutions.</p>
                        <Link to="/products/3" className="mt-3 inline-block text-blue-600 font-semibold hover:underline">
                            View Details
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
