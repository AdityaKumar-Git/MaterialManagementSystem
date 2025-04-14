import { FaBoxOpen, FaClipboardList, FaPlus } from "react-icons/fa";

const icons = {
    add: <FaPlus className="text-4xl text-blue-600" />,
    stock: <FaBoxOpen className="text-4xl text-green-600" />,
    orders: <FaClipboardList className="text-4xl text-purple-600" />,
};

const AdminCard = ({ title, description, type, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-xl transition duration-200 flex flex-col items-center text-center"
        >
            {icons[type] || <FaClipboardList className="text-4xl text-gray-500" />}
            <h3 className="text-xl font-semibold mt-4">{title}</h3>
            <p className="text-gray-600 mt-2">{description}</p>
        </div>
    );
};

export default AdminCard;
