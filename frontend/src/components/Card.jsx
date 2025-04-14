import { Link } from "react-router-dom";

const Card = ({ image, title, description, link }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <img src={image} alt={title} className="w-full h-48 object-cover rounded-md" />
            <h3 className="text-xl font-semibold mt-4">{title}</h3>
            <p className="text-gray-600">{description}</p>
            <Link to={link} className="mt-3 inline-block text-blue-600 font-semibold hover:underline">
                View Details
            </Link>
        </div>
    );
};

export default Card;