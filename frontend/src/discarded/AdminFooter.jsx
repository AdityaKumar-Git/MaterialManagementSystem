const AdminFooter = () => {
    return (
        <footer className="mt-16 border-t pt-6 pb-4 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Admin Dashboard. All rights reserved.</p>
            {/* <p className="mt-1">Built with ❤️ by YourCompany</p> */}
        </footer>
    );
};

export default AdminFooter;
