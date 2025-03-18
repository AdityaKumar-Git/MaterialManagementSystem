import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-white text-gray-500 text-sm text-center py-4 border-t">
            <nav className="mb-2">
                <ul className="flex justify-center space-x-6">
                    <li><Link to="/" className="hover:underline">Home</Link></li>
                    <li><Link to="/products" className="hover:underline">Products</Link></li>
                    <li><Link to="/faqs" className="hover:underline">FAQs</Link></li>
                    <li><Link to="/about" className="hover:underline">About</Link></li>
                    <li><Link to="/contact" className="hover:underline">Contact</Link></li>
                </ul>
            </nav>
            <hr className="border-gray-300 w-3/4 mx-auto" />
            <p className="mt-2">&copy; {new Date().getFullYear()} Company, Inc</p>
        </footer>
    );
};

export default Footer;
