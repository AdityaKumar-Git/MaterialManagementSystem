const AdminHeader = () => {
    return (
        <header className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-800">
                <img src="../../public/logo.svg" className="h-8 inline"/> Admin Dashboard
            </div>
            <nav className="space-x-4 hidden md:block">
                <button className="text-gray-600 hover:text-blue-600 transition">Dashboard</button>
                <button className="text-gray-600 hover:text-blue-600 transition">Products</button>
                <button className="text-gray-600 hover:text-blue-600 transition">Orders</button>
            </nav>
            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 hidden sm:block">admin@example.com</span>
                <img
                    src="https://ui-avatars.com/api/?name=Admin"
                    alt="Admin Avatar"
                    className="w-9 h-9 rounded-full"
                />
            </div>
        </header>
    );
};

export default AdminHeader;
