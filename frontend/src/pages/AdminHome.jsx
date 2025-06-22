import AdminCard from "../components/AdminCard";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const adminActions = [
        {
            title: "Add Product",
            description: "Add new items to your inventory.",
            type: "add",
            onClick: () => navigate("/addProduct"),
        },
        {
            title: "Manage Stock",
            description: "Update existing product quantities.",
            type: "stock",
            onClick: () => navigate("/products"),
        },
        {
            title: "View Orders",
            description: "Check and process incoming orders.",
            type: "orders",
            onClick: () => navigate("/viewOrders"),
        },
        {
            title: "Manage Tenders",
            description: "Create and manage procurement tenders.",
            type: "tender",
            onClick: () => navigate("/tenders"),
        },
        {
            title: "Store Items",
            description: "View store inventories.",
            type: "store",
            onClick: () => navigate("/viewStore"),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-5xl font-bold mb-10">Welcome back, Admin 👋</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {adminActions.map((action) => (
                    <AdminCard key={action.title} {...action} />
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;