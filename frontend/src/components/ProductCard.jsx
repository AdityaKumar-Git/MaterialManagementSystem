import { useNavigate } from "react-router-dom";
import { selectAdminAuth } from "../store/adminSlice";
import { useSelector } from "react-redux";

const ProductCard = ({ name, price, stock, description, image, _id }) => {
    const navigate = useNavigate();
    const adminAuth = useSelector(selectAdminAuth);
    
    const handleClick = () => {
        if(adminAuth) {
            navigate(`/updateProduct/${_id}`);
        } else {
            navigate(`/products/${_id}`);
        }
    };
    
    return (
        <div 
            className="bg-white shadow-md rounded-lg overflow-hidden p-4 flex flex-col transition hover:shadow-xl cursor-pointer"
            onClick={handleClick}
        >
            <img
                src={image[0] || image || "https://via.placeholder.com/300x200?text=No+Image"}
                alt={name}
                className={`w-full h-48 object-cover rounded-md ${(image === "") ? "hidden" : ""}`}
            />
            <div className="mt-4 flex flex-col gap-1">
                <h3 className="text-lg font-bold text-gray-800 truncate">{name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
                <div className="flex justify-between mt-3 items-center">
                    <span className="text-blue-600 font-semibold">₹{price}</span>
                    <span
                        className={`px-2 py-1 text-xs rounded-full ${
                            stock > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}
                    >
                        {stock > 0 ? `In Stock: ${stock}` : "Out of Stock"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;