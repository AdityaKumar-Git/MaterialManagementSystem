import { useState } from "react";
import axios from "../axios.js";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        stock: "",
    });
    const [images, setImages] = useState([]);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
        setImages([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, price, description, stock } = formData;

        // Validation
        if ([name, description].some((field) => field.trim() === "")) {
            return setError("All fields are required.");
        }
        if (price <= 0) {
            return setError("Price must be greater than 0.");
        }
        if (stock <= 0) {
            return setError("Stock must be greater than 0.");
        }
        if (images.length === 0) {
            return setError("At least one product image is required.");
        }

        try {
            const productForm = new FormData();
            productForm.append("name", name);
            productForm.append("price", price);
            productForm.append("description", description);
            productForm.append("stock", stock);
            images.forEach((img) => productForm.append("images", img));

            const response = await axios.post("products/addProduct", productForm, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response?.data?.success) {
                console.log("Product added:", response.data);
                navigate("/adminHome");
            } else {
                setError(response?.data?.message || "Something went wrong.");
            }
        } catch (err) {
            console.log("AddProduct Error:", err);
            setError(err?.response?.data?.message || "Server error.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg text-center">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Add New Product</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                    <input
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="px-4 py-2 border rounded-md"
                        required
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={formData.price}
                        onChange={handleChange}
                        className="px-4 py-2 border rounded-md"
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="px-4 py-2 border rounded-md h-24"
                        required
                    />
                    <input
                        type="number"
                        name="stock"
                        placeholder="Stock Quantity"
                        value={formData.stock}
                        onChange={handleChange}
                        className="px-4 py-2 border rounded-md"
                        required
                    />
                    <input
                        type="file"
                        name="images"
                        multiple
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="px-2 py-1"
                        required
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg font-semibold hover:bg-blue-700"
                    >
                        Add Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
